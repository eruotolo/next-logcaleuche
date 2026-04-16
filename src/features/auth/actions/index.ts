'use server';

import { cache } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthError } from 'next-auth';

import { ACTIVITY_ACTION, ACTIVITY_ENTITY, ACTIVITY_STATUS } from '@/shared/constants/activity-log';
import { BCRYPT_ROUNDS, auth, signIn } from '@/shared/lib/auth';
import { logActivity } from '@/shared/lib/activity-log';
import { prisma } from '@/shared/lib/db';
import { sendRecovery } from '@/shared/lib/email';
import type { ActionResult } from '@/shared/types/actions';

import {
    generateBackupCodes,
    generateQRDataUrl,
    generateSecret,
    hashBackupCodes,
    verifyBackupCode,
    verifyTOTP,
} from '../lib/totp';
import { LoginByIdentifierSchema, RecoverySchema, ResetPasswordSchema } from '../schemas';

// Duración de validez del token de recuperación: 2 horas
const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000;

// ── Rate limiting en memoria ──────────────────────────────────────────────────
// Shared across all auth actions. Keys: 'login:{ip}' | 'recovery:{ip}'
// NOTE: In serverless (Vercel), state is per-instance. For cross-instance
// persistence configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

const RATE_LIMITS = {
    login:    { max: 10, windowMs: 10 * 60 * 1000 }, // 10 intentos / 10 min
    recovery: { max: 5,  windowMs: 15 * 60 * 1000 }, // 5 intentos  / 15 min
} as const;

function checkRateLimit(key: string, type: keyof typeof RATE_LIMITS): boolean {
    const now = Date.now();

    // Cleanup periódico para evitar memory leaks
    if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
        for (const [k, v] of rateLimitMap) {
            if (now >= v.resetAt) rateLimitMap.delete(k);
        }
        lastCleanup = now;
    }

    const { max, windowMs } = RATE_LIMITS[type];
    const entry = rateLimitMap.get(key);
    if (!entry || now >= entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (entry.count >= max) return false;
    entry.count++;
    return true;
}

export async function loginAction(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const headersList = await headers();
    const ip =
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        headersList.get('x-real-ip') ??
        'unknown';

    if (!checkRateLimit(`login:${ip}`, 'login')) {
        return {
            success: false,
            error: 'Demasiados intentos de acceso. Espera 10 minutos antes de volver a intentarlo.',
        };
    }

    const parsed = LoginByIdentifierSchema.safeParse({
        identifier: formData.get('identifier'),
        password: formData.get('password'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Credenciales inválidas.' };
    }

    try {
        await signIn('credentials', {
            identifier: parsed.data.identifier,
            password: parsed.data.password,
            redirectTo: '/dashboard',
        });
        return { success: true, data: null };
    } catch (error) {
        // 2FA required — authorize() throws a plain Error (not AuthError) with this prefix
        if (error instanceof Error && error.message.startsWith('TWO_FACTOR_REQUIRED:')) {
            const tempToken = error.message.split(':')[1];
            redirect(`/login/verify-2fa?token=${tempToken}`);
        }
        if (error instanceof AuthError) {
            await logActivity({
                action: ACTIVITY_ACTION.AUTH_LOGIN_FAILED,
                entity: ACTIVITY_ENTITY.AUTH,
                description: `Login fallido para: ${parsed.data.identifier}`,
                status: ACTIVITY_STATUS.FAILURE,
                overrideUserId: null,
                overrideUserEmail: parsed.data.identifier,
            });
            return {
                success: false,
                error: 'Credenciales incorrectas. Verifica tu email o RUT y contraseña.',
            };
        }
        throw error;
    }
}

export async function recoveryAction(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    // Obtener headers una sola vez para rate limiting y baseUrl
    const headersList = await headers();
    const ip =
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        headersList.get('x-real-ip') ??
        'unknown';

    if (!checkRateLimit(`recovery:${ip}`, 'recovery')) {
        return {
            success: false,
            error: 'Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.',
        };
    }

    const parsed = RecoverySchema.safeParse({ email: formData.get('email') });

    if (!parsed.success) {
        return { success: false, error: 'Ingresa un email válido.' };
    }

    const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        select: { id: true, name: true, lastName: true, active: true },
    });

    // Respuesta genérica para no revelar si el email existe
    if (!user || !user.active) {
        return { success: true, data: null };
    }

    const token = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_MS);
    await prisma.user.update({ where: { id: user.id }, data: { token, tokenExpiry } });

    // Obtener la URL base desde los headers de la request (ya obtenidos arriba)
    const host = headersList.get('host') ?? 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const nombre = `${user.name ?? ''} ${user.lastName ?? ''}`.trim();

    await sendRecovery(parsed.data.email, nombre, token, baseUrl).catch((err: unknown) => {
        console.error('[recoveryAction] Fallo al enviar email de recuperación:', err);
    });

    await logActivity({
        action: ACTIVITY_ACTION.AUTH_PASSWORD_RECOVERY,
        entity: ACTIVITY_ENTITY.AUTH,
        description: `Solicitud de recuperación de contraseña para: ${parsed.data.email}`,
        overrideUserId: user.id,
    });

    return { success: true, data: null };
}

export async function confirmRecoveryAction(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const token = formData.get('token') as string;
    if (!token) return { success: false, error: 'Token inválido.' };

    const parsed = ResetPasswordSchema.safeParse({
        password: formData.get('password'),
        confirm: formData.get('confirm'),
    });

    if (!parsed.success) {
        const msgs = parsed.error.flatten().fieldErrors;
        return { success: false, error: Object.values(msgs).flat()[0] ?? 'Datos inválidos.' };
    }

    const user = await prisma.user.findFirst({
        where: { token },
        select: { id: true, tokenExpiry: true },
    });
    if (!user) return { success: false, error: 'El enlace es inválido o ya fue utilizado.' };
    if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
        return { success: false, error: 'El enlace ha expirado. Solicita uno nuevo.' };
    }

    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.hash(parsed.data.password, BCRYPT_ROUNDS);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed, token: null, tokenExpiry: null },
    });

    await logActivity({
        action: ACTIVITY_ACTION.AUTH_PASSWORD_RESET,
        entity: ACTIVITY_ENTITY.AUTH,
        description: 'Contraseña restablecida mediante token de recuperación',
        overrideUserId: user.id,
    });

    return { success: true, data: null };
}

// ── 2FA Actions ──────────────────────────────────────────────────────────────

/**
 * Initiate 2FA setup: generate a secret + QR code + plain backup codes.
 * Nothing is persisted yet — the user must confirm with a valid TOTP code.
 */
export async function initiate2FASetup(): Promise<
    ActionResult<{ qrDataUrl: string; backupCodes: string[]; tempSecret: string }>
> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'No autorizado.' };

    const secret = generateSecret();
    const qrDataUrl = await generateQRDataUrl(secret, session.user.email ?? '');
    const plainCodes = generateBackupCodes(8);

    return { success: true, data: { qrDataUrl, backupCodes: plainCodes, tempSecret: secret } };
}

/**
 * Confirm 2FA setup: validate TOTP code with the temp secret, then persist.
 * The tempSecret and plaintext backupCodes are passed as hidden form fields
 * (they are session-scoped transient data, never stored until confirmed here).
 */
export async function confirm2FASetup(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'No autorizado.' };

    const code = (formData.get('code') as string | null) ?? '';
    const tempSecret = (formData.get('tempSecret') as string | null) ?? '';
    const rawCodes = (formData.get('backupCodes') as string | null) ?? '';

    if (!code || !tempSecret || !rawCodes) return { success: false, error: 'Datos incompletos.' };

    if (!verifyTOTP(tempSecret, code.replace(/\s/g, ''))) {
        return { success: false, error: 'Código incorrecto. Verifica tu app autenticadora.' };
    }

    const plainCodes: string[] = JSON.parse(rawCodes) as string[];
    const hashedCodes = await hashBackupCodes(plainCodes);

    await prisma.user.update({
        where: { id: Number(session.user.id) },
        data: {
            twoFactorSecret: tempSecret,
            twoFactorEnabled: true,
            backupCodes: hashedCodes,
        },
    });

    return { success: true, data: null };
}

/**
 * Disable 2FA: requires user to confirm with their current TOTP code.
 */
export async function disable2FA(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'No autorizado.' };

    const code = (formData.get('code') as string | null) ?? '';
    if (!code) return { success: false, error: 'Ingresa tu código TOTP actual.' };

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
        return { success: false, error: '2FA no está activado.' };
    }

    if (!verifyTOTP(user.twoFactorSecret, code.replace(/\s/g, ''))) {
        return { success: false, error: 'Código incorrecto.' };
    }

    await prisma.user.update({
        where: { id: Number(session.user.id) },
        data: { twoFactorSecret: null, twoFactorEnabled: false, backupCodes: [] },
    });

    return { success: true, data: null };
}

/**
 * Verify a TOTP / backup code during the login 2FA step.
 * On success, clears the temp token and performs signIn (which issues the JWT).
 */
export async function verify2FALogin(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const tempToken = (formData.get('tempToken') as string | null) ?? '';
    const code = (formData.get('code') as string | null) ?? '';

    if (!tempToken || !code) return { success: false, error: 'Datos incompletos.' };

    const user = await prisma.user.findFirst({
        where: { twoFactorTempToken: tempToken },
        select: {
            id: true,
            twoFactorSecret: true,
            backupCodes: true,
            twoFactorTempExpiry: true,
        },
    });

    if (!user) return { success: false, error: 'Sesión de verificación inválida o expirada.' };

    if (!user.twoFactorTempExpiry || user.twoFactorTempExpiry < new Date()) {
        return {
            success: false,
            error: 'El tiempo de verificación expiró. Inicia sesión nuevamente.',
        };
    }

    const cleanCode = code.replace(/\s/g, '');
    let valid = false;

    // Try TOTP first
    if (user.twoFactorSecret && verifyTOTP(user.twoFactorSecret, cleanCode)) {
        valid = true;
    } else {
        // Try backup code
        const idx = await verifyBackupCode(cleanCode, user.backupCodes);
        if (idx >= 0) {
            valid = true;
            // Invalidate the used backup code
            const newCodes = [...user.backupCodes];
            newCodes.splice(idx, 1);
            await prisma.user.update({ where: { id: user.id }, data: { backupCodes: newCodes } });
        }
    }

    if (!valid) return { success: false, error: 'Código incorrecto.' };

    // Clear temp token — the client will redirect to /dashboard
    await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorTempToken: null, twoFactorTempExpiry: null },
    });

    // signIn via the special userId-based path in authorize()
    await signIn('credentials', { userId: String(user.id), redirectTo: '/dashboard' });

    // signIn throws a redirect internally — this line is unreachable but satisfies TypeScript
    return { success: true, data: null };
}

/** Solo expone datos no sensibles para la página de login pública. */
export const getPublicStats = cache(async function getPublicStats() {
    const [hermanosActivos, proximaTenida] = await Promise.all([
        prisma.user.count({ where: { active: true } }),
        prisma.evento.findFirst({
            where: { fecha: { gte: new Date() }, active: 1 },
            orderBy: { fecha: 'asc' },
            // Solo la fecha — el nombre del evento no se expone en página pública
            select: { fecha: true },
        }),
    ]);

    return { hermanosActivos, proximaTenida };
});

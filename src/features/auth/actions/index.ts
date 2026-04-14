'use server';

import { headers } from 'next/headers';

import { AuthError } from 'next-auth';

import { ACTIVITY_ACTION, ACTIVITY_ENTITY, ACTIVITY_STATUS } from '@/shared/constants/activity-log';
import { signIn } from '@/shared/lib/auth';
import { logActivity } from '@/shared/lib/activity-log';
import { prisma } from '@/shared/lib/db';
import { sendRecovery } from '@/shared/lib/email';
import type { ActionResult } from '@/shared/types/actions';

import { LoginByIdentifierSchema, RecoverySchema, ResetPasswordSchema } from '../schemas';

// Rate limiting en memoria: máximo 5 intentos por IP en 15 minutos
const recoveryAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

// Duración de validez del token de recuperación: 2 horas
const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const attempt = recoveryAttempts.get(ip);
    if (!attempt || now >= attempt.resetAt) {
        recoveryAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }
    if (attempt.count >= RATE_LIMIT_MAX) return false;
    attempt.count++;
    return true;
}

export async function loginAction(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
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

    if (!checkRateLimit(ip)) {
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
    const hashed = await bcrypt.hash(parsed.data.password, 10);

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

export async function getPublicStats() {
    const [hermanosActivos, proximaTenida] = await Promise.all([
        prisma.user.count({ where: { active: true } }),
        prisma.evento.findFirst({
            where: { fecha: { gte: new Date() }, active: 1 },
            orderBy: { fecha: 'asc' },
            select: { nombre: true, fecha: true },
        }),
    ]);

    return { hermanosActivos, proximaTenida };
}

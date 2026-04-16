import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

/** Rounds de bcrypt — usar en todo el proyecto para consistencia. */
export const BCRYPT_ROUNDS = 12;

import { ACTIVITY_ACTION, ACTIVITY_ENTITY, ACTIVITY_STATUS } from '@/shared/constants/activity-log';

import { prisma } from './db';
import { cleanRut } from './rut';

const loginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: 'jwt',
        // 8 horas de sesión activa; rota el token cada 1 hora si hay actividad
        maxAge: 8 * 60 * 60,
        updateAge: 60 * 60,
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                identifier: { label: 'Email o RUT', type: 'text' },
                password: { label: 'Contraseña', type: 'password' },
                // Step-2 only: userId is set after 2FA verification passes
                userId: { label: 'User ID (2FA step 2)', type: 'text' },
            },
            async authorize(credentials) {
                // ── 2FA step 2: bypass password — ID already verified by verify2FALogin ──
                if (credentials?.userId) {
                    const userId = Number(credentials.userId);
                    if (Number.isNaN(userId)) return null;

                    const user = await prisma.user.findUnique({
                        where: { id: userId, active: true },
                        include: { grado: true, oficialidad: true, category: true },
                    });
                    if (!user) return null;

                    return {
                        id: String(user.id),
                        email: user.email,
                        name: `${user.name ?? ''} ${user.lastName ?? ''}`.trim(),
                        image: user.image ?? null,
                        rut: user.username,
                        grado: user.gradoId ?? 1,
                        gradoNombre: user.grado?.nombre ?? 'Aprendiz',
                        oficialidad: user.oficialidadId ?? 1,
                        oficialidadNombre: user.oficialidad?.nombre ?? 'Ninguno',
                        categoryId: user.categoryId ?? 3,
                        categoryNombre: user.category?.nombre ?? 'Usuario',
                        active: user.active,
                    };
                }

                // ── Step 1: normal email/RUT + password flow ──────────────────────────────
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { identifier: rawIdentifier, password } = parsed.data;

                // Detectar si es email (contiene @) o RUT (username en BD)
                const isEmail = rawIdentifier.includes('@');
                const identifier = isEmail ? rawIdentifier : cleanRut(rawIdentifier);

                const user = await prisma.user.findUnique({
                    where: isEmail ? { email: identifier } : { username: identifier },
                    include: {
                        grado: true,
                        oficialidad: true,
                        category: true,
                    },
                    // Include 2FA fields for the gate check below
                });

                if (!user || !user.active) return null;

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return null;

                // ── 2FA gate: issue a temp token and block normal JWT issuance ────────────
                if (user.twoFactorEnabled) {
                    const tempToken = crypto.randomUUID();
                    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { twoFactorTempToken: tempToken, twoFactorTempExpiry: expiry },
                    });
                    // Throwing a plain Error (not AuthError) lets loginAction catch it cleanly
                    throw new Error(`TWO_FACTOR_REQUIRED:${tempToken}`);
                }

                return {
                    id: String(user.id),
                    email: user.email,
                    name: `${user.name ?? ''} ${user.lastName ?? ''}`.trim(),
                    image: user.image ?? null,
                    rut: user.username,
                    grado: user.gradoId ?? 1,
                    gradoNombre: user.grado?.nombre ?? 'Aprendiz',
                    oficialidad: user.oficialidadId ?? 1,
                    oficialidadNombre: user.oficialidad?.nombre ?? 'Ninguno',
                    categoryId: user.categoryId ?? 3,
                    categoryNombre: user.category?.nombre ?? 'Usuario',
                    active: user.active,
                };
            },
        }),
    ],
    events: {
        async signIn({ user }) {
            try {
                await prisma.activityLog.create({
                    data: {
                        userId: user.id ? Number(user.id) : null,
                        userEmail: user.email ?? null,
                        userName: user.name ?? null,
                        action: ACTIVITY_ACTION.AUTH_LOGIN,
                        entity: ACTIVITY_ENTITY.AUTH,
                        description: `Inicio de sesión: ${user.email ?? user.name ?? 'usuario desconocido'}`,
                        status: ACTIVITY_STATUS.SUCCESS,
                    },
                });
            } catch {
                // no romper el flujo de login por fallo de logging
            }
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.rut = user.rut;
                token.grado = user.grado;
                token.gradoNombre = user.gradoNombre;
                token.oficialidad = user.oficialidad;
                token.oficialidadNombre = user.oficialidadNombre;
                token.categoryId = user.categoryId;
                token.categoryNombre = user.categoryNombre;
                token.active = user.active;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.rut = token.rut as string;
                session.user.grado = token.grado as number;
                session.user.gradoNombre = token.gradoNombre as string;
                session.user.oficialidad = token.oficialidad as number;
                session.user.oficialidadNombre = token.oficialidadNombre as string;
                session.user.categoryId = token.categoryId as number;
                session.user.categoryNombre = token.categoryNombre as string;
                session.user.active = token.active as boolean;
            }
            return session;
        },
    },
});

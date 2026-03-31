import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { prisma } from './db';

const loginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                identifier: { label: 'Email o RUT', type: 'text' },
                password: { label: 'Contraseña', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { identifier, password } = parsed.data;

                // Detectar si es email (contiene @) o RUT (username en BD)
                const isEmail = identifier.includes('@');

                const user = await prisma.user.findUnique({
                    where: isEmail ? { email: identifier } : { username: identifier },
                    include: {
                        grado: true,
                        oficialidad: true,
                        category: true,
                    },
                });

                if (!user || !user.active) return null;

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return null;

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

'use server';

import { redirect } from 'next/navigation';

import { MOTIVO_ENTRADA, MOTIVO_SALIDA } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

interface BirthdayEntry {
    id: number;
    name: string | null;
    lastName: string | null;
    image: string | null;
    nextBirthday: Date;
    daysUntil: number;
}

function computeUpcomingBirthdays(
    users: { id: number; name: string | null; lastName: string | null; dateBirthday: Date | null; image: string | null }[],
    today: Date,
): BirthdayEntry[] {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return users
        .map((u) => {
            const bday = u.dateBirthday as Date;
            const currentYear = today.getFullYear();
            let next = new Date(currentYear, bday.getUTCMonth(), bday.getUTCDate());
            if (next < startOfToday) {
                next = new Date(currentYear + 1, bday.getUTCMonth(), bday.getUTCDate());
            }
            const daysUntil = Math.round(
                (next.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
            );
            return { id: u.id, name: u.name, lastName: u.lastName, image: u.image, nextBirthday: next, daysUntil };
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);
}

export async function getDashboardData() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isTesorero =
        session.user.oficialidad === 7 || session.user.categoryId <= 2;

    const eventGradoFilter =
        grado === 1 ? { gradoId: 1 } : grado === 2 ? { gradoId: { in: [1, 2] } } : {};

    // Todas las queries independientes en paralelo
    const [feedPosts, usersWithBirthday, eventos, activeUsersCount, tesorero] = await Promise.all([
        prisma.feed.findMany({
            where: { active: 1 },
            include: {
                category: true,
                user: { select: { name: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 6,
        }),
        prisma.user.findMany({
            where: { active: true, dateBirthday: { not: null } },
            select: { id: true, name: true, lastName: true, dateBirthday: true, image: true },
        }),
        prisma.evento.findMany({
            where: {
                active: 1,
                fecha: { gte: startOfToday },
                ...eventGradoFilter,
            },
            include: { grado: true, tipoActividad: true },
            orderBy: { fecha: 'asc' },
            take: 7,
        }),
        prisma.user.count({ where: { active: true } }),
        // Solo buscar tesorero si el usuario tiene acceso a tesorería
        isTesorero
            ? prisma.user.findUnique({
                  where: { username: process.env.RUT_EXCLUIDO ?? '' },
                  select: { id: true },
              })
            : Promise.resolve(null),
    ]);

    const upcomingBirthdays = computeUpcomingBirthdays(usersWithBirthday, today);

    // Calcular tesorería SOLO si el usuario es tesorero o admin
    let tesoreria: { totalIngresos: number; totalEgresos: number; balance: number } | null = null;
    if (isTesorero) {
        const whereEntrada = tesorero
            ? {
                  NOT: [
                      { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] },
                      { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
                  ],
              }
            : { NOT: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA } };

        const [ingresos, egresos] = await Promise.all([
            prisma.entradaDinero.aggregate({
                _sum: { monto: true },
                where: whereEntrada,
            }),
            prisma.salidaDinero.aggregate({
                _sum: { monto: true },
                where: { NOT: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA } },
            }),
        ]);

        const totalIngresos = Number(ingresos._sum.monto ?? 0);
        const totalEgresos = Number(egresos._sum.monto ?? 0);
        tesoreria = { totalIngresos, totalEgresos, balance: totalIngresos - totalEgresos };
    }

    return { feedPosts, upcomingBirthdays, eventos, activeUsersCount, tesoreria };
}

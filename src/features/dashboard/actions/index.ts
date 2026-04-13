'use server';

import { redirect } from 'next/navigation';

import { MOTIVO_ENTRADA, MOTIVO_SALIDA } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export async function getDashboardData() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado;
    const _userId = Number.parseInt(session.user.id, 10);
    const today = new Date();

    // 1. Últimos 6 posts del feed
    const feedPosts = await prisma.feed.findMany({
        where: { active: 1 },
        include: {
            category: true,
            user: { select: { name: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
    });

    // 2. Próximos cumpleaños en los siguientes 30 días (maneja wrap de año correctamente)
    const usersWithBirthday = await prisma.user.findMany({
        where: { active: true, dateBirthday: { not: null } },
        select: { id: true, name: true, lastName: true, dateBirthday: true, image: true },
    });

    // Calcular el próximo cumpleaños (año actual o siguiente si ya pasó)
    // y tomar los próximos 6 sin límite de días
    const startOfToday30 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    interface BirthdayEntry {
        id: number;
        name: string | null;
        lastName: string | null;
        image: string | null;
        nextBirthday: Date;
        daysUntil: number;
    }

    const upcomingBirthdays: BirthdayEntry[] = usersWithBirthday
        .map((u) => {
            // dateBirthday is guaranteed non-null by the where filter above
            const bday = u.dateBirthday as Date;
            const currentYear = today.getFullYear();
            // Intentar con el año actual
            let next = new Date(currentYear, bday.getMonth(), bday.getDate());
            // Si ya pasó (estrictamente antes de hoy), usar el año siguiente
            if (next < startOfToday30) {
                next = new Date(currentYear + 1, bday.getMonth(), bday.getDate());
            }
            const daysUntil = Math.round(
                (next.getTime() - startOfToday30.getTime()) / (1000 * 60 * 60 * 24),
            );
            return { id: u.id, name: u.name, lastName: u.lastName, image: u.image, nextBirthday: next, daysUntil };
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);

    // 3. Próximos 7 eventos futuros filtrados por grado
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const eventGradoFilter =
        grado === 1 ? { gradoId: 1 } : grado === 2 ? { gradoId: { in: [1, 2] } } : {};

    const eventos = await prisma.evento.findMany({
        where: {
            active: 1,
            fecha: { gte: startOfToday },
            ...eventGradoFilter,
        },
        include: { grado: true },
        orderBy: { fecha: 'asc' },
        take: 7,
    });

    // 4. Conteo de usuarios activos
    const activeUsersCount = await prisma.user.count({
        where: { active: true },
    });

    // 5. Totales de tesorería para KPI cards (solo admins los ven, pero siempre se calculan)
    const tesorero = await prisma.user.findUnique({
        where: { username: process.env.RUT_EXCLUIDO ?? '' },
        select: { id: true },
    });

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

    const tesoreria = {
        totalIngresos,
        totalEgresos,
        balance: totalIngresos - totalEgresos,
    };

    return { feedPosts, upcomingBirthdays, eventos, activeUsersCount, tesoreria };
}

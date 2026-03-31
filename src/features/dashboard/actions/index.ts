'use server';

import { redirect } from 'next/navigation';

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

    // 2. Próximos 4 cumpleaños (desde hoy en adelante dentro del año)
    const users = await prisma.user.findMany({
        where: { active: true, dateBirthday: { not: null } },
        select: { id: true, name: true, lastName: true, dateBirthday: true, image: true },
    });

    const todayMMDD = `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    const upcomingBirthdays = users
        .filter((u) => {
            const d = u.dateBirthday!;
            const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            return mmdd >= todayMMDD;
        })
        .sort((a, b) => {
            const d = a.dateBirthday!;
            const e = b.dateBirthday!;
            const aMMDD = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            const bMMDD = `${String(e.getMonth() + 1).padStart(2, '0')}${String(e.getDate()).padStart(2, '0')}`;
            return aMMDD.localeCompare(bMMDD);
        })
        .slice(0, 4);

    // 3. Próximos 6 eventos futuros filtrados por grado
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
        take: 6,
    });

    // 4. Conteo de usuarios activos
    const activeUsersCount = await prisma.user.count({
        where: { active: true },
    });

    // 5. Resumen de tesorería del año en curso
    const currentYear = today.getFullYear();

    const currentYearStr = String(currentYear);

    const ingresos = await prisma.entradaDinero.aggregate({
        _sum: { monto: true },
        where: { ano: currentYearStr },
    });

    const egresos = await prisma.salidaDinero.aggregate({
        _sum: { monto: true },
        where: { ano: currentYearStr },
    });

    // Últimos 6 meses de tesorería para mini charts
    // Construir los rangos de mes/año necesarios (evita 12 queries con un loop)
    const MESES_NOMBRE = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];
    const currentMonth = today.getMonth() + 1;
    type MesSlot = { mes: number; ano: number; mesStr: string };
    const slots: MesSlot[] = [];
    for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i;
        let y = currentYear;
        if (m <= 0) {
            m += 12;
            y -= 1;
        }
        // El formato almacenado en BD es "MM - NombreMes" (ej: "01 - Enero")
        const mesStr = `${String(m).padStart(2, '0')} - ${MESES_NOMBRE[m - 1]}`;
        slots.push({ mes: m, ano: y, mesStr });
    }

    // 2 queries en lugar de 12: traer todos los registros del período en bloque
    const anos = [...new Set(slots.map((s) => String(s.ano)))];
    const mesStrs = slots.map((s) => s.mesStr);

    const [ingresosRaw, egresosRaw] = await Promise.all([
        prisma.entradaDinero.findMany({
            where: { ano: { in: anos }, mes: { in: mesStrs } },
            select: { mes: true, ano: true, monto: true },
        }),
        prisma.salidaDinero.findMany({
            where: { ano: { in: anos }, mes: { in: mesStrs } },
            select: { mes: true, ano: true, monto: true },
        }),
    ]);

    // Agrupar en memoria por mes+año
    const ingMap = new Map<string, number>();
    const egMap = new Map<string, number>();
    for (const r of ingresosRaw) {
        const k = `${r.ano}|${r.mes}`;
        ingMap.set(k, (ingMap.get(k) ?? 0) + Number(r.monto ?? 0));
    }
    for (const r of egresosRaw) {
        const k = `${r.ano}|${r.mes}`;
        egMap.set(k, (egMap.get(k) ?? 0) + Number(r.monto ?? 0));
    }

    const monthlyIngresos = slots.map((s) => ({
        mes: s.mes,
        total: ingMap.get(`${s.ano}|${s.mesStr}`) ?? 0,
    }));
    const monthlyEgresos = slots.map((s) => ({
        mes: s.mes,
        total: egMap.get(`${s.ano}|${s.mesStr}`) ?? 0,
    }));

    const totalIngresos = Number(ingresos._sum.monto ?? 0);
    const totalEgresos = Number(egresos._sum.monto ?? 0);
    const balance = totalIngresos - totalEgresos;

    const tesoreria = {
        totalIngresos,
        totalEgresos,
        balance,
        monthlyIngresos,
        monthlyEgresos,
    };

    return { feedPosts, upcomingBirthdays, eventos, activeUsersCount, tesoreria };
}

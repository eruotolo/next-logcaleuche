'use server';

import { requireSuperAdmin } from '@/shared/lib/auth-guards';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

import { ActivityLogsQuerySchema } from '../schemas';

export async function getActivityLogs(rawQuery: Record<string, string | undefined>) {
    const session = await requireSuperAdmin();
    if (!session) throw new Error('No autorizado');

    const parsed = ActivityLogsQuerySchema.parse(rawQuery);
    const { page, pageSize, action, entity, userId, from, to, q } = parsed;

    const where = {
        ...(action ? { action } : {}),
        ...(entity ? { entity } : {}),
        ...(userId ? { userId } : {}),
        ...(from || to
            ? {
                  createdAt: {
                      ...(from ? { gte: new Date(from) } : {}),
                      ...(to ? { lte: new Date(`${to}T23:59:59`) } : {}),
                  },
              }
            : {}),
        ...(q ? { description: { contains: q, mode: 'insensitive' as const } } : {}),
    };

    const [items, total] = await Promise.all([
        prisma.activityLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                user: { select: { id: true, name: true, lastName: true, email: true } },
            },
        }),
        prisma.activityLog.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
}

export async function getActivityLogUsuarios() {
    const session = await requireSuperAdmin();
    if (!session) throw new Error('No autorizado');

    return prisma.user.findMany({
        where: { activityLogs: { some: {} } },
        select: { id: true, name: true, lastName: true, email: true },
        orderBy: { name: 'asc' },
    });
}

export async function markOnboardingSeen(): Promise<void> {
    const session = await auth();
    if (!session?.user?.id) return;
    await prisma.user.update({
        where: { id: Number(session.user.id) },
        data: { hasSeenOnboarding: true },
    });
}

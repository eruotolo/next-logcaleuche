'use server';

import { cache } from 'react';

import { revalidatePath } from 'next/cache';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';
import type { ActionResult } from '@/shared/types/actions';

// ── Tipos públicos ──────────────────────────────────────────────────────────

export interface NotificationItem {
    id: number;
    type: string;
    title: string;
    message: string | null;
    href: string | null;
    read: boolean;
    createdAt: Date;
}

// ── Queries ─────────────────────────────────────────────────────────────────

export const getNotifications = cache(async function getNotifications(): Promise<
    NotificationItem[]
> {
    const session = await auth();
    if (!session) return [];

    return prisma.notification.findMany({
        where: { userId: Number.parseInt(session.user.id, 10) },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
            id: true,
            type: true,
            title: true,
            message: true,
            href: true,
            read: true,
            createdAt: true,
        },
    });
});

export const getUnreadCount = cache(async function getUnreadCount(): Promise<number> {
    const session = await auth();
    if (!session) return 0;

    return prisma.notification.count({
        where: {
            userId: Number.parseInt(session.user.id, 10),
            read: false,
        },
    });
});

// ── Mutaciones ───────────────────────────────────────────────────────────────

export async function markAsRead(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    await prisma.notification.updateMany({
        where: {
            id,
            userId: Number.parseInt(session.user.id, 10), // solo puede marcar las suyas
        },
        data: { read: true },
    });

    revalidatePath('/');
    return { success: true, data: null };
}

export async function markAllAsRead(): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    await prisma.notification.updateMany({
        where: {
            userId: Number.parseInt(session.user.id, 10),
            read: false,
        },
        data: { read: true },
    });

    revalidatePath('/');
    return { success: true, data: null };
}

// ── Helper interno ───────────────────────────────────────────────────────────
// Llamar con try/catch en las acciones principales para que un fallo aquí
// no interrumpa el flujo principal.

export async function createNotifications(
    userIds: number[],
    type: string,
    title: string,
    message?: string,
    href?: string,
): Promise<void> {
    if (userIds.length === 0) return;

    // Excluir usuarios que desactivaron notificaciones in-app para este tipo
    const optedOut = await prisma.notificationPreference.findMany({
        where: { userId: { in: userIds }, type, inApp: false },
        select: { userId: true },
    });
    const optedOutSet = new Set(optedOut.map((p) => p.userId));
    const filteredIds = userIds.filter((id) => !optedOutSet.has(id));

    if (filteredIds.length === 0) return;

    await prisma.notification.createMany({
        data: filteredIds.map((userId) => ({
            userId,
            type,
            title,
            message: message ?? null,
            href: href ?? null,
        })),
        skipDuplicates: true,
    });
}

// ── Preferencias de notificación ─────────────────────────────────────────────

export interface NotificationPreferenceItem {
    type: string;
    inApp: boolean;
    email: boolean;
}

export const getNotificationPreferences = cache(async function getNotificationPreferences(): Promise<
    NotificationPreferenceItem[]
> {
    const session = await auth();
    if (!session) return [];

    return prisma.notificationPreference.findMany({
        where: { userId: Number.parseInt(session.user.id, 10) },
        select: { type: true, inApp: true, email: true },
    });
});

export async function updateNotificationPreference(
    type: string,
    field: 'inApp' | 'email',
    value: boolean,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    const userId = Number.parseInt(session.user.id, 10);

    await prisma.notificationPreference.upsert({
        where: { userId_type: { userId, type } },
        create: {
            userId,
            type,
            inApp: field === 'inApp' ? value : true,
            email: field === 'email' ? value : false,
        },
        update: { [field]: value },
    });

    revalidatePath('/perfil/notificaciones');
    return { success: true, data: null };
}

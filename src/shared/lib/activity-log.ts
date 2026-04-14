import 'server-only';

import { headers } from 'next/headers';

import type { ActivityAction, ActivityEntity, ActivityStatus } from '@/shared/constants/activity-log';

import { auth } from './auth';
import { prisma } from './db';

interface LogActivityParams {
    action: ActivityAction;
    entity?: ActivityEntity;
    entityId?: string | number;
    description: string;
    metadata?: Record<string, unknown>;
    status?: ActivityStatus;
    overrideUserId?: number | null;
    overrideUserEmail?: string | null;
    overrideUserName?: string | null;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
    try {
        const session = await auth().catch(() => null);
        const h = await headers();
        const ip =
            h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            h.get('x-real-ip') ??
            null;
        const userAgent = h.get('user-agent')?.slice(0, 500) ?? null;

        const userId =
            params.overrideUserId !== undefined
                ? params.overrideUserId
                : session?.user?.id
                    ? Number(session.user.id)
                    : null;

        await prisma.activityLog.create({
            data: {
                userId,
                userEmail: params.overrideUserEmail ?? session?.user?.email ?? null,
                userName: params.overrideUserName ?? session?.user?.name ?? null,
                action: params.action,
                entity: params.entity ?? null,
                entityId: params.entityId !== undefined ? String(params.entityId) : null,
                description: params.description,
                metadata: params.metadata
                    ? (JSON.parse(JSON.stringify(params.metadata)) as object)
                    : undefined,
                ipAddress: ip,
                userAgent,
                status: params.status ?? 'success',
            },
        });
    } catch (err) {
        console.error('[activity-log] fallo al registrar:', err);
    }
}

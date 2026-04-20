import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export async function GET() {
    const session = await auth();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = Number.parseInt(session.user.id, 10);

    const [count, notifications] = await Promise.all([
        prisma.notification.count({ where: { userId, read: false } }),
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: { id: true, type: true, title: true, message: true, href: true, read: true, createdAt: true },
        }),
    ]);

    return Response.json({ count, notifications });
}

import { redirect } from 'next/navigation';

import { NotificationBellWrapper } from '@/features/notificaciones/components/NotificationBellWrapper';
import { AdminShell } from '@/shared/components/layout/AdminShell';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const dbUser = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        select: {
            name: true,
            lastName: true,
            image: true,
            gradoId: true,
            oficialidadId: true,
            categoryId: true,
            hasSeenOnboarding: true,
            grado: { select: { nombre: true } },
        },
    });

    if (!dbUser) redirect('/login');

    return (
        <AdminShell
            userName={`${dbUser.name ?? ''} ${dbUser.lastName ?? ''}`.trim()}
            userImage={dbUser.image ?? null}
            userId={session.user.id}
            grado={dbUser.gradoId ?? 1}
            gradoNombre={dbUser.grado?.nombre ?? 'Aprendiz'}
            oficialidad={dbUser.oficialidadId ?? 1}
            categoryId={dbUser.categoryId ?? 3}
            hasSeenOnboarding={dbUser.hasSeenOnboarding ?? true}
            notificationSlot={<NotificationBellWrapper />}
        >
            {children}
        </AdminShell>
    );
}

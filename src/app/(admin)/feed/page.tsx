import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { getEventos } from '@/features/eventos/actions';
import { getCategoryFeeds, getFeedPosts } from '@/features/feed/actions';
import { CreateFeedModal } from '@/features/feed/components/CreateFeedModal';
import { FeedList } from '@/features/feed/components/FeedList';
import { FeedSidebar } from '@/features/feed/components/FeedSidebar';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export const metadata: Metadata = {
    title: 'Feed — Logia Caleuche 250',
};

export default async function FeedPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado ?? 1;
    const canEdit = session.user.categoryId <= 3;
    const canDelete = session.user.categoryId <= 2;

    const [posts, eventos, usersWithBirthday, categories] = await Promise.all([
        getFeedPosts(),
        getEventos(grado),
        prisma.user.findMany({
            where: { active: true, dateBirthday: { not: null } },
            select: { id: true, name: true, lastName: true, dateBirthday: true, image: true },
        }),
        getCategoryFeeds(),
    ]);

    // Calcular próximos cumpleaños en los siguientes 30 días
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const limitDate = new Date(startOfToday);
    limitDate.setDate(limitDate.getDate() + 30);

    const upcomingBirthdays = usersWithBirthday
        .map((u) => {
            const bday = u.dateBirthday as Date;
            const currentYear = today.getFullYear();
            let next = new Date(currentYear, bday.getMonth(), bday.getDate());
            if (next < startOfToday) {
                next = new Date(currentYear + 1, bday.getMonth(), bday.getDate());
            }
            const daysUntil = Math.round(
                (next.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
            );
            return { id: u.id, name: u.name, lastName: u.lastName, image: u.image, nextBirthday: next, daysUntil };
        })
        .filter((u) => u.nextBirthday >= startOfToday && u.nextBirthday <= limitDate)
        .sort((a, b) => a.daysUntil - b.daysUntil);

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-display text-cg-on-surface text-4xl font-bold tracking-tight">
                        Feed de Actividad
                    </h1>
                    <p className="text-cg-on-surface-variant mt-1 text-sm">
                        Últimas publicaciones y novedades de la logia.
                    </p>
                </div>

                <CreateFeedModal categories={categories} />
            </div>

            <div className="flex gap-8">
                {/* Left: Feed Timeline (65%) */}
                <div className="w-full xl:w-[65%]">
                    <FeedList
                        posts={posts}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        categories={categories}
                    />
                </div>

                {/* Right: Sidebar (35%) */}
                <div className="hidden xl:block xl:w-[35%]">
                    <FeedSidebar
                        posts={posts}
                        eventos={eventos}
                        upcomingBirthdays={upcomingBirthdays}
                        totalPosts={posts.length}
                    />
                </div>
            </div>
        </div>
    );
}

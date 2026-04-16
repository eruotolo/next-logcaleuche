import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { getEventos } from '@/features/eventos/actions';
import { getCategoryFeeds, getFeedPosts } from '@/features/feed/actions';
import { CreateFeedModal } from '@/features/feed/components/CreateFeedModal';
import { FeedList } from '@/features/feed/components/FeedList';
import { FeedSidebar } from '@/features/feed/components/FeedSidebar';
import { getUpcomingBirthdays } from '@/features/usuarios/actions';

import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Feed — Logia Caleuche 250',
};

export default async function FeedPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado ?? 1;
    const canEdit = session.user.categoryId <= 3;
    const canDelete = session.user.categoryId <= 2;

    const [posts, eventos, upcomingBirthdays, categories] = await Promise.all([
        getFeedPosts(),
        getEventos(grado),
        getUpcomingBirthdays(),
        getCategoryFeeds(),
    ]);

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

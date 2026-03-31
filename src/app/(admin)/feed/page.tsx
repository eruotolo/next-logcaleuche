import { redirect } from 'next/navigation';

import { getEventos } from '@/features/eventos/actions';
import { getCategoryFeeds, getFeedPosts } from '@/features/feed/actions';
import { CreateFeedModal } from '@/features/feed/components/CreateFeedModal';
import { FeedList } from '@/features/feed/components/FeedList';
import { FeedSidebar } from '@/features/feed/components/FeedSidebar';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export default async function FeedPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado ?? 1;
    const canEdit = session.user.categoryId <= 3;

    const [posts, eventos, usuarios, categories] = await Promise.all([
        getFeedPosts(),
        getEventos(grado),
        prisma.user.findMany({
            where: { active: true },
            select: {
                id: true,
                name: true,
                lastName: true,
                image: true,
                grado: { select: { nombre: true } },
            },
            orderBy: { name: 'asc' },
            take: 10,
        }),
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
                    <FeedList posts={posts} canEdit={canEdit} categories={categories} />
                </div>

                {/* Right: Sidebar (35%) */}
                <div className="hidden xl:block xl:w-[35%]">
                    <FeedSidebar usuarios={usuarios} eventos={eventos} totalPosts={posts.length} />
                </div>
            </div>
        </div>
    );
}

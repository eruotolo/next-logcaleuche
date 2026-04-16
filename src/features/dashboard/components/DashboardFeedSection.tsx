import Link from 'next/link';

import { Rss } from 'lucide-react';

import { FeedNewsList } from '@/shared/components/FeedNewsList';
import { GlassPanel } from '@/shared/components/ui/glass-panel';
import { prisma } from '@/shared/lib/db';

export async function DashboardFeedSection(): Promise<React.ReactNode> {
    const feedPosts = await prisma.feed.findMany({
        where: { active: 1 },
        include: {
            category: true,
            user: { select: { name: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
    });

    return (
        <GlassPanel className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                <div className="flex items-center gap-2">
                    <Rss className="text-cg-primary-tonal h-4 w-4" />
                    <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                        Feed de Noticias
                    </h2>
                </div>
            </div>
            <div className="flex-1 divide-y divide-[rgba(255,255,255,0.05)] px-6">
                <FeedNewsList posts={feedPosts} maxItems={5} titleMaxLength={80} />
            </div>
            <div className="px-6 pb-4">
                <Link
                    href="/feed"
                    className="border-cg-primary-tonal/30 text-cg-primary-tonal hover:bg-cg-primary-tonal/10 block w-full rounded-lg border py-2 text-center text-xs font-bold transition-colors"
                >
                    Ver todo
                </Link>
            </div>
        </GlassPanel>
    );
}

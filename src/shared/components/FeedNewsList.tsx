import Link from 'next/link';

import { formatDate, truncate } from '@/shared/lib/utils';

interface FeedPost {
    id: number;
    slug: string | null;
    titulo: string;
    createdAt: Date | string;
    user: { name: string | null; lastName: string | null } | null;
    category: { nombre: string } | null;
}

interface FeedNewsListProps {
    posts: FeedPost[];
    maxItems?: number;
    titleMaxLength?: number;
}

export function FeedNewsList({ posts, maxItems = 5, titleMaxLength = 60 }: FeedNewsListProps) {
    if (posts.length === 0) {
        return (
            <div className="text-cg-outline py-12 text-center text-sm italic">
                No hay publicaciones disponibles.
            </div>
        );
    }

    return (
        <>
            {posts.slice(0, maxItems).map((post) => (
                <div key={post.id} className="flex items-start gap-4 py-4">
                    <div className="bg-cg-surface-high text-cg-primary-tonal flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                        {post.user?.name?.[0] ?? 'U'}
                        {post.user?.lastName?.[0] ?? ''}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <Link href={`/feed/${post.slug ?? post.id}`}>
                                <span className="text-cg-on-surface hover:text-cg-primary-tonal text-sm font-semibold">
                                    {truncate(post.titulo, titleMaxLength)}
                                </span>
                            </Link>
                            <span className="text-cg-outline shrink-0 text-xs">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
                        <span className="text-cg-on-surface-variant mt-1 block text-sm">
                            {post.user?.name} {post.user?.lastName}
                        </span>
                        {post.category && (
                            <span className="bg-cg-surface-high text-cg-on-surface-variant mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium">
                                {post.category.nombre}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

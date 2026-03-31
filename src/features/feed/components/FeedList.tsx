'use client';

import { FeedCard } from './FeedCard';

interface FeedListProps {
    posts: any[];
    canEdit?: boolean;
    categories?: { id: number; nombre: string }[];
}

export function FeedList({ posts, canEdit = false, categories = [] }: FeedListProps) {
    if (posts.length === 0) {
        return (
            <div className="cg-empty-state py-20 text-center">
                <p className="text-cg-outline italic">No hay publicaciones en el feed todavía.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <FeedCard key={post.id} post={post} canEdit={canEdit} categories={categories} />
            ))}
        </div>
    );
}

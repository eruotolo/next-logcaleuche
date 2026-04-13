'use client';

import { useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { FeedCard } from './FeedCard';

const PAGE_SIZE = 4;

interface FeedListProps {
    posts: any[];
    canEdit?: boolean;
    canDelete?: boolean;
    categories?: { id: number; nombre: string }[];
}

export function FeedList({ posts, canEdit = false, canDelete = false, categories = [] }: FeedListProps) {
    const [page, setPage] = useState(0);

    if (posts.length === 0) {
        return (
            <div className="cg-empty-state py-20 text-center">
                <p className="text-cg-outline italic">No hay publicaciones en el feed todavía.</p>
            </div>
        );
    }

    const totalPages = Math.ceil(posts.length / PAGE_SIZE);
    const currentPage = Math.min(page, totalPages - 1);
    const pagePosts = posts.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    return (
        <div className="space-y-6">
            {pagePosts.map((post) => (
                <FeedCard
                    key={post.id}
                    post={post}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    categories={categories}
                />
            ))}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="text-cg-on-surface-variant hover:text-cg-primary-tonal flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-colors hover:bg-[rgba(158,167,255,0.1)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setPage(i)}
                            className={`h-8 w-8 rounded-lg border text-xs font-semibold transition-colors ${
                                currentPage === i
                                    ? 'border-cg-primary-tonal/40 bg-cg-primary-tonal/15 text-cg-primary-tonal'
                                    : 'text-cg-on-surface-variant hover:text-cg-primary-tonal border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(158,167,255,0.1)]'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="text-cg-on-surface-variant hover:text-cg-primary-tonal flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-colors hover:bg-[rgba(158,167,255,0.1)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

const FEED_KEYS = ['post-1', 'post-2', 'post-3', 'post-4', 'post-5'] as const;

export function FeedSkeleton() {
    return (
        <div className="flex flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                <div className="bg-cg-surface-high h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-cg-surface-high h-4 w-32 animate-pulse rounded" />
            </div>
            {/* 5 rows */}
            <div className="flex-1 divide-y divide-[rgba(255,255,255,0.05)] px-6">
                {FEED_KEYS.map((key) => (
                    <div key={key} className="flex items-start gap-4 py-4">
                        <div className="bg-cg-surface-high h-10 w-10 shrink-0 animate-pulse rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="bg-cg-surface-high h-4 w-3/4 animate-pulse rounded" />
                            <div className="bg-cg-surface-high h-3 w-1/2 animate-pulse rounded" />
                            <div className="bg-cg-surface-high h-3 w-1/4 animate-pulse rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Footer link */}
            <div className="px-6 pb-4">
                <div className="bg-cg-surface-high h-8 w-full animate-pulse rounded-lg" />
            </div>
        </div>
    );
}

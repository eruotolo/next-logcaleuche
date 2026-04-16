const EVENT_KEYS = ['ev-1', 'ev-2', 'ev-3', 'ev-4', 'ev-5'] as const;

export function EventsSkeleton() {
    return (
        <div className="flex flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                <div className="bg-cg-surface-high h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-cg-surface-high h-4 w-36 animate-pulse rounded" />
            </div>
            {/* 5 event cards */}
            <div className="flex-1 space-y-4 px-6 py-4">
                {EVENT_KEYS.map((key) => (
                    <div key={key} className="flex items-start gap-4">
                        {/* Date block */}
                        <div className="bg-cg-surface-high h-14 w-12 shrink-0 animate-pulse rounded-lg" />
                        {/* Info */}
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="bg-cg-surface-high h-4 w-4/5 animate-pulse rounded" />
                            <div className="bg-cg-surface-high h-3 w-2/3 animate-pulse rounded" />
                            <div className="bg-cg-surface-high h-3 w-1/3 animate-pulse rounded-full" />
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

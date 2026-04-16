const BIRTHDAY_KEYS = ['bd-1', 'bd-2', 'bd-3', 'bd-4', 'bd-5', 'bd-6'] as const;

export function BirthdaySkeleton() {
    return (
        <div className="flex flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                <div className="bg-cg-surface-high h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-cg-surface-high h-4 w-44 animate-pulse rounded" />
            </div>
            {/* 6 birthday rows */}
            <div className="flex-1 divide-y divide-[rgba(255,255,255,0.05)] px-6">
                {BIRTHDAY_KEYS.map((key) => (
                    <div key={key} className="flex items-center gap-4 py-3.5">
                        {/* Avatar */}
                        <div className="bg-cg-surface-high h-9 w-9 shrink-0 animate-pulse rounded-full" />
                        {/* Info */}
                        <div className="flex-1 space-y-1.5">
                            <div className="bg-cg-surface-high h-4 w-3/4 animate-pulse rounded" />
                            <div className="bg-cg-surface-high h-3 w-1/2 animate-pulse rounded" />
                        </div>
                        {/* Badge */}
                        <div className="bg-cg-surface-high h-5 w-12 animate-pulse rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

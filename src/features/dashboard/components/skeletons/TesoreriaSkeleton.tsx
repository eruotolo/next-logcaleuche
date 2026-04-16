const SKELETON_KEYS = ['ingresos', 'egresos', 'balance', 'hermanos'] as const;

export function TesoreriaSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {SKELETON_KEYS.map((key) => (
                <div
                    key={key}
                    className="flex flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[20px]"
                >
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="bg-cg-surface-high h-3 w-20 animate-pulse rounded" />
                            <div className="bg-cg-surface-high h-7 w-32 animate-pulse rounded" />
                        </div>
                        <div className="bg-cg-surface-high h-12 w-12 animate-pulse rounded-xl" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="bg-cg-surface-high h-4 w-16 animate-pulse rounded-full" />
                        <div className="bg-cg-surface-high h-3 w-24 animate-pulse rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

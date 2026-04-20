const ROWS = 7;

function SkeletonRow() {
    return (
        <div className="grid grid-cols-[1fr_80px_80px] items-center gap-2 px-1 py-4">
            <div className="space-y-1.5">
                <div className="h-3.5 w-40 animate-pulse rounded bg-white/[0.07]" />
                <div className="h-2.5 w-56 animate-pulse rounded bg-white/[0.04]" />
            </div>
            <div className="flex justify-center">
                <div className="h-5 w-9 animate-pulse rounded-full bg-white/[0.07]" />
            </div>
            <div className="flex justify-center">
                <div className="h-5 w-9 animate-pulse rounded-full bg-white/[0.07]" />
            </div>
        </div>
    );
}

export default function NotificacionesLoading() {
    return (
        <div className="mx-auto max-w-xl px-4 py-8">
            <div className="mb-8 space-y-2">
                <div className="h-2.5 w-12 animate-pulse rounded bg-white/[0.05]" />
                <div className="h-7 w-44 animate-pulse rounded bg-white/[0.08]" />
                <div className="h-3 w-72 animate-pulse rounded bg-white/[0.05]" />
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
                <div className="mb-4 space-y-1.5 border-b border-white/[0.06] pb-4">
                    <div className="h-3.5 w-52 animate-pulse rounded bg-white/[0.07]" />
                    <div className="h-2.5 w-36 animate-pulse rounded bg-white/[0.04]" />
                </div>

                {/* Cabecera columnas */}
                <div className="mb-2 grid grid-cols-[1fr_80px_80px] items-center px-1 pb-3">
                    <div className="h-6 w-16 animate-pulse rounded-lg bg-white/[0.06]" />
                    <div className="flex justify-center">
                        <div className="h-3 w-12 animate-pulse rounded bg-white/[0.05]" />
                    </div>
                    <div className="flex justify-center">
                        <div className="h-3 w-10 animate-pulse rounded bg-white/[0.05]" />
                    </div>
                </div>

                <div className="divide-y divide-white/[0.05]">
                    {Array.from({ length: ROWS }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no meaningful key
                        <SkeletonRow key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

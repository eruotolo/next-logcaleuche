export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-[rgba(255,255,255,0.06)]" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {['a', 'b', 'c', 'd'].map((id) => (
                    <div
                        key={id}
                        className="h-32 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]"
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="h-64 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]" />
                <div className="h-64 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]" />
            </div>
        </div>
    );
}

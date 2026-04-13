interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
    return (
        <div
            className={`rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] ${className}`}
        >
            {children}
        </div>
    );
}

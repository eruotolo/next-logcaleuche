'use client';

import { Tooltip, TooltipProvider } from '@/shared/components/ui/tooltip';

interface CandidatesSubtitleProps {
    candidates: { name: string | null; lastName: string | null }[];
    subtitleColor: string;
}

export function CandidatesSubtitle({ candidates, subtitleColor }: CandidatesSubtitleProps) {
    const label = `${candidates.length} candidato${candidates.length !== 1 ? 's' : ''} a aumento`;

    const tooltipContent = (
        <div className="space-y-0.5">
            {candidates.map((c) => (
                <div key={`${c.name}-${c.lastName}`}>
                    {[c.name, c.lastName].filter(Boolean).join(' ')}
                </div>
            ))}
        </div>
    );

    return (
        <TooltipProvider>
            <Tooltip content={tooltipContent} side="bottom">
                <p
                    className={`mt-3 cursor-default text-[10px] underline decoration-dotted underline-offset-2 ${subtitleColor}`}
                >
                    {label}
                </p>
            </Tooltip>
        </TooltipProvider>
    );
}

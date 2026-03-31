'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/shared/lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({
    children,
    content,
    side = 'top',
    delayDuration = 200,
}: {
    children: React.ReactNode;
    content: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    delayDuration?: number;
}) {
    return (
        <TooltipPrimitive.Root delayDuration={delayDuration}>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    side={side}
                    sideOffset={6}
                    className={cn(
                        'z-[200] rounded-lg px-3 py-1.5 text-xs font-medium',
                        'text-cg-on-surface bg-[rgba(23,24,42,0.95)] backdrop-blur-xl',
                        'border border-white/[0.08]',
                        'shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)]',
                        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    )}
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-[rgba(23,24,42,0.95)]" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}

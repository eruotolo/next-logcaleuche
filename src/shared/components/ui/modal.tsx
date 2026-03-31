'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
} as const;

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    size?: keyof typeof sizeClasses;
    children: React.ReactNode;
}

export function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px]" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <DialogPrimitive.Content
                        aria-describedby={undefined}
                        className={cn(
                            'glass-frosted text-cg-on-surface w-full rounded-2xl shadow-[var(--shadow-card)]',
                            'data-[state=closed]:animate-dialogOut data-[state=open]:animate-dialogIn',
                            'focus:outline-none',
                            sizeClasses[size],
                        )}
                        style={{ background: 'var(--color-cg-surface-high)' }}
                    >
                        <div className="flex items-center justify-between border-b border-[rgba(70,70,88,0.35)] px-6 py-4">
                            <DialogPrimitive.Title className="text-headline-sm">
                                {title}
                            </DialogPrimitive.Title>
                            <DialogPrimitive.Close
                                className="text-cg-on-surface-variant inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                                aria-label="Cerrar"
                            >
                                <X className="h-5 w-5" />
                            </DialogPrimitive.Close>
                        </div>

                        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-4">
                            {children}
                        </div>
                    </DialogPrimitive.Content>
                </div>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

'use client';

import { useCallback } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';

import { Button } from './button';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning';
    onConfirm: () => void | Promise<void>;
    isPending?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger',
    onConfirm,
    isPending = false,
}: ConfirmDialogProps) {
    const handleConfirm = useCallback(async () => {
        await onConfirm();
        onOpenChange(false);
    }, [onConfirm, onOpenChange]);

    const iconColor = variant === 'danger' ? 'text-red-400' : 'text-amber-400';
    const confirmClass =
        variant === 'danger'
            ? 'bg-red-600/80 hover:bg-red-600 text-white'
            : 'bg-amber-600/80 hover:bg-amber-600 text-white';

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[0.08] bg-[rgba(18,19,36,0.97)] p-6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl focus:outline-none"
                    role="alertdialog"
                    aria-modal="true"
                >
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.06)] ${iconColor}`}
                        >
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <Dialog.Title className="text-base font-semibold text-[#e7e6fc]">
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="mt-1 text-sm text-[#747487]">
                                {description}
                            </Dialog.Description>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            {cancelLabel}
                        </Button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isPending}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${confirmClass}`}
                        >
                            {isPending ? 'Procesando...' : confirmLabel}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

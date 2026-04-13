'use client';

import { useEffect } from 'react';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <h2 className="font-display text-cg-on-surface text-xl font-bold">
                Algo salió mal
            </h2>
            <p className="text-cg-on-surface-variant text-sm">
                {error.message || 'Ocurrió un error inesperado.'}
            </p>
            <button
                type="button"
                onClick={reset}
                className="border-cg-primary-tonal/30 text-cg-primary-tonal hover:bg-cg-primary-tonal/10 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
                Reintentar
            </button>
        </div>
    );
}

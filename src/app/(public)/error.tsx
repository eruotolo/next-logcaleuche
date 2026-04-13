'use client';

import { useEffect } from 'react';

export default function PublicError({
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold text-white">Algo salió mal</h2>
            <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
                Reintentar
            </button>
        </div>
    );
}

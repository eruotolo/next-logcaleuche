'use client';

import type { AutosaveStatus } from '@/shared/hooks/useAutosave';

interface AutosaveIndicatorProps {
    status: AutosaveStatus;
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps): React.JSX.Element | null {
    if (status === 'idle') return null;

    if (status === 'saving') {
        return (
            <span className="text-cg-outline text-xs transition-opacity duration-200">
                Guardando borrador...
            </span>
        );
    }

    // status === 'saved'
    return (
        <span className="text-xs text-green-400 transition-opacity duration-200">
            Borrador guardado
        </span>
    );
}

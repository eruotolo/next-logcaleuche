'use client';

import { CreateEventoModal } from './CreateEventoModal';
import { DownloadTemplateButton } from './DownloadTemplateButton';
import { ImportEventosButton } from './ImportEventosButton';

interface EventosAdminToolbarProps {
    grados: { id: number; nombre: string }[];
}

export function EventosAdminToolbar({ grados }: EventosAdminToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <CreateEventoModal grados={grados} />
            <ImportEventosButton />
            <DownloadTemplateButton />
        </div>
    );
}

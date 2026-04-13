import type { Metadata } from 'next';

import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export const metadata: Metadata = {
    title: 'Trazados Maestro — Logia Caleuche 250',
};

export default function MaestroTrazadosPage() {
    return (
        <DocGradoPage
            tipo="trazado"
            gradoMin={3}
            redirectTo="/maestro/trazados"
            titulo="Trazados — Maestro"
            subtitulo="Trazados masónicos del tercer grado."
        />
    );
}

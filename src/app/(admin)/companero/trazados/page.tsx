import { Suspense } from 'react';

import type { Metadata } from 'next';

import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export const metadata: Metadata = {
    title: 'Trazados Compañero — Logia Caleuche 250',
};

export default function CompaneroTrazadosPage() {
    return (
        <Suspense>
            <DocGradoPage
                tipo="trazado"
                gradoMin={2}
                redirectTo="/companero/trazados"
                titulo="Trazados — Compañero"
                subtitulo="Trazados masónicos del segundo grado."
            />
        </Suspense>
    );
}

import type { Metadata } from 'next';

import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export const metadata: Metadata = {
    title: 'Trazados Aprendiz — Logia Caleuche 250',
};

export default function AprendizTrazadosPage() {
    return (
        <DocGradoPage
            tipo="trazado"
            gradoMin={1}
            redirectTo="/aprendiz/trazados"
            titulo="Trazados — Aprendiz"
            subtitulo="Trazados masónicos del primer grado."
        />
    );
}

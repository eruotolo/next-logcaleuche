import type { Metadata } from 'next';

import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export const metadata: Metadata = {
    title: 'Biblioteca Compañero — Logia Caleuche 250',
};

export default function CompaneroBibliotecaPage() {
    return (
        <DocGradoPage
            tipo="biblioteca"
            gradoMin={2}
            redirectTo="/companero/biblioteca"
            titulo="Biblioteca — Compañero"
            subtitulo="Libros y material del segundo grado."
        />
    );
}

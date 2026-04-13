import type { Metadata } from 'next';

import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export const metadata: Metadata = {
    title: 'Biblioteca Maestro — Logia Caleuche 250',
};

export default function MaestroBibliotecaPage() {
    return (
        <DocGradoPage
            tipo="biblioteca"
            gradoMin={3}
            redirectTo="/maestro/biblioteca"
            titulo="Biblioteca — Maestro"
            subtitulo="Libros y material del tercer grado."
        />
    );
}

import type { Metadata } from 'next';

import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export const metadata: Metadata = {
    title: 'Biblioteca Aprendiz — Logia Caleuche 250',
};

export default function AprendizBibliotecaPage() {
    return (
        <DocGradoPage
            tipo="biblioteca"
            gradoMin={1}
            redirectTo="/aprendiz/biblioteca"
            titulo="Biblioteca — Aprendiz"
            subtitulo="Libros y material de lectura del primer grado."
        />
    );
}

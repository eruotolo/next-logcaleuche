import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

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

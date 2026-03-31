import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

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

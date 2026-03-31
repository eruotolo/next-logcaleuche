import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

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

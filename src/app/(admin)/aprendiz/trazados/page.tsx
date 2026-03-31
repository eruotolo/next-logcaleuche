import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

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

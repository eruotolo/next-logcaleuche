import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

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

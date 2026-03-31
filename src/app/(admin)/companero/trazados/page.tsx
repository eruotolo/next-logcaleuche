import { DocGradoPage } from '@/features/documentos/components/DocGradoPage';

export default function CompaneroTrazadosPage() {
    return (
        <DocGradoPage
            tipo="trazado"
            gradoMin={2}
            redirectTo="/companero/trazados"
            titulo="Trazados — Compañero"
            subtitulo="Trazados masónicos del segundo grado."
        />
    );
}

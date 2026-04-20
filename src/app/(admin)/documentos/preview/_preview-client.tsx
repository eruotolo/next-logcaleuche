'use client';

import { useRouter } from 'next/navigation';

import { DocumentoPreviewModal } from '@/features/documentos/components/DocumentoPreviewModal';

interface Props {
    fileName: string;
    nombre: string | null;
}

export function PreviewClient({ fileName, nombre }: Props) {
    const router = useRouter();
    return (
        <DocumentoPreviewModal
            doc={{ nombre, fileName }}
            onClose={() => router.back()}
        />
    );
}

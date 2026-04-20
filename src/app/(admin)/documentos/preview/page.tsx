'use client';

import { Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { DocumentoPreviewModal } from '@/features/documentos/components/DocumentoPreviewModal';

function PreviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileName = searchParams.get('fileName');
    const nombre = searchParams.get('nombre');

    if (!fileName) {
        router.replace('/documentos');
        return null;
    }

    return (
        <DocumentoPreviewModal
            doc={{ nombre, fileName }}
            onClose={() => router.back()}
        />
    );
}

export default function DocumentoPreviewPage() {
    return (
        <Suspense>
            <PreviewContent />
        </Suspense>
    );
}

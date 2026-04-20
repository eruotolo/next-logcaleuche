import { Suspense } from 'react';

import { redirect } from 'next/navigation';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';
import { canUserAccessGrado } from '@/shared/lib/grado';

import { PreviewClient } from './_preview-client';

interface PageProps {
    searchParams: Promise<{
        fileName?: string;
        nombre?: string;
        documentType?: string;
        documentId?: string;
    }>;
}

export default async function DocumentoPreviewPage({ searchParams }: PageProps) {
    const { fileName, nombre, documentType, documentId } = await searchParams;

    if (!fileName) redirect('/documentos');

    if (documentType && documentId) {
        const session = await auth();
        if (!session) redirect('/login');
        const userGrado = session.user.grado ?? 1;
        const id = Number(documentId);

        let contentGrado: number | null = null;
        if (documentType === 'biblioteca') {
            const doc = await prisma.biblioteca.findUnique({ where: { id }, select: { gradoId: true } });
            contentGrado = doc?.gradoId ?? null;
        } else if (documentType === 'trazado') {
            const doc = await prisma.trazado.findUnique({ where: { id }, select: { gradoId: true } });
            contentGrado = doc?.gradoId ?? null;
        }

        if (!canUserAccessGrado(userGrado, contentGrado)) redirect('/documentos');
    }

    return (
        <Suspense>
            <PreviewClient fileName={fileName} nombre={nombre ?? null} />
        </Suspense>
    );
}

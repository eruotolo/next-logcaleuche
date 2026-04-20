import { redirect } from 'next/navigation';

import type { Metadata } from 'next';
import Link from 'next/link';

import { Star } from 'lucide-react';

import { getDocumentos, getUserDocumentFavorites } from '@/features/documentos/actions';
import { DocumentoList } from '@/features/documentos/components/DocumentoList';
import { UploadDocumentoModal } from '@/features/documentos/components/UploadDocumentoModal';
import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Documentos — Logia Caleuche 250',
};

export default async function DocumentosPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const isAdmin = session.user.categoryId <= 2;
    const canEdit = session.user.categoryId <= 3;
    const [documentos, allFavs] = await Promise.all([getDocumentos(), getUserDocumentFavorites()]);
    const favoritedIds = allFavs
        .filter((f) => f.documentType === 'documento')
        .map((f) => f.documentId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-display text-cg-on-surface text-4xl font-extrabold tracking-tight">
                        Biblioteca Institucional
                    </h1>
                    <p className="text-cg-on-surface-variant mt-2 text-sm">
                        Documentos disponibles para todos los miembros.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/documentos/favoritos"
                        className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-[rgba(70,70,88,0.35)] bg-transparent px-3 text-xs font-medium text-cg-on-surface transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                    >
                        <Star className="mr-1.5 h-4 w-4" />
                        Favoritos
                    </Link>
                    {isAdmin && <UploadDocumentoModal />}
                </div>
            </div>

            <DocumentoList documentos={documentos} isAdmin={isAdmin} canEdit={canEdit} favoritedIds={favoritedIds} />
        </div>
    );
}

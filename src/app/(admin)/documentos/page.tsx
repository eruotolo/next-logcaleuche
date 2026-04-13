import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { getDocumentos } from '@/features/documentos/actions';
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
    const documentos = await getDocumentos();

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
                {isAdmin && <UploadDocumentoModal />}
            </div>

            <DocumentoList documentos={documentos} isAdmin={isAdmin} canEdit={canEdit} />
        </div>
    );
}

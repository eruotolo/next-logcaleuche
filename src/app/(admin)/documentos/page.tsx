import { redirect } from 'next/navigation';

import type { Metadata } from 'next';
import Link from 'next/link';

import { Search, Star } from 'lucide-react';

import { getDocumentos } from '@/features/documentos/actions';
import { DocumentoList } from '@/features/documentos/components/DocumentoList';
import { UploadDocumentoModal } from '@/features/documentos/components/UploadDocumentoModal';
import { Button } from '@/shared/components/ui/button';
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
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/documentos/buscar">
                            <Search className="mr-1.5 h-4 w-4" />
                            Buscar
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/documentos/favoritos">
                            <Star className="mr-1.5 h-4 w-4" />
                            Favoritos
                        </Link>
                    </Button>
                    {isAdmin && <UploadDocumentoModal />}
                </div>
            </div>

            <DocumentoList documentos={documentos} isAdmin={isAdmin} canEdit={canEdit} />
        </div>
    );
}

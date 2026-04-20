import { redirect } from 'next/navigation';

import type { Metadata } from 'next';
import Link from 'next/link';

import { ArrowLeft, BookOpen, FileText, Star } from 'lucide-react';

import { getFavoritesWithDetails } from '@/features/documentos/actions';
import { DocGradoList } from '@/features/documentos/components/DocGradoList';
import { DocumentoList } from '@/features/documentos/components/DocumentoList';
import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Documentos Favoritos — Logia Caleuche 250',
};

export default async function FavoritosPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const { biblioteca, trazados, documentos } = await getFavoritesWithDetails();
    const total = biblioteca.length + trazados.length + documentos.length;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/documentos"
                    className="text-cg-on-surface-variant hover:text-cg-on-surface flex items-center gap-1.5 text-sm transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Documentos
                </Link>
            </div>

            <div>
                <h1 className="text-cg-on-surface flex items-center gap-2 text-2xl font-bold">
                    <Star className="h-6 w-6 text-yellow-400" fill="currentColor" />
                    Mis Favoritos
                </h1>
                <p className="text-cg-on-surface-variant mt-1 text-sm">
                    {total === 0
                        ? 'No tienes documentos favoritos todavía.'
                        : `${total} documento${total !== 1 ? 's' : ''} guardado${total !== 1 ? 's' : ''}.`}
                </p>
            </div>

            {total === 0 && (
                <div className="cg-empty-state py-16 text-center">
                    <Star className="text-cg-outline mx-auto mb-3 h-12 w-12" />
                    <p className="text-cg-on-surface-variant italic">
                        Marca documentos con ★ para encontrarlos rápidamente aquí.
                    </p>
                </div>
            )}

            {biblioteca.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-cg-on-surface flex items-center gap-2 text-lg font-bold">
                        <BookOpen className="text-cg-primary-tonal h-5 w-5" />
                        Biblioteca
                    </h2>
                    <DocGradoList
                        tipo="biblioteca"
                        items={biblioteca.map((b) => ({
                            id: b.id,
                            nombre: b.nombre,
                            fileName: b.fileName,
                            gradoId: b.gradoId ?? undefined,
                            grado: b.grado,
                            autor_Libro: b.autor,
                        }))}
                        isAdmin={false}
                        canEdit={false}
                        favoritedIds={biblioteca.map((b) => b.id)}
                    />
                </section>
            )}

            {trazados.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-cg-on-surface flex items-center gap-2 text-lg font-bold">
                        <FileText className="text-cg-tertiary-tonal h-5 w-5" />
                        Trazados
                    </h2>
                    <DocGradoList
                        tipo="trazado"
                        items={trazados.map((t) => ({
                            id: t.id,
                            nombre: t.nombre,
                            fileName: t.fileName,
                            fecha: t.fecha,
                            gradoId: t.gradoId ?? undefined,
                            grado: t.grado,
                            autor: t.autor,
                            autorId: t.autorId ?? undefined,
                            tipoActividadId: t.tipoActividadId,
                        }))}
                        isAdmin={false}
                        canEdit={false}
                        favoritedIds={trazados.map((t) => t.id)}
                    />
                </section>
            )}

            {documentos.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-cg-on-surface flex items-center gap-2 text-lg font-bold">
                        <FileText className="text-cg-on-surface-variant h-5 w-5" />
                        Documentos Generales
                    </h2>
                    <DocumentoList
                        documentos={documentos}
                        isAdmin={false}
                        canEdit={false}
                    />
                </section>
            )}
        </div>
    );
}

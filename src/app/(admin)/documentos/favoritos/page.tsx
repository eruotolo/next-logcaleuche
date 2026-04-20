import { redirect } from 'next/navigation';

import type { Metadata } from 'next';
import Link from 'next/link';

import { ArrowLeft, BookOpen, FileText, Star } from 'lucide-react';

import { getFavoritesWithDetails } from '@/features/documentos/actions';
import { auth } from '@/shared/lib/auth';
import { getCloudinaryPdfUrl } from '@/shared/lib/cloudinary';

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
                    {total === 0 ? 'No tienes documentos favoritos todavía.' : `${total} documento${total !== 1 ? 's' : ''} guardado${total !== 1 ? 's' : ''}.`}
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
                    <FavList items={biblioteca.map((b) => ({ id: b.id, nombre: b.nombre, fileName: b.fileName, extra: b.autor ?? '', href: getGradoPath(b.gradoId, 'biblioteca') }))} />
                </section>
            )}

            {trazados.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-cg-on-surface flex items-center gap-2 text-lg font-bold">
                        <FileText className="text-cg-tertiary-tonal h-5 w-5" />
                        Trazados
                    </h2>
                    <FavList items={trazados.map((t) => ({ id: t.id, nombre: t.nombre, fileName: t.fileName, extra: t.autor ? `${t.autor.name ?? ''} ${t.autor.lastName ?? ''}`.trim() : '', href: getGradoPath(t.gradoId, 'trazados') }))} />
                </section>
            )}

            {documentos.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-cg-on-surface flex items-center gap-2 text-lg font-bold">
                        <FileText className="text-cg-on-surface-variant h-5 w-5" />
                        Documentos Generales
                    </h2>
                    <FavList items={documentos.map((d) => ({ id: d.id, nombre: d.nombre, fileName: d.fileName, extra: '', href: '/documentos' }))} />
                </section>
            )}
        </div>
    );
}

function getGradoPath(gradoId: number | null | undefined, seccion: string): string {
    const prefix = gradoId === 1 ? 'aprendiz' : gradoId === 2 ? 'companero' : 'maestro';
    return `/${prefix}/${seccion}`;
}

interface FavItem {
    id: number;
    nombre: string | null;
    fileName: string | null;
    extra: string;
    href: string;
}

function FavList({ items }: { items: FavItem[] }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-[rgba(158,167,255,0.15)] bg-[rgba(255,255,255,0.04)] p-3"
                >
                    <FileText className="text-cg-outline h-8 w-8 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-cg-on-surface truncate text-sm font-semibold">
                            {item.nombre ?? 'Sin título'}
                        </p>
                        {item.extra && (
                            <p className="text-cg-on-surface-variant truncate text-[10px]">{item.extra}</p>
                        )}
                    </div>
                    {item.fileName && (
                        <a
                            href={getCloudinaryPdfUrl(item.fileName)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cg-primary-tonal text-[10px] font-semibold underline"
                        >
                            Ver
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}

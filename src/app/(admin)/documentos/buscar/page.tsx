import { redirect } from 'next/navigation';

import type { Metadata } from 'next';
import Link from 'next/link';

import { ArrowLeft, BookOpen, FileText } from 'lucide-react';

import { searchDocumentos } from '@/features/documentos/actions';
import { SearchDocumentosForm } from '@/features/documentos/components/SearchDocumentosForm';
import { auth } from '@/shared/lib/auth';
import { getCloudinaryPdfUrl } from '@/shared/lib/cloudinary';

export const metadata: Metadata = {
    title: 'Buscar Documentos — Logia Caleuche 250',
};

const tipoIcons = {
    biblioteca: { icon: BookOpen, label: 'Biblioteca', color: 'text-cg-primary-tonal' },
    trazado: { icon: FileText, label: 'Trazado', color: 'text-cg-tertiary-tonal' },
    documento: { icon: FileText, label: 'Documento', color: 'text-cg-on-surface-variant' },
} as const;

export default async function BuscarPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const session = await auth();
    if (!session) redirect('/login');

    const { q } = await searchParams;
    const query = q?.trim() ?? '';
    const results = query ? await searchDocumentos(query) : [];

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
                <h1 className="text-cg-on-surface text-2xl font-bold">Búsqueda de Documentos</h1>
                <p className="text-cg-on-surface-variant mt-1 text-sm">
                    Busca en biblioteca, trazados y documentos generales.
                </p>
            </div>

            <SearchDocumentosForm initialQuery={query} />

            {query && (
                <div className="space-y-4">
                    <p className="text-cg-on-surface-variant text-sm">
                        {results.length === 0
                            ? `Sin resultados para "${query}".`
                            : `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`}
                    </p>

                    {results.length > 0 && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {results.map((item) => {
                                const { icon: Icon, label, color } = tipoIcons[item.tipo];
                                return (
                                    <div
                                        key={`${item.tipo}-${item.id}`}
                                        className="flex items-center gap-3 rounded-xl border border-[rgba(158,167,255,0.15)] bg-[rgba(255,255,255,0.04)] p-3"
                                    >
                                        <Icon className={`h-8 w-8 shrink-0 ${color}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-cg-on-surface truncate text-sm font-semibold">
                                                {item.nombre ?? 'Sin título'}
                                            </p>
                                            <span className="text-cg-outline text-[10px]">{label}</span>
                                        </div>
                                        {item.fileName && (
                                            <a
                                                href={getCloudinaryPdfUrl(item.fileName)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cg-primary-tonal shrink-0 text-[10px] font-semibold underline"
                                            >
                                                Ver
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

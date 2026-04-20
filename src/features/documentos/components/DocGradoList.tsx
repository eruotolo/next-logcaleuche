'use client';

import { useState } from 'react';

import { BookOpen, Download, Eye, FileText, Star, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { getCloudinaryPdfUrl } from '@/shared/lib/cloudinary';
import { formatDate } from '@/shared/lib/utils';

import { deleteLibro, deleteTrazado, toggleDocumentFavorite } from '../actions';
import { DocumentoPreviewModal, type PreviewDoc } from './DocumentoPreviewModal';
import { EditDocGradoModal } from './EditDocGradoModal';

export type DocTipo = 'biblioteca' | 'trazado';

interface DocItem {
    id: number;
    nombre?: string | null;
    titulo?: string | null;
    fileName: string | null;
    fecha?: Date | null;
    createdAt?: Date;
    gradoId?: number;
    grado?: { nombre: string } | null;
    autor?: { name: string | null; lastName: string | null } | null;
    autorId?: number;
    autor_Libro?: string | null;
    tipoActividadId?: number | null;
    tipoActividad?: { id: number; nombre: string } | null;
}

interface DocGradoListProps {
    tipo: DocTipo;
    items: DocItem[];
    isAdmin: boolean;
    canEdit?: boolean;
    favoritedIds?: number[];
    grados?: { id: number; nombre: string }[];
    usuarios?: { id: number; name: string | null; lastName: string | null }[];
    tiposActividad?: { id: number; nombre: string }[];
}

const deleteActions: Record<
    DocTipo,
    (id: number) => Promise<{ success: boolean; error?: string; data?: null }>
> = {
    biblioteca: deleteLibro,
    trazado: deleteTrazado,
};

const tipoIcons: Record<DocTipo, { icon: typeof FileText; color: string; bg: string }> = {
    biblioteca: { icon: BookOpen, color: 'text-cg-primary-tonal', bg: 'bg-[rgba(90,103,216,0.1)]' },
    trazado: { icon: FileText, color: 'text-cg-tertiary-tonal', bg: 'bg-[rgba(155,255,206,0.1)]' },
};

function getFileExt(fileName: string | null) {
    if (!fileName) return 'DOC';
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) return 'DRIVE';
    return (fileName.split('.').pop() ?? 'DOC').toUpperCase();
}

export function DocGradoList({
    tipo,
    items,
    isAdmin,
    canEdit = false,
    favoritedIds = [],
    grados = [],
    usuarios = [],
    tiposActividad = [],
}: DocGradoListProps) {
    const [preview, setPreview] = useState<PreviewDoc | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; label: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [favs, setFavs] = useState<Set<number>>(new Set(favoritedIds));

    function handleDelete(id: number, label: string | null) {
        setConfirmDelete({ id, label: label ?? 'este elemento' });
    }

    async function handleDeleteConfirm() {
        if (!confirmDelete) return;
        setIsDeleting(true);
        const res = await deleteActions[tipo](confirmDelete.id);
        setIsDeleting(false);
        if (res.success) toast.success('Eliminado correctamente');
        else toast.error(res.error);
    }

    async function handleToggleFav(id: number) {
        setFavs((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        await toggleDocumentFavorite(tipo, id);
    }

    const getLabel = (item: DocItem) => item.nombre ?? item.titulo ?? 'Sin título';
    const getDate = (item: DocItem) => {
        const d = item.fecha ?? item.createdAt;
        return d ? formatDate(d) : '—';
    };
    const getAuthor = (item: DocItem) => {
        if (tipo === 'biblioteca') return item.autor_Libro ?? item.autor?.name ?? '';
        if (tipo === 'trazado' && item.autor)
            return `${item.autor.name ?? ''} ${item.autor.lastName ?? ''}`.trim();
        return '';
    };

    const { icon: TipoIcon, color } = tipoIcons[tipo];

    if (items.length === 0) {
        return (
            <div className="cg-empty-state">
                <TipoIcon className="text-cg-outline mx-auto mb-3 h-10 w-10" />
                <p className="text-cg-on-surface-variant italic">No hay registros disponibles.</p>
            </div>
        );
    }

    return (
        <>
            {preview && <DocumentoPreviewModal doc={preview} onClose={() => setPreview(null)} />}

            <ConfirmDialog
                open={confirmDelete !== null}
                onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}
                title="Eliminar documento"
                description={`¿Eliminar "${confirmDelete?.label}"?`}
                confirmLabel="Eliminar"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                isPending={isDeleting}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => {
                    const ext = getFileExt(item.fileName);
                    const author = getAuthor(item);

                    return (
                        <div
                            key={item.id}
                            className="group rounded-2xl border border-[rgba(158,167,255,0.15)] bg-[rgba(255,255,255,0.05)] p-4 backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(158,167,255,0.4)]"
                        >
                            {/* File icon area */}
                            <div className="relative mb-4 flex h-32 items-center justify-center rounded-xl bg-[rgba(17,18,35,0.8)]">
                                <TipoIcon className={`h-12 w-12 ${color}`} />
                                <span className="text-cg-outline absolute top-2 right-2 rounded bg-[rgba(35,36,58,0.9)] px-1.5 py-0.5 font-mono text-[8px] font-black tracking-widest uppercase">
                                    {ext}
                                </span>
                            </div>

                            {/* Title */}
                            <h4 className="font-display text-cg-on-surface group-hover:text-cg-primary-tonal mb-1 truncate text-sm font-bold transition-colors">
                                {getLabel(item)}
                            </h4>

                            {/* Meta */}
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-cg-outline font-mono text-[9px]">
                                    {getDate(item)}
                                </span>
                                {item.grado && (
                                    <span className="text-cg-primary-tonal rounded-full border border-[rgba(158,167,255,0.2)] bg-[rgba(158,167,255,0.08)] px-2 py-0.5 text-[9px] font-bold">
                                        {item.grado.nombre}
                                    </span>
                                )}
                            </div>

                            {/* Tipo de actividad (solo trazado) */}
                            {tipo === 'trazado' && item.tipoActividad && (
                                <span className="mb-2 inline-block rounded-full border border-[rgba(155,255,206,0.2)] bg-[rgba(155,255,206,0.08)] px-2 py-0.5 text-[9px] font-semibold text-cg-tertiary-tonal">
                                    {item.tipoActividad.nombre}
                                </span>
                            )}

                            {/* Author if applicable */}
                            {author && (
                                <p className="text-cg-on-surface-variant mb-3 truncate text-[10px]">
                                    por {author}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-3">
                                <Tooltip content={favs.has(item.id) ? 'Quitar favorito' : 'Agregar a favoritos'}>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFav(item.id)}
                                        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${favs.has(item.id) ? 'text-yellow-400' : 'text-cg-outline hover:text-yellow-400'}`}
                                    >
                                        <Star className="h-3.5 w-3.5" fill={favs.has(item.id) ? 'currentColor' : 'none'} />
                                    </button>
                                </Tooltip>
                                <div className="flex items-center gap-1">
                                    {item.fileName && (
                                        <Tooltip content="Vista previa">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    item.fileName &&
                                                    setPreview({
                                                        nombre: getLabel(item),
                                                        fileName: item.fileName,
                                                    })
                                                }
                                                className="text-cg-outline hover:text-cg-primary-tonal flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(158,167,255,0.15)]"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </Tooltip>
                                    )}
                                    {item.fileName && (
                                        <Tooltip content="Descargar">
                                            <a
                                                href={getCloudinaryPdfUrl(item.fileName ?? '')}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cg-outline hover:text-cg-on-surface flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Tooltip>
                                    )}
                                    {canEdit &&
                                        (tipo === 'biblioteca' ? (
                                            <EditDocGradoModal
                                                tipo="biblioteca"
                                                item={{
                                                    id: item.id,
                                                    nombre: item.nombre,
                                                    autor:
                                                        item.autor_Libro ??
                                                        (item.autor as unknown as string) ??
                                                        '',
                                                    gradoId: item.gradoId,
                                                    fileName: item.fileName,
                                                }}
                                                grados={grados}
                                            />
                                        ) : (
                                            <EditDocGradoModal
                                                tipo="trazado"
                                                item={{
                                                    id: item.id,
                                                    nombre: item.nombre,
                                                    autorId: item.autorId,
                                                    gradoId: item.gradoId,
                                                    fecha: item.fecha,
                                                    tipoActividadId: item.tipoActividadId,
                                                }}
                                                grados={grados}
                                                usuarios={usuarios}
                                                tiposActividad={tiposActividad}
                                            />
                                        ))}
                                    {isAdmin && (
                                        <Tooltip content="Eliminar">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(item.id, getLabel(item))
                                                }
                                                className="text-cg-outline hover:text-cg-error flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,100,132,0.1)]"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

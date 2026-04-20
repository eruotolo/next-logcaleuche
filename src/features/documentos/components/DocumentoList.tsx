'use client';

import { useState } from 'react';

import { Download, Eye, FileText, Image, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Tooltip } from '@/shared/components/ui/tooltip';
import { getCloudinaryPdfUrl } from '@/shared/lib/cloudinary';
import { formatDate } from '@/shared/lib/utils';

import { deleteDocumento } from '../actions';
import { DocumentoPreviewModal, type PreviewDoc } from './DocumentoPreviewModal';
import { EditDocumentoModal } from './EditDocumentoModal';

interface DocumentoListProps {
    documentos: {
        id: number;
        nombre: string | null;
        fileName: string | null;
        fechaDoc: Date | null;
    }[];
    isAdmin: boolean;
    canEdit?: boolean;
}

function getExt(fileName: string | null): string {
    if (!fileName) return '';
    const raw = fileName.split('.').pop()?.toLowerCase() ?? '';
    // Si tiene más de 5 chars no es una extensión real (es parte del path sin extensión)
    return raw.length <= 5 ? raw : '';
}

function getFileIcon(fileName: string | null) {
    const ext = getExt(fileName);
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext))
        return { icon: Image, color: 'text-amber-400', bg: 'bg-[rgba(251,191,36,0.1)]' };
    if (['doc', 'docx'].includes(ext))
        return { icon: FileText, color: 'text-blue-400', bg: 'bg-[rgba(96,165,250,0.1)]' };
    if (['xls', 'xlsx'].includes(ext))
        return { icon: FileText, color: 'text-green-400', bg: 'bg-[rgba(74,222,128,0.1)]' };
    // PDF explícito o sin extensión (raw uploads sin extensión son PDFs)
    return { icon: FileText, color: 'text-[#d73357]', bg: 'bg-[rgba(215,51,87,0.1)]' };
}

function getFileExt(fileName: string | null) {
    const ext = getExt(fileName);
    return ext ? ext.toUpperCase() : 'PDF';
}

export function DocumentoList({ documentos, isAdmin, canEdit = false }: DocumentoListProps) {
    const [preview, setPreview] = useState<PreviewDoc | null>(null);

    async function handleDelete(id: number, nombre: string | null) {
        if (!confirm(`¿Eliminar el documento "${nombre}"?`)) return;
        const res = await deleteDocumento(id);
        if (res.success) toast.success('Documento eliminado');
        else toast.error(res.error);
    }

    if (documentos.length === 0) {
        return (
            <div className="cg-empty-state">
                <FileText className="text-cg-outline mx-auto mb-3 h-10 w-10" />
                <p className="text-cg-on-surface-variant italic">No hay documentos disponibles.</p>
            </div>
        );
    }

    return (
        <>
            {preview && <DocumentoPreviewModal doc={preview} onClose={() => setPreview(null)} />}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {documentos.map((d) => {
                    const { icon: Icon, color, bg } = getFileIcon(d.fileName);
                    const ext = getFileExt(d.fileName);

                    return (
                        <div
                            key={d.id}
                            className="group rounded-2xl border border-[rgba(158,167,255,0.15)] bg-[rgba(255,255,255,0.05)] p-4 backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(158,167,255,0.4)]"
                        >
                            {/* File icon area */}
                            <div className="relative mb-4 flex h-32 items-center justify-center rounded-xl bg-[rgba(17,18,35,0.8)]">
                                <Icon className={`h-12 w-12 ${color}`} />
                                <span className="text-cg-outline absolute top-2 right-2 rounded bg-[rgba(35,36,58,0.9)] px-1.5 py-0.5 font-mono text-[8px] font-black tracking-widest uppercase">
                                    {ext}
                                </span>
                            </div>

                            {/* Title */}
                            <h4 className="font-display text-cg-on-surface group-hover:text-cg-primary-tonal mb-1 truncate text-sm font-bold transition-colors">
                                {d.nombre ?? 'Sin nombre'}
                            </h4>

                            {/* Meta */}
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-cg-outline font-mono text-[9px]">
                                    {d.fechaDoc ? formatDate(d.fechaDoc) : '—'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-3">
                                <span
                                    className={`flex h-6 w-6 items-center justify-center rounded ${bg}`}
                                >
                                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                                </span>
                                <div className="flex items-center gap-1">
                                    {d.fileName && (
                                        <Tooltip content="Vista previa">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    d.fileName &&
                                                    setPreview({
                                                        nombre: d.nombre,
                                                        fileName: d.fileName,
                                                    })
                                                }
                                                className="text-cg-outline hover:text-cg-primary-tonal flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(158,167,255,0.15)]"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </Tooltip>
                                    )}
                                    {d.fileName && (
                                        <Tooltip content="Descargar">
                                            <a
                                                href={
                                                    d.fileName
                                                        ? getCloudinaryPdfUrl(d.fileName)
                                                        : '#'
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cg-outline hover:text-cg-on-surface flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Tooltip>
                                    )}
                                    {canEdit && <EditDocumentoModal documento={d} />}
                                    {isAdmin && (
                                        <Tooltip content="Eliminar">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(d.id, d.nombre)}
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

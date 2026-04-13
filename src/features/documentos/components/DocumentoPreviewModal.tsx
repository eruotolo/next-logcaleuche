'use client';

import NextImage from 'next/image';

import { Download, FileText, X } from 'lucide-react';

import { getCloudinaryPdfUrl, getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';

export type PreviewDoc = { nombre: string | null; fileName: string };

export function DocumentoPreviewModal({ doc, onClose }: { doc: PreviewDoc; onClose: () => void }) {
    const ext = doc.fileName.split('.').pop()?.toLowerCase() ?? '';
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext);
    // Todo lo que no es imagen se trata como PDF (todos los raw uploads son PDFs)
    const isPdf = !isImage;
    const downloadUrl = getCloudinaryPdfUrl(doc.fileName);
    // Google Docs Viewer renderiza PDFs de URLs públicas sin restricciones de iframe
    const pdfPreviewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`;
    const imagePreviewUrl = getCloudinaryRawImageUrl(doc.fileName) ?? downloadUrl;

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click-to-close is supplementary; Escape key handled on dialog
        // biome-ignore lint/a11y/noStaticElementInteractions: intentional backdrop overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={doc.nombre ?? 'Vista previa'}
                className="relative flex w-full max-w-4xl flex-col rounded-2xl border border-[rgba(158,167,255,0.2)] bg-[rgba(17,18,35,0.97)] shadow-2xl"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.key === 'Escape' && onClose()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-5 py-4">
                    <h3 className="font-display text-cg-on-surface truncate pr-4 text-base font-bold">
                        {doc.nombre ?? 'Vista previa'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-cg-outline hover:text-cg-on-surface flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4">
                    {isPdf && (
                        <iframe
                            src={pdfPreviewUrl}
                            title={doc.nombre ?? 'Documento'}
                            className="h-[70vh] w-full rounded-lg"
                        />
                    )}
                    {isImage && (
                        <div className="relative h-[70vh] w-full">
                            <NextImage
                                src={imagePreviewUrl}
                                alt={doc.nombre ?? 'Imagen'}
                                fill
                                sizes="100vw"
                                unoptimized
                                className="rounded-lg object-contain"
                            />
                        </div>
                    )}
                    {!isPdf && !isImage && (
                        <div className="flex flex-col items-center gap-4 py-12 text-center">
                            <FileText className="text-cg-outline h-16 w-16" />
                            <p className="text-cg-on-surface-variant text-sm">
                                Vista previa no disponible para este tipo de archivo.
                            </p>
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-cg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                <Download className="h-4 w-4" />
                                Descargar archivo
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

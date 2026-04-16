'use client';

import NextImage from 'next/image';
import { useState } from 'react';

import { Download, FileText, Loader2, X } from 'lucide-react';

import { getCloudinaryPdfPreviewUrl, getCloudinaryPdfUrl, getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';

export type PreviewDoc = { nombre: string | null; fileName: string };

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
const OFFICE_EXTS = ['doc', 'docx', 'xls', 'xlsx'];

function getGoogleDriveEmbedUrl(url: string): string | null {
    if (!url.includes('drive.google.com')) return null;

    // https://drive.google.com/file/d/{ID}/view...
    const fileMatch = url.match(/\/file\/d\/([^/]+)\//);
    if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;

    // https://drive.google.com/open?id={ID}
    const openMatch = url.match(/[?&]id=([^&]+)/);
    if (openMatch) return `https://drive.google.com/file/d/${openMatch[1]}/preview`;

    return null;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: intentional multi-branch preview for pdf, image, office, and google drive types
export function DocumentoPreviewModal({ doc, onClose }: { doc: PreviewDoc; onClose: () => void }) {
    const [loading, setLoading] = useState(true);

    const googleDriveEmbedUrl = getGoogleDriveEmbedUrl(doc.fileName);
    const isGoogleDrive = googleDriveEmbedUrl !== null;

    const ext = isGoogleDrive ? '' : (doc.fileName.split('.').pop()?.toLowerCase() ?? '');
    const isImage = !isGoogleDrive && IMAGE_EXTS.includes(ext);
    const isOfficeDoc = !isGoogleDrive && OFFICE_EXTS.includes(ext);
    const isPdf = !isGoogleDrive && !isImage && !isOfficeDoc;

    const downloadUrl = isGoogleDrive ? doc.fileName : getCloudinaryPdfUrl(doc.fileName);
    const previewUrl = isGoogleDrive ? googleDriveEmbedUrl : getCloudinaryPdfPreviewUrl(doc.fileName);
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
                    <div className="flex items-center gap-2">
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={isGoogleDrive ? 'Abrir en Google Drive' : 'Descargar archivo'}
                            className="text-cg-outline hover:text-cg-on-surface flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                        >
                            <Download className="h-4 w-4" />
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-cg-outline hover:text-cg-on-surface flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4">
                    {(isPdf || isGoogleDrive) && (
                        <div className="relative h-[70vh] w-full">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="text-cg-outline h-8 w-8 animate-spin" />
                                </div>
                            )}
                            <iframe
                                src={previewUrl}
                                title={doc.nombre ?? 'Documento'}
                                className="h-full w-full rounded-lg"
                                onLoad={() => setLoading(false)}
                            />
                        </div>
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
                    {isOfficeDoc && (
                        <div className="flex flex-col items-center gap-4 py-12 text-center">
                            <FileText className="text-cg-outline h-16 w-16" />
                            <p className="text-cg-on-surface-variant text-sm">
                                Vista previa no disponible para archivos de Office.
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

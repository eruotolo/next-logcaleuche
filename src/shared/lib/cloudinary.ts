const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp', '.svg']);

/** Devuelve true si el fileName tiene extensión de imagen soportada por Cloudinary. */
export function isImageFile(fileName: string | null | undefined): boolean {
    if (!fileName) return false;
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return IMAGE_EXTS.has(ext);
}

/** Devuelve true si el valor es una URL externa (http/https). */
export function isExternalUrl(value: string): boolean {
    return value.startsWith('http://') || value.startsWith('https://');
}

/** URL de descarga para archivos raw (PDFs) via proxy autenticado. Pasa URLs externas tal cual. */
export function getCloudinaryPdfUrl(publicId: string): string {
    if (isExternalUrl(publicId)) return publicId;
    return `/api/raw/${publicId}`;
}

/** URL de preview inline para PDFs via proxy autenticado. Pasa URLs externas tal cual. */
export function getCloudinaryPdfPreviewUrl(publicId: string): string {
    if (isExternalUrl(publicId)) return publicId;
    return `/api/raw/${publicId}?inline=true`;
}


/**
 * URL de imagen Cloudinary con crop cuadrado (para avatares).
 * Devuelve undefined si no hay publicId, compatible con <AvatarImage src>.
 */
export function getCloudinaryImageUrl(
    publicId: string | null | undefined,
    width = 200,
    height = 200,
): string | undefined {
    if (!publicId) return undefined;
    // f_auto y q_auto permiten entregar WebP/Avif y resolver conflictos de extensión
    return `https://res.cloudinary.com/${CLOUD}/image/upload/c_fill,w_${width},h_${height},f_auto,q_auto/${publicId}`;
}

/**
 * URL completa de imagen sin transformaciones (para <img> directo).
 */
export function getCloudinaryRawImageUrl(publicId: string | null | undefined): string | undefined {
    if (!publicId) return undefined;
    return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${publicId}`;
}

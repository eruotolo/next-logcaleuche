const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** URL de descarga para archivos raw (PDFs). */
export function getCloudinaryPdfUrl(publicId: string): string {
    return `https://res.cloudinary.com/${CLOUD}/raw/upload/${publicId}`;
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

import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube un archivo a Cloudinary y retorna el public_id.
 * El public_id incluye el nombre original saneado para preservar la extensión.
 *
 * @param file         - Archivo a subir
 * @param folder       - Carpeta en Cloudinary (ej: 'logiacaleuche/documentos')
 * @param resourceType - 'image' para fotos, 'raw' para PDFs
 */
export async function uploadToCloudinary(
    file: File,
    folder: string,
    resourceType: 'image' | 'raw' = 'image',
): Promise<string> {
    const UPLOAD_TIMEOUT_MS = 30_000; // 30 segundos máximo

    // Obtener el buffer del archivo
    let buffer: Buffer = Buffer.from(await file.arrayBuffer());

    // Validar tipo real del archivo por magic bytes (no solo extensión)
    if (resourceType === 'image') {
        const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        const isPng =
            buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
        const isWebp =
            buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
        const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
        if (!isJpeg && !isPng && !isWebp && !isGif) {
            throw new Error('Formato de imagen no permitido. Usa JPG, PNG, WebP o GIF.');
        }
    } else if (resourceType === 'raw') {
        const isPdf =
            buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
        // OLE2: .doc / .xls (formatos legacy de Office)
        const isOle2 =
            buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
        // ZIP/PK: .docx / .xlsx (formatos modernos Office Open XML)
        const isZip =
            buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
        if (!isPdf && !isOle2 && !isZip) {
            throw new Error('Formato no permitido. Solo se aceptan PDF, Word (.doc/.docx) o Excel (.xls/.xlsx).');
        }
    }

    // Si es imagen, optimizar a WebP con sharp
    if (resourceType === 'image') {
        try {
            buffer = await sharp(buffer).webp({ quality: 80, effort: 4 }).toBuffer();
        } catch (error) {
            console.error('Error optimizando la imagen con sharp:', error);
            // Si el formato no es compatible continúa con el buffer original
        }
    }

    // Para imágenes: quitar la extensión para evitar el conflicto .jpg.jpg (Cloudinary la añade)
    // Para raw (PDFs): mantener la extensión en el public_id para poder detectarla luego
    const lastDot = file.name.lastIndexOf('.');
    const ext = lastDot > 0 ? file.name.substring(lastDot) : '';
    const baseName = lastDot > 0 ? file.name.substring(0, lastDot) : file.name;
    const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = resourceType === 'raw'
        ? `${Date.now()}-${safeName}${ext}`
        : `${Date.now()}-${safeName}`;

    const uploadPromise = new Promise<string>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                { folder, resource_type: resourceType, public_id: publicId },
                (err, result) => {
                    if (err || !result) return reject(err ?? new Error('Upload fallido'));
                    resolve(result.public_id);
                },
            )
            .end(buffer);
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Cloudinary upload timeout (30s)')), UPLOAD_TIMEOUT_MS),
    );

    return Promise.race([uploadPromise, timeoutPromise]);
}

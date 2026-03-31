import { prisma } from './db';

/**
 * Genera un slug a partir de un texto.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Reemplazar espacios por -
        .replace(/[^\w-]+/g, '') // Quitar caracteres no alfanuméricos
        .replace(/--+/g, '-') // Reemplazar múltiples - por uno solo
        .replace(/^-+/, '') // Quitar - del inicio
        .replace(/-+$/, ''); // Quitar - del final
}

/**
 * Genera un slug único para un modelo y campo específicos.
 */
export async function generateUniqueSlug(
    model: any,
    title: string,
    slugField = 'slug',
    idField = 'id',
    excludeId?: number,
): Promise<string> {
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const exists = await (prisma as any)[model].findFirst({
            where: {
                [slugField]: slug,
                ...(excludeId ? { NOT: { [idField]: excludeId } } : {}),
            },
        });

        if (!exists) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

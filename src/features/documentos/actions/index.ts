'use server';

import { cache } from 'react';

import { revalidatePath } from 'next/cache';

import { ACTIVITY_ACTION, ACTIVITY_ENTITY } from '@/shared/constants/activity-log';
import { auth } from '@/shared/lib/auth';
import { logActivity } from '@/shared/lib/activity-log';
import { requireAdmin } from '@/shared/lib/auth-guards';
import { uploadToCloudinary } from '@/shared/lib/cloudinary-upload';
import { prisma } from '@/shared/lib/db';
import type { ActionResult } from '@/shared/types/actions';

import { createNotifications } from '@/features/notificaciones/actions';

import { DocumentoSchema, LibroSchema, TrazadoSchema } from '../schemas';

// ── BIBLIOTECA ────────────────────────────────────────────────────────────

export const getBiblioteca = cache(async function getBiblioteca(gradoTarget: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.biblioteca.findMany({
        where: { gradoId: gradoTarget },
        include: { grado: true },
        orderBy: { id: 'desc' },
    });
});

export async function createLibro(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = LibroSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const externalUrl = (formData.get('externalUrl') as string | null)?.trim() ?? '';
    const file = formData.get('file') as File;

    let fileName: string;
    if (externalUrl?.startsWith('https://drive.google.com')) {
        fileName = externalUrl;
    } else if (file && file.size > 0) {
        try {
            fileName = await uploadToCloudinary(file, 'logiacaleuche/biblioteca', 'raw');
        } catch {
            return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
        }
    } else {
        return { success: false, error: 'Selecciona un archivo PDF o ingresa un link de Google Drive.' };
    }

    const libro = await prisma.biblioteca.create({
        data: {
            nombre: parsed.data.nombre,
            autor: parsed.data.autor,
            gradoId: parsed.data.grado,
            fileName,
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.LIBRO_CREATE,
        entity: ACTIVITY_ENTITY.BIBLIOTECA,
        entityId: libro.id,
        description: `Agregó libro "${parsed.data.nombre}" a biblioteca (grado ${parsed.data.grado})`,
    });

    // Notificar a usuarios según grado del documento (silencioso)
    try {
        const gradoId = parsed.data.grado;
        // Notificar solo a quienes pueden ver este grado de contenido:
        // grado 1 → todos (1, 2, 3) | grado 2 → compañeros y maestros (2, 3) | grado 3 → solo maestros (3)
        const gradoWhere =
            gradoId === 1
                ? {}
                : gradoId === 2
                  ? { gradoId: { in: [2, 3] } }
                  : { gradoId: 3 };

        const targetUsers = await prisma.user.findMany({
            where: { active: true, ...gradoWhere },
            select: { id: true },
        });

        const userIds = targetUsers
            .map((u) => u.id)
            .filter((id) => id !== Number.parseInt(session.user.id, 10));

        await createNotifications(
            userIds,
            'biblioteca',
            'Nuevo libro en Biblioteca',
            parsed.data.nombre,
            `/${gradoId === 1 ? 'aprendiz' : gradoId === 2 ? 'companero' : 'maestro'}/biblioteca`,
        );
    } catch {
        // Notificaciones no son críticas
    }

    revalidatePath('/aprendiz/biblioteca');
    revalidatePath('/companero/biblioteca');
    revalidatePath('/maestro/biblioteca');
    return { success: true, data: null };
}

export async function deleteLibro(id: number): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };
    await prisma.biblioteca.delete({ where: { id } });

    await logActivity({
        action: ACTIVITY_ACTION.LIBRO_DELETE,
        entity: ACTIVITY_ENTITY.BIBLIOTECA,
        entityId: id,
        description: `Eliminó libro con ID ${id} de biblioteca`,
    });

    revalidatePath('/aprendiz/biblioteca');
    revalidatePath('/companero/biblioteca');
    revalidatePath('/maestro/biblioteca');
    return { success: true, data: null };
}

export async function updateLibro(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = LibroSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const externalUrl = (formData.get('externalUrl') as string | null)?.trim() ?? '';
    let fileName: string | undefined;

    if (externalUrl?.startsWith('https://drive.google.com')) {
        fileName = externalUrl;
    } else {
        const file = formData.get('file') as File | null;
        if (file && file.size > 0) {
            try {
                fileName = await uploadToCloudinary(file, 'logiacaleuche/biblioteca', 'raw');
            } catch {
                return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
            }
        }
    }

    await prisma.biblioteca.update({
        where: { id },
        data: {
            nombre: parsed.data.nombre,
            autor: parsed.data.autor,
            gradoId: parsed.data.grado,
            ...(fileName !== undefined && { fileName }),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.LIBRO_UPDATE,
        entity: ACTIVITY_ENTITY.BIBLIOTECA,
        entityId: id,
        description: `Editó libro "${parsed.data.nombre}"`,
    });

    revalidatePath('/aprendiz/biblioteca');
    revalidatePath('/companero/biblioteca');
    revalidatePath('/maestro/biblioteca');
    return { success: true, data: null };
}

// ── TRAZADOS ──────────────────────────────────────────────────────────────

export const getTrazados = cache(async function getTrazados(gradoTarget: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.trazado.findMany({
        where: { gradoId: gradoTarget },
        include: {
            grado: true,
            autor: { select: { name: true, lastName: true } },
            tipoActividad: true,
        },
        orderBy: { fecha: 'desc' },
    });
});

export async function createTrazado(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = TrazadoSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
        fecha: formData.get('fecha'),
        tipoActividadId: formData.get('tipoActividadId'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: 'Selecciona un archivo PDF.' };
    let fileName: string;
    try {
        fileName = await uploadToCloudinary(file, 'logiacaleuche/trazados', 'raw');
    } catch {
        return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
    }

    const trazado = await prisma.trazado.create({
        data: {
            nombre: parsed.data.nombre,
            autorId: parsed.data.autor,
            gradoId: parsed.data.grado,
            fecha: new Date(parsed.data.fecha),
            tipoActividadId: parsed.data.tipoActividadId ?? null,
            fileName,
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TRAZADO_CREATE,
        entity: ACTIVITY_ENTITY.TRAZADO,
        entityId: trazado.id,
        description: `Subió trazado "${parsed.data.nombre}" (grado ${parsed.data.grado})`,
    });

    // Notificar a usuarios según grado del documento (silencioso)
    try {
        const gradoId = parsed.data.grado;
        // Notificar solo a quienes pueden ver este grado de contenido:
        // grado 1 → todos (1, 2, 3) | grado 2 → compañeros y maestros (2, 3) | grado 3 → solo maestros (3)
        const gradoWhere =
            gradoId === 1
                ? {}
                : gradoId === 2
                  ? { gradoId: { in: [2, 3] } }
                  : { gradoId: 3 };

        const targetUsers = await prisma.user.findMany({
            where: { active: true, ...gradoWhere },
            select: { id: true },
        });

        const userIds = targetUsers
            .map((u) => u.id)
            .filter((id) => id !== Number.parseInt(session.user.id, 10));

        await createNotifications(
            userIds,
            'trazado',
            'Nuevo trazado disponible',
            parsed.data.nombre,
            `/${gradoId === 1 ? 'aprendiz' : gradoId === 2 ? 'companero' : 'maestro'}/trazados`,
        );
    } catch {
        // Notificaciones no son críticas
    }

    revalidatePath('/aprendiz/trazados');
    revalidatePath('/companero/trazados');
    revalidatePath('/maestro/trazados');
    return { success: true, data: null };
}

export async function deleteTrazado(id: number): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };
    await prisma.trazado.delete({ where: { id } });

    await logActivity({
        action: ACTIVITY_ACTION.TRAZADO_DELETE,
        entity: ACTIVITY_ENTITY.TRAZADO,
        entityId: id,
        description: `Eliminó trazado con ID ${id}`,
    });

    revalidatePath('/aprendiz/trazados');
    revalidatePath('/companero/trazados');
    revalidatePath('/maestro/trazados');
    return { success: true, data: null };
}

export async function updateTrazado(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = TrazadoSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
        fecha: formData.get('fecha'),
        tipoActividadId: formData.get('tipoActividadId'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    let fileName: string | undefined;
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        try {
            fileName = await uploadToCloudinary(file, 'logiacaleuche/trazados', 'raw');
        } catch {
            return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
        }
    }

    await prisma.trazado.update({
        where: { id },
        data: {
            nombre: parsed.data.nombre,
            autorId: parsed.data.autor,
            gradoId: parsed.data.grado,
            fecha: new Date(parsed.data.fecha),
            tipoActividadId: parsed.data.tipoActividadId ?? null,
            ...(fileName !== undefined && { fileName }),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TRAZADO_UPDATE,
        entity: ACTIVITY_ENTITY.TRAZADO,
        entityId: id,
        description: `Editó trazado "${parsed.data.nombre}"`,
    });

    revalidatePath('/aprendiz/trazados');
    revalidatePath('/companero/trazados');
    revalidatePath('/maestro/trazados');
    return { success: true, data: null };
}

// ── DOCUMENTOS GENERALES ──────────────────────────────────────────────────

export const getDocumentos = cache(async function getDocumentos() {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.document.findMany({ orderBy: { fechaDoc: 'asc' } });
});

export async function createDocumento(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = DocumentoSchema.safeParse({
        nombre: formData.get('nombre'),
        fecha: formData.get('fecha'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: 'Selecciona un archivo PDF.' };
    let fileName: string;
    try {
        fileName = await uploadToCloudinary(file, 'logiacaleuche/documentos', 'raw');
    } catch {
        return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
    }

    const doc = await prisma.document.create({
        data: { nombre: parsed.data.nombre, fechaDoc: new Date(parsed.data.fecha), fileName },
    });

    await logActivity({
        action: ACTIVITY_ACTION.DOCUMENTO_CREATE,
        entity: ACTIVITY_ENTITY.DOCUMENTO,
        entityId: doc.id,
        description: `Subió documento "${parsed.data.nombre}"`,
    });

    revalidatePath('/documentos');
    return { success: true, data: null };
}

export async function updateDocumento(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = DocumentoSchema.safeParse({
        nombre: formData.get('nombre'),
        fecha: formData.get('fecha'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    // Archivo opcional — solo actualizar si se proporciona uno nuevo
    let fileName: string | undefined;
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        try {
            fileName = await uploadToCloudinary(file, 'logiacaleuche/documentos', 'raw');
        } catch {
            return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
        }
    }

    await prisma.document.update({
        where: { id },
        data: {
            nombre: parsed.data.nombre,
            fechaDoc: new Date(parsed.data.fecha),
            ...(fileName !== undefined && { fileName }),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.DOCUMENTO_UPDATE,
        entity: ACTIVITY_ENTITY.DOCUMENTO,
        entityId: id,
        description: `Editó documento "${parsed.data.nombre}"`,
    });

    revalidatePath('/documentos');
    return { success: true, data: null };
}

export async function deleteDocumento(id: number): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };
    await prisma.document.delete({ where: { id } });

    await logActivity({
        action: ACTIVITY_ACTION.DOCUMENTO_DELETE,
        entity: ACTIVITY_ENTITY.DOCUMENTO,
        entityId: id,
        description: `Eliminó documento con ID ${id}`,
    });

    revalidatePath('/documentos');
    return { success: true, data: null };
}

// ── FAVORITOS ─────────────────────────────────────────────────────────────

export async function toggleDocumentFavorite(
    documentType: string,
    documentId: number,
): Promise<ActionResult<{ favorited: boolean }>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };
    const userId = Number.parseInt(session.user.id, 10);

    const existing = await prisma.documentFavorite.findUnique({
        where: { userId_documentType_documentId: { userId, documentType, documentId } },
    });

    if (existing) {
        await prisma.documentFavorite.delete({ where: { id: existing.id } });
        return { success: true, data: { favorited: false } };
    }

    await prisma.documentFavorite.create({ data: { userId, documentType, documentId } });
    return { success: true, data: { favorited: true } };
}

export const getUserDocumentFavorites = cache(async function getUserDocumentFavorites() {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const userId = Number.parseInt(session.user.id, 10);

    return prisma.documentFavorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});

export const getFavoritesWithDetails = cache(async function getFavoritesWithDetails() {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const userId = Number.parseInt(session.user.id, 10);

    const favs = await prisma.documentFavorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    const biblioIds = favs.filter((f) => f.documentType === 'biblioteca').map((f) => f.documentId);
    const trazadoIds = favs.filter((f) => f.documentType === 'trazado').map((f) => f.documentId);
    const docIds = favs.filter((f) => f.documentType === 'documento').map((f) => f.documentId);

    const [biblioteca, trazados, documentos] = await Promise.all([
        biblioIds.length > 0
            ? prisma.biblioteca.findMany({ where: { id: { in: biblioIds } }, include: { grado: true } })
            : [],
        trazadoIds.length > 0
            ? prisma.trazado.findMany({ where: { id: { in: trazadoIds } }, include: { grado: true, autor: { select: { name: true, lastName: true } } } })
            : [],
        docIds.length > 0
            ? prisma.document.findMany({ where: { id: { in: docIds } } })
            : [],
    ]);

    return { biblioteca, trazados, documentos };
});

// ── VISTAS RECIENTES ──────────────────────────────────────────────────────

export async function registerDocumentView(
    documentType: string,
    documentId: number,
): Promise<void> {
    const session = await auth();
    if (!session) return;
    const userId = Number.parseInt(session.user.id, 10);

    await prisma.documentView.upsert({
        where: { userId_documentType_documentId: { userId, documentType, documentId } },
        create: { userId, documentType, documentId },
        update: { viewedAt: new Date() },
    });
}

export const getRecentDocumentViews = cache(async function getRecentDocumentViews(limit = 5) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const userId = Number.parseInt(session.user.id, 10);

    return prisma.documentView.findMany({
        where: { userId },
        orderBy: { viewedAt: 'desc' },
        take: limit,
    });
});

// ── BÚSQUEDA FTS ──────────────────────────────────────────────────────────

interface SearchResult {
    id: number;
    nombre: string | null;
    fileName: string | null;
    tipo: 'biblioteca' | 'trazado' | 'documento';
    gradoId?: number | null;
}

export async function searchDocumentos(
    query: string,
    tipo?: 'biblioteca' | 'trazado' | 'documento',
): Promise<SearchResult[]> {
    const session = await auth();
    if (!session) throw new Error('No autorizado');

    const userGrado = session.user.grado ?? 1;
    const sanitized = query.trim().replace(/['"\\]/g, '');
    if (!sanitized) return [];

    const results: SearchResult[] = [];

    if (!tipo || tipo === 'biblioteca') {
        const rows = await prisma.$queryRawUnsafe<
            { id: number; nombre_Libro: string | null; file_name: string | null; grado_Libro: number | null }[]
        >(
            `SELECT id, "nombre_Libro", "file_name", "grado_Libro"
             FROM biblioteca
             WHERE search_vector @@ plainto_tsquery('spanish', $1)
               AND "grado_Libro" <= $2
             ORDER BY ts_rank(search_vector, plainto_tsquery('spanish', $1)) DESC
             LIMIT 20`,
            sanitized,
            userGrado,
        );
        for (const r of rows) {
            results.push({ id: r.id, nombre: r.nombre_Libro, fileName: r.file_name, tipo: 'biblioteca', gradoId: r.grado_Libro });
        }
    }

    if (!tipo || tipo === 'trazado') {
        const rows = await prisma.$queryRawUnsafe<
            { id: number; name_Trazado: string | null; file_name: string; grado_Trazado: number | null }[]
        >(
            `SELECT id, "name_Trazado", "file_name", "grado_Trazado"
             FROM trazado
             WHERE search_vector @@ plainto_tsquery('spanish', $1)
               AND "grado_Trazado" <= $2
             ORDER BY ts_rank(search_vector, plainto_tsquery('spanish', $1)) DESC
             LIMIT 20`,
            sanitized,
            userGrado,
        );
        for (const r of rows) {
            results.push({ id: r.id, nombre: r.name_Trazado, fileName: r.file_name, tipo: 'trazado', gradoId: r.grado_Trazado });
        }
    }

    if (!tipo || tipo === 'documento') {
        const rows = await prisma.$queryRawUnsafe<
            { id: number; name_Doc: string | null; file_name: string | null }[]
        >(
            `SELECT id, "name_Doc", "file_name"
             FROM documents
             WHERE search_vector @@ plainto_tsquery('spanish', $1)
             ORDER BY ts_rank(search_vector, plainto_tsquery('spanish', $1)) DESC
             LIMIT 20`,
            sanitized,
        );
        for (const r of rows) {
            results.push({ id: r.id, nombre: r.name_Doc, fileName: r.file_name, tipo: 'documento' });
        }
    }

    return results;
}

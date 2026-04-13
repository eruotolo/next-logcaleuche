'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/shared/lib/auth';
import { uploadToCloudinary } from '@/shared/lib/cloudinary-upload';
import { prisma } from '@/shared/lib/db';
import type { ActionResult } from '@/shared/types/actions';

import { DocumentoSchema, LibroSchema, TrazadoSchema } from '../schemas';

// ── BIBLIOTECA ────────────────────────────────────────────────────────────

export async function getBiblioteca(gradoTarget: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.biblioteca.findMany({
        where: { gradoId: gradoTarget },
        include: { grado: true },
        orderBy: { id: 'desc' },
    });
}

export async function createLibro(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const parsed = LibroSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: 'Selecciona un archivo PDF.' };
    let fileName: string;
    try {
        fileName = await uploadToCloudinary(file, 'logiacaleuche/biblioteca', 'raw');
    } catch {
        return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
    }

    await prisma.biblioteca.create({
        data: {
            nombre: parsed.data.nombre,
            autor: parsed.data.autor,
            gradoId: parsed.data.grado,
            fileName,
        },
    });

    revalidatePath('/aprendiz/biblioteca');
    return { success: true, data: null };
}

export async function deleteLibro(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };
    await prisma.biblioteca.delete({ where: { id } });
    revalidatePath('/aprendiz/biblioteca');
    return { success: true, data: null };
}

export async function updateLibro(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const parsed = LibroSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    let fileName: string | undefined;
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        try {
            fileName = await uploadToCloudinary(file, 'logiacaleuche/biblioteca', 'raw');
        } catch {
            return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
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

    revalidatePath('/aprendiz/biblioteca');
    revalidatePath('/companero/biblioteca');
    revalidatePath('/maestro/biblioteca');
    return { success: true, data: null };
}

// ── TRAZADOS ──────────────────────────────────────────────────────────────

export async function getTrazados(gradoTarget: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.trazado.findMany({
        where: { gradoId: gradoTarget },
        include: {
            grado: true,
            autor: { select: { name: true, lastName: true } },
        },
        orderBy: { fecha: 'desc' },
    });
}

export async function createTrazado(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const parsed = TrazadoSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
        fecha: formData.get('fecha'),
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

    await prisma.trazado.create({
        data: {
            nombre: parsed.data.nombre,
            autorId: parsed.data.autor,
            gradoId: parsed.data.grado,
            fecha: new Date(parsed.data.fecha),
            fileName,
        },
    });

    revalidatePath('/aprendiz/trazados');
    return { success: true, data: null };
}

export async function deleteTrazado(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };
    await prisma.trazado.delete({ where: { id } });
    revalidatePath('/aprendiz/trazados');
    return { success: true, data: null };
}

export async function updateTrazado(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const parsed = TrazadoSchema.safeParse({
        nombre: formData.get('nombre'),
        autor: formData.get('autor'),
        grado: formData.get('grado'),
        fecha: formData.get('fecha'),
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
            ...(fileName !== undefined && { fileName }),
        },
    });

    revalidatePath('/aprendiz/trazados');
    revalidatePath('/companero/trazados');
    revalidatePath('/maestro/trazados');
    return { success: true, data: null };
}

// ── DOCUMENTOS GENERALES ──────────────────────────────────────────────────

export async function getDocumentos() {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.document.findMany({ orderBy: { fechaDoc: 'asc' } });
}

export async function createDocumento(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

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

    await prisma.document.create({
        data: { nombre: parsed.data.nombre, fechaDoc: new Date(parsed.data.fecha), fileName },
    });

    revalidatePath('/documentos');
    return { success: true, data: null };
}

export async function updateDocumento(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

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

    revalidatePath('/documentos');
    return { success: true, data: null };
}

export async function deleteDocumento(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };
    await prisma.document.delete({ where: { id } });
    revalidatePath('/documentos');
    return { success: true, data: null };
}

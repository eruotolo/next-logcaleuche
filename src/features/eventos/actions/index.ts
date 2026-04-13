'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/shared/lib/auth';
import { requireAdmin } from '@/shared/lib/auth-guards';
import { prisma } from '@/shared/lib/db';
import type { ActionResult } from '@/shared/types/actions';

import ExcelJS from 'exceljs';

import { EventoImportRowSchema, type ImportResult, EventoSchema } from '../schemas';

export async function getGrados() {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.grado.findMany({ orderBy: { id: 'asc' } });
}

export async function getEventos(grado: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const today = new Date();

    const gradoFilter =
        grado === 1 ? { gradoId: 1 } : grado === 2 ? { gradoId: { in: [1, 2] } } : {};

    return prisma.evento.findMany({
        where: {
            active: 1,
            fecha: { gte: today },
            ...gradoFilter,
        },
        include: { grado: true },
        orderBy: { fecha: 'asc' },
        take: 100,
    });
}

export async function getEventosCalendario(grado: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const gradoFilter =
        grado === 1 ? { gradoId: 1 } : grado === 2 ? { gradoId: { in: [1, 2] } } : {};

    return prisma.evento.findMany({
        where: { active: 1, ...gradoFilter },
        include: { grado: true },
        orderBy: { fecha: 'asc' },
    });
}

export async function getProximoEvento() {
    return prisma.evento.findFirst({
        where: { active: 1, fecha: { gte: new Date() } },
        include: { grado: true },
        orderBy: { fecha: 'asc' },
    });
}

export async function getUsuariosParaEvento(gradoId: number) {
    const gradoWhere =
        gradoId === 1 ? {} : gradoId === 2 ? { gradoId: { in: [2, 3] } } : { gradoId: 3 };

    return prisma.user.findMany({
        where: { active: true, ...gradoWhere },
        select: { email: true, name: true, lastName: true },
    });
}

export async function createEvento(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = EventoSchema.safeParse({
        nombre: formData.get('nombre'),
        trabajo: formData.get('trabajo'),
        autor: formData.get('autor'),
        fecha: formData.get('fecha'),
        hora: formData.get('hora'),
        lugar: formData.get('lugar'),
        grado: formData.get('grado'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Verifica los datos del formulario.' };
    }

    await prisma.evento.create({
        data: {
            nombre: parsed.data.nombre,
            trabajo: parsed.data.trabajo,
            autor: parsed.data.autor || null,
            fecha: new Date(parsed.data.fecha),
            hora: parsed.data.hora || null,
            lugar: parsed.data.lugar || null,
            gradoId: parsed.data.grado,
            active: 1,
        },
    });

    revalidatePath('/eventos');
    return { success: true, data: null };
}

export async function updateEvento(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = EventoSchema.safeParse({
        nombre: formData.get('nombre'),
        trabajo: formData.get('trabajo'),
        autor: formData.get('autor'),
        fecha: formData.get('fecha'),
        hora: formData.get('hora'),
        lugar: formData.get('lugar'),
        grado: formData.get('grado'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Verifica los datos del formulario.' };
    }

    await prisma.evento.update({
        where: { id },
        data: {
            nombre: parsed.data.nombre,
            trabajo: parsed.data.trabajo,
            autor: parsed.data.autor || null,
            fecha: new Date(parsed.data.fecha),
            hora: parsed.data.hora || null,
            lugar: parsed.data.lugar || null,
            gradoId: parsed.data.grado,
        },
    });

    revalidatePath('/eventos');
    return { success: true, data: null };
}

export async function deleteEvento(id: number): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    await prisma.evento.update({ where: { id }, data: { active: 0 } });
    revalidatePath('/eventos');
    return { success: true, data: null };
}

function parseDateCell(cell: ExcelJS.Cell): string {
    const value = cell.value;
    if (value instanceof Date) {
        return value.toISOString().split('T')[0];
    }
    if (typeof value === 'number') {
        // Excel serial date: days since 1900-01-01 (with the 1900 leap year bug)
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + value * 86400000);
        return date.toISOString().split('T')[0];
    }
    return String(value ?? '').trim();
}

const MAX_IMPORT_ROWS = 200;

export async function importEventos(formData: FormData): Promise<ActionResult<ImportResult>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'No se recibió archivo' };

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) return { success: false, error: 'El archivo no tiene hojas de cálculo' };

    const totalRows = worksheet.rowCount - 1; // minus header
    if (totalRows <= 0) return { success: false, error: 'El archivo no contiene datos' };
    if (totalRows > MAX_IMPORT_ROWS) {
        return { success: false, error: `Máximo ${MAX_IMPORT_ROWS} filas permitidas (se encontraron ${totalRows})` };
    }

    const validRows: Array<{
        nombre: string;
        trabajo: string;
        autor: string;
        fecha: string;
        hora: string;
        lugar: string;
        grado: number;
    }> = [];
    const errors: ImportResult['errors'] = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const rawData = {
            nombre: String(row.getCell(1).value ?? '').trim(),
            trabajo: String(row.getCell(2).value ?? '').trim(),
            autor: String(row.getCell(3).value ?? '').trim(),
            fecha: parseDateCell(row.getCell(4)),
            hora: String(row.getCell(5).value ?? '').trim(),
            lugar: String(row.getCell(6).value ?? '').trim(),
            grado: row.getCell(7).value,
        };

        const parsed = EventoImportRowSchema.safeParse(rawData);
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const messages = Object.values(fieldErrors).flat().filter(Boolean) as string[];
            errors.push({ row: rowNumber, messages });
        } else {
            validRows.push(parsed.data);
        }
    });

    if (errors.length > 0) {
        return { success: true, data: { imported: 0, errors } };
    }

    await prisma.evento.createMany({
        data: validRows.map((r) => ({
            nombre: r.nombre,
            trabajo: r.trabajo,
            autor: r.autor || null,
            fecha: new Date(r.fecha),
            hora: r.hora || null,
            lugar: r.lugar || null,
            gradoId: r.grado,
            active: 1,
        })),
    });

    revalidatePath('/eventos');
    return { success: true, data: { imported: validRows.length, errors: [] } };
}

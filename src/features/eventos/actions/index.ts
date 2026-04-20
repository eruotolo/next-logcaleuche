'use server';

import { cache } from 'react';

import { revalidatePath, revalidateTag } from 'next/cache';

import { ACTIVITY_ACTION, ACTIVITY_ENTITY } from '@/shared/constants/activity-log';
import { TIPO_ACTIVIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';
import { logActivity } from '@/shared/lib/activity-log';
import { requireAdmin } from '@/shared/lib/auth-guards';
import { prisma } from '@/shared/lib/db';
import { buildGradoNotifyFilter } from '@/shared/lib/grado';
import type { ActionResult } from '@/shared/types/actions';

import { createNotifications } from '@/features/notificaciones/actions';

import { EventoImportRowSchema, type ImportResult, EventoSchema } from '../schemas';

export const getGrados = cache(async function getGrados() {
    return prisma.grado.findMany({ orderBy: { id: 'asc' } });
});

export const getTiposActividad = cache(async function getTiposActividad() {
    return prisma.tipoActividad.findMany({ orderBy: { id: 'asc' } });
});

export const getEventos = cache(async function getEventos(grado: number) {
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
        include: { grado: true, tipoActividad: true },
        orderBy: { fecha: 'asc' },
        take: 100,
    });
});

export const getEventosCalendario = cache(async function getEventosCalendario(grado: number) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const gradoFilter =
        grado === 1 ? { gradoId: 1 } : grado === 2 ? { gradoId: { in: [1, 2] } } : {};

    return prisma.evento.findMany({
        where: { active: 1, ...gradoFilter },
        include: { grado: true, tipoActividad: true },
        orderBy: { fecha: 'asc' },
    });
});

export const getProximaTenida = cache(async function getProximaTenida() {
    return prisma.evento.findFirst({
        where: {
            active: 1,
            fecha: { gte: new Date() },
            tipoActividadId: TIPO_ACTIVIDAD.TENIDA,
        },
        include: { grado: true, tipoActividad: true },
        orderBy: { fecha: 'asc' },
    });
});

export async function getUsuariosParaEvento(gradoId: number) {
    const gradoWhere = buildGradoNotifyFilter(gradoId);

    return prisma.user.findMany({
        where: { active: true, ...gradoWhere },
        select: { id: true, email: true, name: true, lastName: true },
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
        tipoActividadId: formData.get('tipoActividadId'),
        autor: formData.get('autor'),
        fecha: formData.get('fecha'),
        hora: formData.get('hora'),
        lugar: formData.get('lugar'),
        grado: formData.get('grado'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Verifica los datos del formulario.' };
    }

    const evento = await prisma.evento.create({
        data: {
            nombre: parsed.data.nombre,
            tipoActividadId: parsed.data.tipoActividadId,
            autor: parsed.data.autor || null,
            fecha: new Date(parsed.data.fecha),
            hora: parsed.data.hora || null,
            lugar: parsed.data.lugar || null,
            gradoId: parsed.data.grado,
            active: 1,
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.EVENTO_CREATE,
        entity: ACTIVITY_ENTITY.EVENTO,
        entityId: evento.id,
        description: `Creó evento "${parsed.data.nombre}" (${parsed.data.fecha})`,
        metadata: { gradoId: parsed.data.grado },
    });

    // Notificar a usuarios con gradoId <= gradoId del evento (silencioso)
    try {
        const gradoId = parsed.data.grado;
        const gradoWhere = buildGradoNotifyFilter(gradoId);

        const targetUsers = await prisma.user.findMany({
            where: { active: true, ...gradoWhere },
            select: { id: true },
        });

        await createNotifications(
            targetUsers.map((u) => u.id),
            'evento',
            'Nuevo evento programado',
            parsed.data.nombre,
            '/eventos',
        );
    } catch {
        // Notificaciones no son críticas — continúa sin error
    }

    revalidatePath('/eventos');
    revalidateTag('grados', 'days');
    revalidateTag('tipos-actividad', 'days');
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
        tipoActividadId: formData.get('tipoActividadId'),
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
            tipoActividadId: parsed.data.tipoActividadId,
            autor: parsed.data.autor || null,
            fecha: new Date(parsed.data.fecha),
            hora: parsed.data.hora || null,
            lugar: parsed.data.lugar || null,
            gradoId: parsed.data.grado,
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.EVENTO_UPDATE,
        entity: ACTIVITY_ENTITY.EVENTO,
        entityId: id,
        description: `Editó evento "${parsed.data.nombre}"`,
    });

    revalidatePath('/eventos');
    revalidateTag('grados', 'days');
    revalidateTag('tipos-actividad', 'days');
    return { success: true, data: null };
}

export async function deleteEvento(id: number): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    await prisma.evento.update({ where: { id }, data: { active: 0 } });

    await logActivity({
        action: ACTIVITY_ACTION.EVENTO_DELETE,
        entity: ACTIVITY_ENTITY.EVENTO,
        entityId: id,
        description: `Eliminó evento con ID ${id}`,
    });

    revalidatePath('/eventos');
    revalidateTag('grados', 'days');
    revalidateTag('tipos-actividad', 'days');
    return { success: true, data: null };
}

function parseDateCell(cell: { value: unknown }): string {
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
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.default.Workbook();
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
        tipoActividadId: number;
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
            tipoActividadId: row.getCell(2).value,
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
            tipoActividadId: r.tipoActividadId,
            autor: r.autor || null,
            fecha: new Date(r.fecha),
            hora: r.hora || null,
            lugar: r.lugar || null,
            gradoId: r.grado,
            active: 1,
        })),
    });

    await logActivity({
        action: ACTIVITY_ACTION.EVENTO_IMPORT,
        entity: ACTIVITY_ENTITY.EVENTO,
        description: `Importó ${validRows.length} eventos desde archivo Excel`,
        metadata: { count: validRows.length },
    });

    revalidatePath('/eventos');
    return { success: true, data: { imported: validRows.length, errors: [] } };
}

// ── RSVP ─────────────────────────────────────────────────────────────────────

export type RsvpEstado = 'confirmado' | 'tentativo' | 'no_asiste';

export interface AsistenciaItem {
    userId: number;
    estado: string;
    user: { name: string | null; lastName: string | null };
}

export async function rsvpEvento(
    eventoId: number,
    estado: RsvpEstado,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    const userId = Number.parseInt(session.user.id, 10);

    await prisma.eventoAsistencia.upsert({
        where: { eventoId_userId: { eventoId, userId } },
        update: { estado },
        create: { eventoId, userId, estado },
    });

    revalidatePath('/eventos');
    return { success: true, data: null };
}

export const getAsistenciaEvento = cache(async function getAsistenciaEvento(
    eventoId: number,
): Promise<AsistenciaItem[]> {
    const session = await auth();
    if (!session) return [];

    return prisma.eventoAsistencia.findMany({
        where: { eventoId },
        select: {
            userId: true,
            estado: true,
            user: { select: { name: true, lastName: true } },
        },
        orderBy: { estado: 'asc' },
    });
});

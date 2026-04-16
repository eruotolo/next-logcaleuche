'use server';

import { cache } from 'react';

import { revalidatePath, revalidateTag } from 'next/cache';

import { z } from 'zod';

import { ACTIVITY_ACTION, ACTIVITY_ENTITY } from '@/shared/constants/activity-log';
import { CATEGORIA, MESES_NOMBRE, MOTIVO_ENTRADA, MOTIVO_SALIDA, OFICIALIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';
import { logActivity } from '@/shared/lib/activity-log';
import { prisma } from '@/shared/lib/db';
import { sendBoleta, sendRecordatorioCuotas } from '@/shared/lib/email';
import type { ActionResult } from '@/shared/types/actions';

import { TesoreriaQuerySchema } from '../schemas';

const EntradaSchema = z.object({
    userId: z.coerce.number().int().positive(),
    mes: z.string().min(1),
    ano: z.string().min(4),
    motivoId: z.coerce.number().int().positive(),
    monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
    fecha: z.string().min(1),
});

const SalidaSchema = z.object({
    mes: z.string().min(1),
    ano: z.string().min(4),
    motivoId: z.coerce.number().int().positive(),
    monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
    fecha: z.string().min(1),
});

async function calcularSaldoCuotasPendiente(userId: number, ano: string): Promise<number> {
    const [totalResult, user] = await Promise.all([
        prisma.entradaDinero.aggregate({
            where: { userId, ano, motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL },
            _sum: { monto: true },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { tarifa: { select: { monto: true } } },
        }),
    ]);
    const totalPagado = Number(totalResult._sum.monto ?? 0);
    const cuotaMensual = Number(user?.tarifa?.monto ?? 45000);
    return Math.max(0, cuotaMensual * 12 - totalPagado);
}

function isTesorero(session: { user: { oficialidad: number; categoryId: number } }) {
    return (
        session.user.oficialidad === OFICIALIDAD.TESORERO ||
        session.user.categoryId <= CATEGORIA.ADMIN
    );
}

export async function getResumenTesoreria() {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    // Excluir entradas del tesorero (username='270396356') con motivo=1 — idéntico al PHP
    const tesorero = await prisma.user.findUnique({
        where: { username: process.env.RUT_EXCLUIDO ?? '' },
        select: { id: true },
    });

    const whereEntrada = tesorero
        ? {
              NOT: [
                  { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] },
                  { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
              ],
          }
        : { NOT: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA } };

    const [totalIngresos, totalEgresos, hospitalEntradas, hospitalSalidas] = await Promise.all([
        prisma.entradaDinero.aggregate({ where: whereEntrada, _sum: { monto: true } }),
        prisma.salidaDinero.aggregate({
            where: { NOT: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA } },
            _sum: { monto: true },
        }),
        // Caja hospitalaria: entrada motivo=CAJA_HOSPITALARIA, salida motivo=CAJA_HOSPITALARIA
        prisma.entradaDinero.aggregate({
            where: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
            _sum: { monto: true },
        }),
        prisma.salidaDinero.aggregate({
            where: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA },
            _sum: { monto: true },
        }),
    ]);

    const ingresos = Number(totalIngresos._sum.monto ?? 0);
    const egresos = Number(totalEgresos._sum.monto ?? 0);
    const hospitalaria =
        Number(hospitalEntradas._sum.monto ?? 0) - Number(hospitalSalidas._sum.monto ?? 0);

    return { ingresos, egresos, saldo: ingresos - egresos, hospitalaria };
}

interface MovimientoRow {
    id: number;
    mes: string | null;
    ano: string | null;
    monto: number;
    fechaMov: Date;
    userId?: number | null;
    motivoId?: number | null;
    user: { name: string | null; lastName: string | null } | null;
    motivo: { id: number; nombre: string } | null;
}

interface PagedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export async function getEntradas(
    rawQuery: Record<string, string | undefined> = {},
): Promise<PagedResult<MovimientoRow>> {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    const { page, pageSize } = TesoreriaQuerySchema.parse(rawQuery);
    const skip = (page - 1) * pageSize;

    const [rows, total] = await Promise.all([
        prisma.entradaDinero.findMany({
            include: {
                user: { select: { name: true, lastName: true } },
                motivo: true,
            },
            orderBy: { fechaMov: 'desc' },
            skip,
            take: pageSize,
        }),
        prisma.entradaDinero.count(),
    ]);

    return {
        items: rows.map((r) => ({ ...r, monto: Number(r.monto ?? 0) })),
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
}

export async function getSalidas(
    rawQuery: Record<string, string | undefined> = {},
): Promise<PagedResult<MovimientoRow>> {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    const { page, pageSize } = TesoreriaQuerySchema.parse(rawQuery);
    const skip = (page - 1) * pageSize;

    const [rows, total] = await Promise.all([
        prisma.salidaDinero.findMany({
            include: {
                user: { select: { name: true, lastName: true } },
                motivo: true,
            },
            orderBy: { fechaMov: 'desc' },
            skip,
            take: pageSize,
        }),
        prisma.salidaDinero.count(),
    ]);

    return {
        items: rows.map((r) => ({ ...r, monto: Number(r.monto ?? 0) })),
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
}

export async function getEntradaById(id: number) {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    const row = await prisma.entradaDinero.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, lastName: true, email: true } },
            motivo: true,
        },
    });
    if (!row) return null;
    return { ...row, monto: Number(row.monto ?? 0) };
}

export async function getSalidaById(id: number) {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    const row = await prisma.salidaDinero.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, lastName: true } },
            motivo: true,
        },
    });
    if (!row) return null;
    return { ...row, monto: Number(row.monto ?? 0) };
}

export const getMotivoEntradas = cache(async function getMotivoEntradas() {
    return prisma.entradaMotivo.findMany({ orderBy: { id: 'asc' } });
});

export const getMotivoSalidas = cache(async function getMotivoSalidas() {
    return prisma.salidaMotivo.findMany({ orderBy: { id: 'asc' } });
});

export async function createEntrada(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const parsed = EntradaSchema.safeParse({
        userId: formData.get('userId'),
        mes: formData.get('mes'),
        ano: formData.get('ano'),
        motivoId: formData.get('motivoId'),
        monto: formData.get('monto'),
        fecha: formData.get('fecha'),
    });

    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const entrada = await prisma.entradaDinero.create({
        data: {
            userId: parsed.data.userId,
            mes: parsed.data.mes,
            ano: parsed.data.ano,
            motivoId: parsed.data.motivoId,
            monto: parsed.data.monto,
            fechaMov: new Date(parsed.data.fecha),
        },
        include: {
            user: { select: { name: true, lastName: true, email: true } },
            motivo: true,
        },
    });

    // Enviar boleta por email automáticamente — idéntico al PHP
    if (entrada.user?.email) {
        const nombre = `${entrada.user.name ?? ''} ${entrada.user.lastName ?? ''}`.trim();
        const esCuota = parsed.data.motivoId === MOTIVO_ENTRADA.CUOTA_MENSUAL;
        const saldoPendiente = esCuota
            ? await calcularSaldoCuotasPendiente(parsed.data.userId, parsed.data.ano)
            : undefined;
        sendBoleta({
            id: entrada.id,
            emailDestino: entrada.user.email,
            nombreDestino: nombre,
            nombre,
            mes: entrada.mes ?? '',
            ano: entrada.ano ?? '',
            motivo: entrada.motivo?.nombre ?? '',
            fecha: entrada.fechaMov,
            monto: Number(entrada.monto ?? 0),
            saldoPendiente,
        }).catch((err: unknown) => {
            console.error('[createEntrada] Fallo al enviar boleta por email:', err);
        });
    }

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_ENTRADA_CREATE,
        entity: ACTIVITY_ENTITY.ENTRADA,
        entityId: entrada.id,
        description: `Registró ingreso de $${parsed.data.monto} (${entrada.motivo?.nombre ?? 'sin motivo'}) — usuario ID ${parsed.data.userId}`,
        metadata: { userId: parsed.data.userId, mes: parsed.data.mes, ano: parsed.data.ano, monto: parsed.data.monto },
    });

    revalidatePath('/tesoreria/ingresos');
    revalidateTag('motivos-entrada', 'days');
    return { success: true, data: null };
}

export async function updateEntrada(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const parsed = EntradaSchema.safeParse({
        userId: formData.get('userId'),
        mes: formData.get('mes'),
        ano: formData.get('ano'),
        motivoId: formData.get('motivoId'),
        monto: formData.get('monto'),
        fecha: formData.get('fecha'),
    });

    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    await prisma.entradaDinero.update({
        where: { id },
        data: {
            userId: parsed.data.userId,
            mes: parsed.data.mes,
            ano: parsed.data.ano,
            motivoId: parsed.data.motivoId,
            monto: parsed.data.monto,
            fechaMov: new Date(parsed.data.fecha),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_ENTRADA_UPDATE,
        entity: ACTIVITY_ENTITY.ENTRADA,
        entityId: id,
        description: `Editó ingreso ID ${id} — $${parsed.data.monto}`,
    });

    revalidatePath('/tesoreria/ingresos');
    revalidateTag('motivos-entrada', 'days');
    return { success: true, data: null };
}

export async function deleteEntrada(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    await prisma.entradaDinero.delete({ where: { id } });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_ENTRADA_DELETE,
        entity: ACTIVITY_ENTITY.ENTRADA,
        entityId: id,
        description: `Eliminó ingreso con ID ${id}`,
    });

    revalidatePath('/tesoreria/ingresos');
    revalidateTag('motivos-entrada', 'days');
    return { success: true, data: null };
}

export async function createSalida(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const parsed = SalidaSchema.safeParse({
        mes: formData.get('mes'),
        ano: formData.get('ano'),
        motivoId: formData.get('motivoId'),
        monto: formData.get('monto'),
        fecha: formData.get('fecha'),
    });

    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    const salida = await prisma.salidaDinero.create({
        data: {
            userId: Number.parseInt(session.user.id, 10),
            mes: parsed.data.mes,
            ano: parsed.data.ano,
            motivoId: parsed.data.motivoId,
            monto: parsed.data.monto,
            fechaMov: new Date(parsed.data.fecha),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_SALIDA_CREATE,
        entity: ACTIVITY_ENTITY.SALIDA,
        entityId: salida.id,
        description: `Registró egreso de $${parsed.data.monto} — ${parsed.data.mes}/${parsed.data.ano}`,
        metadata: { mes: parsed.data.mes, ano: parsed.data.ano, monto: parsed.data.monto },
    });

    revalidatePath('/tesoreria/egresos');
    revalidateTag('motivos-salida', 'days');
    return { success: true, data: null };
}

export async function updateSalida(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const parsed = SalidaSchema.safeParse({
        mes: formData.get('mes'),
        ano: formData.get('ano'),
        motivoId: formData.get('motivoId'),
        monto: formData.get('monto'),
        fecha: formData.get('fecha'),
    });

    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    await prisma.salidaDinero.update({
        where: { id },
        data: {
            mes: parsed.data.mes,
            ano: parsed.data.ano,
            motivoId: parsed.data.motivoId,
            monto: parsed.data.monto,
            fechaMov: new Date(parsed.data.fecha),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_SALIDA_UPDATE,
        entity: ACTIVITY_ENTITY.SALIDA,
        entityId: id,
        description: `Editó egreso ID ${id} — $${parsed.data.monto}`,
    });

    revalidatePath('/tesoreria/egresos');
    revalidateTag('motivos-salida', 'days');
    return { success: true, data: null };
}

export async function deleteSalida(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    await prisma.salidaDinero.delete({ where: { id } });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_SALIDA_DELETE,
        entity: ACTIVITY_ENTITY.SALIDA,
        entityId: id,
        description: `Eliminó egreso con ID ${id}`,
    });

    revalidatePath('/tesoreria/egresos');
    revalidateTag('motivos-salida', 'days');
    return { success: true, data: null };
}

export async function sendBoletaManual(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const entrada = await prisma.entradaDinero.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, lastName: true, email: true } },
            motivo: true,
        },
    });

    if (!entrada) return { success: false, error: 'Entrada no encontrada.' };
    if (!entrada.user?.email)
        return { success: false, error: 'El miembro no tiene email registrado.' };

    const nombre = `${entrada.user.name ?? ''} ${entrada.user.lastName ?? ''}`.trim();
    const esCuota = entrada.motivoId === MOTIVO_ENTRADA.CUOTA_MENSUAL;
    const saldoPendiente =
        esCuota && entrada.userId
            ? await calcularSaldoCuotasPendiente(
                  entrada.userId,
                  entrada.ano ?? new Date().getFullYear().toString(),
              )
            : undefined;

    await sendBoleta({
        id: entrada.id,
        emailDestino: entrada.user.email,
        nombreDestino: nombre,
        nombre,
        mes: entrada.mes ?? '',
        ano: entrada.ano ?? '',
        motivo: entrada.motivo?.nombre ?? '',
        fecha: entrada.fechaMov,
        monto: Number(entrada.monto ?? 0),
        saldoPendiente,
    });

    return { success: true, data: null };
}

// ── TarifaCuota CRUD ────────────────────────────────────────────────

export async function getTarifasCuota() {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');
    return prisma.tarifaCuota.findMany({ orderBy: { monto: 'asc' } });
}

const TarifaCuotaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    monto: z.coerce.number().int().positive('El monto debe ser mayor a 0'),
});

export async function createTarifaCuota(formData: FormData): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const parsed = TarifaCuotaSchema.safeParse({
        nombre: formData.get('nombre'),
        monto: formData.get('monto'),
    });
    if (!parsed.success)
        return {
            success: false,
            error: parsed.error.flatten().fieldErrors.nombre?.[0] ?? 'Verifica los datos.',
        };

    const tarifa = await prisma.tarifaCuota.create({
        data: { nombre: parsed.data.nombre, monto: parsed.data.monto },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_TARIFA_CREATE,
        entity: ACTIVITY_ENTITY.TARIFA,
        entityId: tarifa.id,
        description: `Creó tarifa "${parsed.data.nombre}" ($${parsed.data.monto})`,
    });

    revalidatePath('/tesoreria/ingresos');
    return { success: true, data: null };
}

export async function updateTarifaCuota(
    id: number,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const parsed = TarifaCuotaSchema.safeParse({
        nombre: formData.get('nombre'),
        monto: formData.get('monto'),
    });
    if (!parsed.success) return { success: false, error: 'Verifica los datos.' };

    await prisma.tarifaCuota.update({
        where: { id },
        data: { nombre: parsed.data.nombre, monto: parsed.data.monto },
    });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_TARIFA_UPDATE,
        entity: ACTIVITY_ENTITY.TARIFA,
        entityId: id,
        description: `Editó tarifa "${parsed.data.nombre}" ($${parsed.data.monto})`,
    });

    revalidatePath('/tesoreria/ingresos');
    return { success: true, data: null };
}

export async function deleteTarifaCuota(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    // No eliminar si tiene usuarios asignados
    const usersCount = await prisma.user.count({ where: { cuotaId: id } });
    if (usersCount > 0) {
        return {
            success: false,
            error: `No se puede eliminar: hay ${usersCount} miembro(s) con esta tarifa asignada.`,
        };
    }

    await prisma.tarifaCuota.delete({ where: { id } });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_TARIFA_DELETE,
        entity: ACTIVITY_ENTITY.TARIFA,
        entityId: id,
        description: `Eliminó tarifa con ID ${id}`,
    });

    revalidatePath('/tesoreria/ingresos');
    return { success: true, data: null };
}

// ── Ingreso de múltiples cuotas ─────────────────────────────────────

export async function createMultipleEntradas(
    formData: FormData,
): Promise<ActionResult<{ count: number }>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const userId = Number(formData.get('userId'));
    const ano = formData.get('ano') as string;
    const monto = Number(formData.get('monto'));
    const meses = formData.getAll('meses') as string[];
    const fecha = (formData.get('fecha') as string) || new Date().toISOString().split('T')[0];

    if (!userId || !ano || monto <= 0 || meses.length === 0) {
        return { success: false, error: 'Completa todos los campos y selecciona al menos un mes.' };
    }

    await prisma.entradaDinero.createMany({
        data: meses.map((mes) => ({
            userId,
            mes,
            ano,
            motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL,
            monto,
            fechaMov: new Date(fecha),
        })),
    });

    await logActivity({
        action: ACTIVITY_ACTION.TESORERIA_ENTRADA_BULK,
        entity: ACTIVITY_ENTITY.ENTRADA,
        description: `Registró ${meses.length} cuota(s) para usuario ID ${userId} — año ${ano}`,
        metadata: { userId, ano, meses, monto },
    });

    revalidatePath('/tesoreria/ingresos');
    return { success: true, data: { count: meses.length } };
}

export async function getPagosUsuarioAno(userId: number): Promise<
    { mes: string; ano: string; motivo: string; monto: number; fechaMov: Date }[]
> {
    const session = await auth();
    if (!session) throw new Error('No autorizado');

    const ano = new Date().getFullYear().toString();

    const rows = await prisma.entradaDinero.findMany({
        where: { userId, ano, motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL },
        select: {
            mes: true,
            ano: true,
            monto: true,
            fechaMov: true,
            motivo: { select: { nombre: true } },
        },
        orderBy: { fechaMov: 'asc' },
    });

    return rows.map((r) => ({
        mes: r.mes ?? '',
        ano: r.ano ?? '',
        motivo: r.motivo?.nombre ?? '',
        monto: Number(r.monto ?? 0),
        fechaMov: r.fechaMov,
    }));
}

export async function sendRecordatorioCuotasAction(): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    const users = await prisma.user.findMany({
        where: { active: true },
        select: { email: true },
    });

    const emails = users.map((u) => u.email).filter(Boolean) as string[];
    await sendRecordatorioCuotas(emails);
    return { success: true, data: null };
}

export async function getInforme(
    tipo: 'mensual' | 'anual' | 'personalizado',
    params: {
        mes?: string;
        ano?: string;
        desde?: string;
        hasta?: string;
    },
) {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    let where: Record<string, unknown> = {};

    if (tipo === 'mensual' && params.mes && params.ano) {
        where = { mes: params.mes, ano: params.ano };
    } else if (tipo === 'anual' && params.ano) {
        where = { ano: params.ano };
    } else if (tipo === 'personalizado' && params.desde && params.hasta) {
        where = { fechaMov: { gte: new Date(params.desde), lte: new Date(params.hasta) } };
    }

    // Año para estado de cuotas
    let anoReporte = params.ano ?? new Date().getFullYear().toString();
    if (tipo === 'personalizado' && params.hasta) {
        anoReporte = new Date(params.hasta).getFullYear().toString();
    }

    const tesorero = await prisma.user.findUnique({
        where: { username: process.env.RUT_EXCLUIDO ?? '' },
        select: { id: true },
    });

    const whereEntrada = tesorero
        ? {
              ...where,
              NOT: [
                  { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] },
                  { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
              ],
          }
        : { ...where, NOT: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA } };

    const [entradasRaw, salidasRaw] = await Promise.all([
        prisma.entradaDinero.findMany({
            where: whereEntrada,
            include: {
                user: { select: { name: true, lastName: true, username: true } },
                motivo: true,
            },
            orderBy: { fechaMov: 'asc' },
        }),
        prisma.salidaDinero.findMany({
            where: { ...where, NOT: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA } },
            include: { user: { select: { name: true, lastName: true } }, motivo: true },
            orderBy: { fechaMov: 'asc' },
        }),
    ]);

    const entradas = entradasRaw.map((e) => ({ ...e, monto: Number(e.monto ?? 0) }));
    const salidas = salidasRaw.map((s) => ({ ...s, monto: Number(s.monto ?? 0) }));

    const totalIngresos = entradas.reduce((s, e) => s + e.monto, 0);
    const totalEgresos = salidas.reduce((s, e) => s + e.monto, 0);

    // ── Histórico global (resumen ejecutivo) ──
    const [histIngresos, histEgresos, histHosp, histHospSal] = await Promise.all([
        prisma.entradaDinero.aggregate({
            where: tesorero
                ? {
                      NOT: [
                          {
                              AND: [
                                  { userId: tesorero.id },
                                  { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL },
                              ],
                          },
                          { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
                      ],
                  }
                : { NOT: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA } },
            _sum: { monto: true },
        }),
        prisma.salidaDinero.aggregate({
            where: { NOT: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA } },
            _sum: { monto: true },
        }),
        prisma.entradaDinero.aggregate({
            where: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
            _sum: { monto: true },
        }),
        prisma.salidaDinero.aggregate({
            where: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA },
            _sum: { monto: true },
        }),
    ]);
    const historico = {
        ingresos: Number(histIngresos._sum.monto ?? 0),
        egresos: Number(histEgresos._sum.monto ?? 0),
        saldo: Number(histIngresos._sum.monto ?? 0) - Number(histEgresos._sum.monto ?? 0),
        hospitalaria: Number(histHosp._sum.monto ?? 0) - Number(histHospSal._sum.monto ?? 0),
    };

    // ── Movimientos por mes (solo informe anual) ──
    let movimientosPorMes: { mes: string; ingresos: number; egresos: number; saldo: number }[] = [];
    if (tipo === 'anual' && params.ano) {
        const ingNotCondition = tesorero
            ? [
                  { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] },
                  { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
              ]
            : [{ motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA }];
        const [ingGrouped, egrGrouped] = await Promise.all([
            prisma.entradaDinero.groupBy({
                by: ['mes'],
                where: { ano: params.ano, NOT: ingNotCondition },
                _sum: { monto: true },
            }),
            prisma.salidaDinero.groupBy({
                by: ['mes'],
                where: { ano: params.ano, NOT: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA } },
                _sum: { monto: true },
            }),
        ]);
        const ingMap = new Map(ingGrouped.map((r) => [r.mes, Number(r._sum.monto ?? 0)]));
        const egrMap = new Map(egrGrouped.map((r) => [r.mes, Number(r._sum.monto ?? 0)]));
        movimientosPorMes = MESES_NOMBRE.map((mesNombre, i) => {
            const mesKey = `${String(i + 1).padStart(2, '0')} - ${mesNombre}`;
            const ing_ = ingMap.get(mesKey) ?? 0;
            const egr_ = egrMap.get(mesKey) ?? 0;
            return ing_ > 0 || egr_ > 0
                ? { mes: mesNombre, ingresos: ing_, egresos: egr_, saldo: ing_ - egr_ }
                : null;
        }).filter(Boolean) as typeof movimientosPorMes;
    }

    // ── Top 5 motivos ──
    const entradasConMotivo = entradas.reduce<Record<string, number>>((acc, e) => {
        const k = e.motivo?.nombre ?? 'Sin motivo';
        acc[k] = (acc[k] ?? 0) + Number(e.monto ?? 0);
        return acc;
    }, {});
    const salidasConMotivo = salidas.reduce<Record<string, number>>((acc, s) => {
        const k = s.motivo?.nombre ?? 'Sin motivo';
        acc[k] = (acc[k] ?? 0) + Number(s.monto ?? 0);
        return acc;
    }, {});
    const topIngresos = Object.entries(entradasConMotivo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([nombre, total]) => ({ nombre, total }));
    const topEgresos = Object.entries(salidasConMotivo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([nombre, total]) => ({ nombre, total }));

    // ── Estado de cuotas ──
    const { getCuotaMensual } = await import('../lib/cuotas');
    const usersConCuotas = await prisma.user.findMany({
        where: { active: true },
        select: {
            id: true,
            username: true,
            name: true,
            lastName: true,
            createdAt: true,
            tarifa: { select: { monto: true } },
            entradas: {
                where: { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL, ano: anoReporte },
                select: { mes: true },
            },
        },
        orderBy: { name: 'asc' },
    });

    const ORDEN_MESES: Record<string, number> = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Septiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12,
    };

    const estadoCuotas = usersConCuotas.map((u) => {
        const cuotaMensual = getCuotaMensual(u.tarifa?.monto);

        // Determinar desde qué mes debe pagar
        let mesesACobrar = [...MESES_NOMBRE];
        if (u.createdAt) {
            const anoCreacion = u.createdAt.getFullYear().toString();
            if (anoCreacion === anoReporte) {
                const mesCreacion = u.createdAt.getMonth(); // 0-indexed
                const mesInicio = mesCreacion + 1; // mes siguiente al registro
                mesesACobrar = mesInicio < 12 ? MESES_NOMBRE.slice(mesInicio) : [];
            }
        }

        // Meses pagados (extraer nombre del mes del formato "01 - Enero")
        const mesesPagados = u.entradas
            .map((e) => {
                const parts = (e.mes ?? '').split(' - ');
                return parts.length === 2 ? parts[1].trim() : (e.mes ?? '');
            })
            .filter((m) => (MESES_NOMBRE as readonly string[]).includes(m))
            .sort((a, b) => (ORDEN_MESES[a] ?? 0) - (ORDEN_MESES[b] ?? 0));

        const mesesPendientes = mesesACobrar.filter((m) => !mesesPagados.includes(m));
        const deudaTotal = mesesPendientes.length * cuotaMensual;

        return {
            nombre: `${u.name ?? ''} ${u.lastName ?? ''}`.trim(),
            username: u.username ?? '',
            cuotaMensual,
            mesesPagados,
            mesesPendientes,
            deudaTotal,
        };
    });

    return {
        entradas,
        salidas,
        totalIngresos,
        totalEgresos,
        saldo: totalIngresos - totalEgresos,
        historico,
        movimientosPorMes,
        topIngresos,
        topEgresos,
        estadoCuotas,
        anoReporte,
    };
}

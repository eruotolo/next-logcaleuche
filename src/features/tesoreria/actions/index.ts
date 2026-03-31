'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { CATEGORIA, MOTIVO_ENTRADA, MOTIVO_SALIDA, OFICIALIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';
import { sendBoleta, sendRecordatorioCuotas } from '@/shared/lib/email';
import type { ActionResult } from '@/shared/types/actions';

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

function isTesorero(session: { user: { oficialidad: number; categoryId: number } }) {
    return (
        session.user.oficialidad === OFICIALIDAD.TESORERO ||
        session.user.categoryId === CATEGORIA.SUPER_ADMIN
    );
}

export async function getResumenTesoreria() {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    // Excluir entradas del tesorero (username='270396356') con motivo=1 — idéntico al PHP
    const tesorero = await prisma.user.findUnique({
        where: { username: process.env.TESORERO_RUT ?? '' },
        select: { id: true },
    });

    const whereEntrada = tesorero
        ? { NOT: { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] } }
        : {};

    const [totalIngresos, totalEgresos, hospitalEntradas, hospitalSalidas] = await Promise.all([
        prisma.entradaDinero.aggregate({ where: whereEntrada, _sum: { monto: true } }),
        prisma.salidaDinero.aggregate({ _sum: { monto: true } }),
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

export async function getEntradas() {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    const rows = await prisma.entradaDinero.findMany({
        include: {
            user: { select: { name: true, lastName: true } },
            motivo: true,
        },
        orderBy: { fechaMov: 'desc' },
    });
    return rows.map((r) => ({ ...r, monto: Number(r.monto ?? 0) }));
}

export async function getSalidas() {
    const session = await auth();
    if (!session || !isTesorero(session)) throw new Error('No autorizado');

    const rows = await prisma.salidaDinero.findMany({
        include: {
            user: { select: { name: true, lastName: true } },
            motivo: true,
        },
        orderBy: { fechaMov: 'desc' },
    });
    return rows.map((r) => ({ ...r, monto: Number(r.monto ?? 0) }));
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

export async function getMotivoEntradas() {
    return prisma.entradaMotivo.findMany({ orderBy: { id: 'asc' } });
}

export async function getMotivoSalidas() {
    return prisma.salidaMotivo.findMany({ orderBy: { id: 'asc' } });
}

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
        }).catch((err: unknown) => {
            console.error('[createEntrada] Fallo al enviar boleta por email:', err);
        });
    }

    revalidatePath('/tesoreria/ingresos');
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

    revalidatePath('/tesoreria/ingresos');
    return { success: true, data: null };
}

export async function deleteEntrada(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    await prisma.entradaDinero.delete({ where: { id } });
    revalidatePath('/tesoreria/ingresos');
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

    await prisma.salidaDinero.create({
        data: {
            userId: Number.parseInt(session.user.id, 10),
            mes: parsed.data.mes,
            ano: parsed.data.ano,
            motivoId: parsed.data.motivoId,
            monto: parsed.data.monto,
            fechaMov: new Date(parsed.data.fecha),
        },
    });

    revalidatePath('/tesoreria/egresos');
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

    revalidatePath('/tesoreria/egresos');
    return { success: true, data: null };
}

export async function deleteSalida(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || !isTesorero(session)) return { success: false, error: 'No autorizado' };

    await prisma.salidaDinero.delete({ where: { id } });
    revalidatePath('/tesoreria/egresos');
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

    await prisma.tarifaCuota.create({
        data: { nombre: parsed.data.nombre, monto: parsed.data.monto },
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

    revalidatePath('/tesoreria/ingresos');
    return { success: true, data: { count: meses.length } };
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
        where: { username: process.env.TESORERO_RUT ?? '' },
        select: { id: true },
    });

    const whereEntrada = tesorero
        ? {
              ...where,
              NOT: { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] },
          }
        : where;

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
            where,
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
                      NOT: {
                          AND: [
                              { userId: tesorero.id },
                              { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL },
                          ],
                      },
                  }
                : {},
            _sum: { monto: true },
        }),
        prisma.salidaDinero.aggregate({ _sum: { monto: true } }),
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
    const MESES_NOMBRE = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];
    let movimientosPorMes: { mes: string; ingresos: number; egresos: number; saldo: number }[] = [];
    if (tipo === 'anual' && params.ano) {
        const mesRows = await Promise.all(
            MESES_NOMBRE.map(async (mesNombre, i) => {
                const mesNum = String(i + 1).padStart(2, '0');
                const [ing, egr] = await Promise.all([
                    prisma.entradaDinero.aggregate({
                        where: { mes: `${mesNum} - ${mesNombre}`, ano: params.ano },
                        _sum: { monto: true },
                    }),
                    prisma.salidaDinero.aggregate({
                        where: { mes: `${mesNum} - ${mesNombre}`, ano: params.ano },
                        _sum: { monto: true },
                    }),
                ]);
                const ing_ = Number(ing._sum.monto ?? 0);
                const egr_ = Number(egr._sum.monto ?? 0);
                return ing_ > 0 || egr_ > 0
                    ? { mes: mesNombre, ingresos: ing_, egresos: egr_, saldo: ing_ - egr_ }
                    : null;
            }),
        );
        movimientosPorMes = mesRows.filter(Boolean) as typeof movimientosPorMes;
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
            .filter((m) => MESES_NOMBRE.includes(m))
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

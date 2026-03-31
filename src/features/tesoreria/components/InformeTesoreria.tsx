'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { formatDate } from '@/shared/lib/utils';

import { getInforme } from '../actions';

// ── Botón de descarga PDF ─────────────────────────────────────────────────────
function DescargarPdfButton({
    tipo,
    mes,
    ano,
    desde,
    hasta,
}: {
    tipo: string;
    mes: string;
    ano: string;
    desde: string;
    hasta: string;
}) {
    const [loading, setLoading] = useState(false);

    function handleDownload() {
        const params = new URLSearchParams({ tipo });
        if (tipo === 'mensual') {
            params.set('mes', mes);
            params.set('ano', ano);
        } else if (tipo === 'anual') {
            params.set('ano', ano);
        } else if (tipo === 'personalizado') {
            params.set('desde', desde);
            params.set('hasta', hasta);
        }

        setLoading(true);
        const url = `/api/tesoreria/informe-pdf?${params.toString()}`;
        // Descarga directa via anchor — el browser abre el stream PDF sin bloquear la UI
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Pequeño delay para resetear loading (la descarga es async desde el server)
        setTimeout(() => setLoading(false), 2000);
    }

    return (
        <Button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className="border border-[rgba(41,128,185,0.4)] bg-[rgba(41,128,185,0.1)] text-[var(--color-primary)] hover:bg-[rgba(41,128,185,0.2)]"
        >
            {loading ? 'Generando PDF…' : 'Descargar PDF'}
        </Button>
    );
}

const MESES = [
    '01 - Enero',
    '02 - Febrero',
    '03 - Marzo',
    '04 - Abril',
    '05 - Mayo',
    '06 - Junio',
    '07 - Julio',
    '08 - Agosto',
    '09 - Septiembre',
    '10 - Octubre',
    '11 - Noviembre',
    '12 - Diciembre',
];

type TipoInforme = 'mensual' | 'anual' | 'personalizado';
type InformeData = Awaited<ReturnType<typeof getInforme>>;

function formatClp(val: number) {
    return val.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

export function InformeTesoreria() {
    const [tipo, setTipo] = useState<TipoInforme>('mensual');
    const [mes, setMes] = useState(MESES[new Date().getMonth()]);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [data, setData] = useState<InformeData | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleGenerate() {
        startTransition(async () => {
            const result = await getInforme(tipo, { mes, ano, desde, hasta });
            setData(result);
        });
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="cg-form-container space-y-4">
                <div className="mb-2 flex flex-wrap gap-2">
                    {(['mensual', 'anual', 'personalizado'] as TipoInforme[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTipo(t)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                                tipo === t
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                    : 'text-cg-on-surface-variant border-[rgba(70,70,88,0.35)] bg-transparent hover:bg-[rgba(255,255,255,0.04)]'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-end gap-3">
                    {tipo === 'mensual' && (
                        <>
                            <div className="space-y-1">
                                <label className="form-label">Mes</label>
                                <select
                                    value={mes}
                                    onChange={(e) => setMes(e.target.value)}
                                    className="form-select"
                                >
                                    {MESES.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="form-label">Año</label>
                                <Input
                                    value={ano}
                                    onChange={(e) => setAno(e.target.value)}
                                    className="h-9 w-24"
                                />
                            </div>
                        </>
                    )}

                    {tipo === 'anual' && (
                        <div className="space-y-1">
                            <label className="form-label">Año</label>
                            <Input
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                className="h-9 w-24"
                            />
                        </div>
                    )}

                    {tipo === 'personalizado' && (
                        <>
                            <div className="space-y-1">
                                <label className="form-label">Desde</label>
                                <Input
                                    type="date"
                                    value={desde}
                                    onChange={(e) => setDesde(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="form-label">Hasta</label>
                                <Input
                                    type="date"
                                    value={hasta}
                                    onChange={(e) => setHasta(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </>
                    )}

                    <Button onClick={handleGenerate} disabled={isPending}>
                        {isPending ? 'Generando…' : 'Generar Informe'}
                    </Button>
                </div>
            </div>

            {/* Resultados */}
            {data && (
                <div className="space-y-6">
                    {/* Botón PDF — solo visible con datos cargados */}
                    <div className="flex justify-end">
                        <DescargarPdfButton
                            tipo={tipo}
                            mes={mes}
                            ano={ano}
                            desde={desde}
                            hasta={hasta}
                        />
                    </div>

                    {/* Resumen Ejecutivo — Histórico */}
                    <div className="cg-form-container">
                        <h2 className="text-cg-on-surface mb-4 border-b border-[rgba(70,70,88,0.2)] pb-3 text-lg font-bold">
                            Resumen Ejecutivo
                        </h2>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <div className="rounded-lg border border-[rgba(65,166,90,0.2)] bg-[rgba(65,166,90,0.1)] p-4">
                                <p className="text-xs font-semibold tracking-wide text-[var(--color-entrada)] uppercase">
                                    Total Ingreso (Período)
                                </p>
                                <p className="mt-1 text-xl font-bold text-[var(--color-entrada)]">
                                    {formatClp(data.totalIngresos)}
                                </p>
                            </div>
                            <div className="rounded-lg border border-[rgba(255,110,132,0.2)] bg-[rgba(255,110,132,0.1)] p-4">
                                <p className="text-cg-error text-xs font-semibold tracking-wide uppercase">
                                    Total Egreso (Período)
                                </p>
                                <p className="text-cg-error mt-1 text-xl font-bold">
                                    {formatClp(data.totalEgresos)}
                                </p>
                            </div>
                            <div className="rounded-lg border border-[rgba(86,192,239,0.2)] bg-[rgba(86,192,239,0.1)] p-4">
                                <p className="text-xs font-semibold tracking-wide text-[var(--color-salida)] uppercase">
                                    Total en Caja
                                </p>
                                <p className="mt-1 text-xl font-bold text-[var(--color-salida)]">
                                    {formatClp(data.historico.saldo)}
                                </p>
                            </div>
                            <div className="rounded-lg border border-[rgba(65,114,157,0.2)] bg-[rgba(65,114,157,0.1)] p-4">
                                <p className="text-xs font-semibold tracking-wide text-[var(--color-hospital)] uppercase">
                                    Caja Hospitalario
                                </p>
                                <p className="mt-1 text-xl font-bold text-[var(--color-hospital)]">
                                    {formatClp(data.historico.hospitalaria)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Movimientos por Mes (solo anual) */}
                    {data.movimientosPorMes.length > 0 && (
                        <div className="cg-form-container">
                            <h2 className="text-cg-on-surface mb-4 border-b border-[rgba(70,70,88,0.2)] pb-3 text-lg font-bold">
                                Movimientos por Mes — {data.anoReporte}
                            </h2>
                            <div className="cg-table-container overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-[rgba(255,255,255,0.03)]">
                                        <tr>
                                            <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                                Mes
                                            </th>
                                            <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                                Ingresos
                                            </th>
                                            <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                                Egresos
                                            </th>
                                            <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                                Saldo
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.movimientosPorMes.map((m) => (
                                            <tr
                                                key={m.mes}
                                                className="border-b last:border-0 hover:bg-[rgba(255,255,255,0.04)]"
                                            >
                                                <td className="text-cg-on-surface px-4 py-2 font-medium">
                                                    {m.mes}
                                                </td>
                                                <td className="px-4 py-2 text-right text-[var(--color-entrada)]">
                                                    {formatClp(m.ingresos)}
                                                </td>
                                                <td className="text-cg-error px-4 py-2 text-right">
                                                    {formatClp(m.egresos)}
                                                </td>
                                                <td className="text-cg-on-surface px-4 py-2 text-right font-semibold">
                                                    {formatClp(m.saldo)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Top Motivos */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="cg-form-container">
                            <h3 className="text-cg-on-surface mb-3 text-base font-semibold">
                                Top Motivos — Ingresos
                            </h3>
                            <ul className="space-y-2">
                                {data.topIngresos.map((t) => (
                                    <li
                                        key={t.nombre}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-cg-on-surface">{t.nombre}</span>
                                        <span className="font-semibold text-[var(--color-entrada)]">
                                            {formatClp(t.total)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="cg-form-container">
                            <h3 className="text-cg-on-surface mb-3 text-base font-semibold">
                                Top Motivos — Egresos
                            </h3>
                            <ul className="space-y-2">
                                {data.topEgresos.map((t) => (
                                    <li
                                        key={t.nombre}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-cg-on-surface">{t.nombre}</span>
                                        <span className="text-cg-error font-semibold">
                                            {formatClp(t.total)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Estado de Cuotas */}
                    <div className="cg-form-container">
                        <h2 className="text-cg-on-surface mb-4 border-b border-[rgba(70,70,88,0.2)] pb-3 text-lg font-bold">
                            Estado de Cuotas — {data.anoReporte}
                        </h2>
                        <div className="cg-table-container overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-[rgba(255,255,255,0.03)]">
                                    <tr>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Miembro
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                            Cuota/mes
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Meses Pagados
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Meses Pendientes
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                            Deuda Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.estadoCuotas.map((u) => (
                                        <tr
                                            key={u.username}
                                            className={`border-b last:border-0 ${u.deudaTotal > 0 ? 'bg-[rgba(255,110,132,0.06)]' : ''}`}
                                        >
                                            <td className="text-cg-on-surface px-4 py-2 font-medium">
                                                {u.nombre}
                                            </td>
                                            <td className="text-cg-on-surface-variant px-4 py-2 text-right">
                                                {formatClp(u.cuotaMensual)}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-[var(--color-entrada)]">
                                                {u.mesesPagados.length > 0 ? (
                                                    u.mesesPagados.join(', ')
                                                ) : (
                                                    <span className="text-cg-outline italic">
                                                        Ninguno
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-cg-error px-4 py-2 text-xs">
                                                {u.mesesPendientes.length > 0 ? (
                                                    u.mesesPendientes.join(', ')
                                                ) : (
                                                    <span className="font-medium text-[var(--color-entrada)]">
                                                        ✓ Todos pagados
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-right font-semibold">
                                                {u.deudaTotal > 0 ? (
                                                    <span className="text-cg-error">
                                                        {formatClp(u.deudaTotal)}
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-entrada)]">
                                                        Sin deuda
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabla ingresos */}
                    <section>
                        <h3 className="text-cg-on-surface mb-2 font-semibold">
                            Ingresos del período ({data.entradas.length})
                        </h3>
                        <div className="cg-table-container overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-[rgba(255,255,255,0.03)]">
                                    <tr>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Fecha
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Miembro
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Motivo
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Período
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                            Monto
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.entradas.map((e) => (
                                        <tr
                                            key={e.id}
                                            className="border-b last:border-0 hover:bg-[rgba(255,255,255,0.04)]"
                                        >
                                            <td className="text-cg-outline px-4 py-2">
                                                {formatDate(e.fechaMov)}
                                            </td>
                                            <td className="text-cg-on-surface px-4 py-2">
                                                {e.user
                                                    ? `${e.user.name ?? ''} ${e.user.lastName ?? ''}`.trim()
                                                    : '—'}
                                            </td>
                                            <td className="text-cg-on-surface-variant px-4 py-2">
                                                {e.motivo?.nombre ?? '—'}
                                            </td>
                                            <td className="text-cg-outline px-4 py-2">
                                                {e.mes} {e.ano}
                                            </td>
                                            <td className="px-4 py-2 text-right font-semibold text-[var(--color-entrada)]">
                                                {formatClp(Number(e.monto ?? 0))}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.entradas.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-cg-outline px-4 py-8 text-center italic"
                                            >
                                                Sin ingresos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Tabla egresos */}
                    <section>
                        <h3 className="text-cg-on-surface mb-2 font-semibold">
                            Egresos del período ({data.salidas.length})
                        </h3>
                        <div className="cg-table-container overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-[rgba(255,255,255,0.03)]">
                                    <tr>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Fecha
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Registrado por
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Motivo
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-left font-medium">
                                            Período
                                        </th>
                                        <th className="text-cg-outline px-4 py-2 text-right font-medium">
                                            Monto
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.salidas.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="border-b last:border-0 hover:bg-[rgba(255,255,255,0.04)]"
                                        >
                                            <td className="text-cg-outline px-4 py-2">
                                                {formatDate(s.fechaMov)}
                                            </td>
                                            <td className="text-cg-on-surface px-4 py-2">
                                                {s.user
                                                    ? `${s.user.name ?? ''} ${s.user.lastName ?? ''}`.trim()
                                                    : '—'}
                                            </td>
                                            <td className="text-cg-on-surface-variant px-4 py-2">
                                                {s.motivo?.nombre ?? '—'}
                                            </td>
                                            <td className="text-cg-outline px-4 py-2">
                                                {s.mes} {s.ano}
                                            </td>
                                            <td className="text-cg-error px-4 py-2 text-right font-semibold">
                                                {formatClp(Number(s.monto ?? 0))}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.salidas.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-cg-outline px-4 py-8 text-center italic"
                                            >
                                                Sin egresos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

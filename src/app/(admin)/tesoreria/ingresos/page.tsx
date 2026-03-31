import { redirect } from 'next/navigation';

import { getEntradas, getMotivoEntradas, getResumenTesoreria } from '@/features/tesoreria/actions';
import { CreateEntradaModal } from '@/features/tesoreria/components/CreateEntradaModal';
import { MultiCuotaModal } from '@/features/tesoreria/components/MultiCuotaModal';
import { RecordatorioButton } from '@/features/tesoreria/components/RecordatorioButton';
import { TarifaCuotaModal } from '@/features/tesoreria/components/TarifaCuotaModal';
import { TesoreriaTable } from '@/features/tesoreria/components/TesoreriaTable';
import { getUsuarios } from '@/features/usuarios/actions';

import { CATEGORIA, OFICIALIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

function StatCard({
    label,
    value,
    colorClass,
}: {
    label: string;
    value: string;
    colorClass: string;
}) {
    return (
        <div className={`card-dashboard p-5 ${colorClass}`}>
            <p className="text-xs font-medium tracking-wide uppercase opacity-70">{label}</p>
            <p className="font-display mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}

function formatClp(val: number) {
    return val.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

export default async function IngresosPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const isTesorero =
        session.user.oficialidad === OFICIALIDAD.TESORERO ||
        session.user.categoryId === CATEGORIA.SUPER_ADMIN;
    if (!isTesorero) redirect('/dashboard');

    const [entradas, resumen, motivos, usuariosRaw] = await Promise.all([
        getEntradas(),
        getResumenTesoreria(),
        getMotivoEntradas(),
        getUsuarios(),
    ]);

    // Incluir tarifa para auto-fill en el formulario de cuotas
    const usuariosConTarifa = await prisma.user.findMany({
        where: { active: true },
        select: { id: true, tarifa: { select: { monto: true } } },
    });
    const tarifaMap = Object.fromEntries(
        usuariosConTarifa.map((u) => [u.id, Number(u.tarifa?.monto ?? 0)]),
    );

    const usuarios = usuariosRaw.map((u) => ({
        id: u.id,
        name: u.name,
        lastName: u.lastName,
        tarifaMonto: tarifaMap[u.id] ?? 0,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-cg-on-surface text-2xl font-bold">Tesorería — Ingresos</h1>
                    <p className="text-cg-on-surface-variant text-sm">
                        Registro de pagos y aportes de miembros.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <TarifaCuotaModal />
                    <MultiCuotaModal usuarios={usuarios} />
                    <RecordatorioButton />
                    <CreateEntradaModal usuarios={usuarios} motivos={motivos} />
                </div>
            </div>

            {/* Resumen — 4 tarjetas idénticas al PHP */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Entrada de Dinero"
                    value={formatClp(resumen.ingresos)}
                    colorClass="bg-[rgba(65,166,90,0.1)] text-[var(--color-entrada)] border-[rgba(65,166,90,0.2)]"
                />
                <StatCard
                    label="Total Salida de Dinero"
                    value={formatClp(resumen.egresos)}
                    colorClass="bg-[rgba(86,192,239,0.1)] text-[var(--color-salida)] border-[rgba(86,192,239,0.2)]"
                />
                <StatCard
                    label="Total en Caja"
                    value={formatClp(resumen.saldo)}
                    colorClass="bg-[rgba(242,156,19,0.1)] text-[var(--color-total)] border-[rgba(242,156,19,0.2)]"
                />
                <StatCard
                    label="Total en Caja Hospitalario"
                    value={formatClp(resumen.hospitalaria)}
                    colorClass="bg-[rgba(65,114,157,0.1)] text-[var(--color-hospital)] border-[rgba(65,114,157,0.2)]"
                />
            </div>

            <TesoreriaTable rows={entradas} tipo="ingreso" motivos={motivos} usuarios={usuarios} />
        </div>
    );
}

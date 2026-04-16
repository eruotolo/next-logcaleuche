import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { getMotivoSalidas, getResumenTesoreria, getSalidas } from '@/features/tesoreria/actions';
import { CreateSalidaModal } from '@/features/tesoreria/components/CreateSalidaModal';
import { TesoreriaTable } from '@/features/tesoreria/components/TesoreriaTable';

import { CATEGORIA, OFICIALIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Egresos — Logia Caleuche 250',
};

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
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}

function formatClp(val: number) {
    return val.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

export default async function EgresosPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const session = await auth();
    if (!session) redirect('/login');

    const isTesorero =
        session.user.oficialidad === OFICIALIDAD.TESORERO ||
        session.user.categoryId === CATEGORIA.SUPER_ADMIN;
    if (!isTesorero) redirect('/dashboard');

    const sp = await searchParams;

    const [salidasResult, resumen, motivos] = await Promise.all([
        getSalidas(sp),
        getResumenTesoreria(),
        getMotivoSalidas(),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-cg-on-surface text-2xl font-bold">Tesorería — Egresos</h1>
                    <p className="text-cg-on-surface-variant text-sm">
                        Registro de gastos y salidas de fondos.
                    </p>
                </div>
                <CreateSalidaModal motivos={motivos} />
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total Ingresos"
                    value={formatClp(resumen.ingresos)}
                    colorClass="bg-[rgba(65,166,90,0.1)] text-[var(--color-entrada)] border-[rgba(65,166,90,0.2)]"
                />
                <StatCard
                    label="Total Egresos"
                    value={formatClp(resumen.egresos)}
                    colorClass="bg-[rgba(86,192,239,0.1)] text-[var(--color-salida)] border-[rgba(86,192,239,0.2)]"
                />
                <StatCard
                    label="Saldo"
                    value={formatClp(resumen.saldo)}
                    colorClass="bg-[rgba(242,156,19,0.1)] text-[var(--color-total)] border-[rgba(242,156,19,0.2)]"
                />
            </div>

            <TesoreriaTable
                rows={salidasResult.items}
                tipo="egreso"
                motivos={motivos}
                total={salidasResult.total}
                page={salidasResult.page}
                totalPages={salidasResult.totalPages}
            />
        </div>
    );
}

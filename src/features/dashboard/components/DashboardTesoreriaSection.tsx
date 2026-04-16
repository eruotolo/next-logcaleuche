import { Banknote, TrendingUp, Users, Wallet } from 'lucide-react';

import { GlassPanel } from '@/shared/components/ui/glass-panel';
import { MOTIVO_ENTRADA, MOTIVO_SALIDA } from '@/shared/constants/domain';
import { prisma } from '@/shared/lib/db';
import { formatCLP } from '@/shared/lib/utils';

interface DashboardTesoreriaSectionProps {
    categoryId: number;
    oficialidad: number;
    activeUsersCount?: number;
}

export async function DashboardTesoreriaSection({
    categoryId,
    oficialidad,
    activeUsersCount,
}: DashboardTesoreriaSectionProps): Promise<React.ReactNode> {
    const isTesorero = oficialidad === 7 || categoryId <= 2;
    // Solo renderiza para admin o tesorero
    if (!isTesorero) return null;

    // Contar hermanos activos si no se pasó como prop
    const hermanos =
        activeUsersCount ??
        (await prisma.user.count({ where: { active: true } }));

    // Buscar usuario excluido (RUT especial configurado en env)
    const tesorero = process.env.RUT_EXCLUIDO
        ? await prisma.user.findUnique({
              where: { username: process.env.RUT_EXCLUIDO },
              select: { id: true },
          })
        : null;

    const whereEntrada = tesorero
        ? {
              NOT: [
                  { AND: [{ userId: tesorero.id }, { motivoId: MOTIVO_ENTRADA.CUOTA_MENSUAL }] },
                  { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA },
              ],
          }
        : { NOT: { motivoId: MOTIVO_ENTRADA.CAJA_HOSPITALARIA } };

    const [ingresos, egresos] = await Promise.all([
        prisma.entradaDinero.aggregate({
            _sum: { monto: true },
            where: whereEntrada,
        }),
        prisma.salidaDinero.aggregate({
            _sum: { monto: true },
            where: { NOT: { motivoId: MOTIVO_SALIDA.CAJA_HOSPITALARIA } },
        }),
    ]);

    const totalIngresos = Number(ingresos._sum.monto ?? 0);
    const totalEgresos = Number(egresos._sum.monto ?? 0);
    const balance = totalIngresos - totalEgresos;
    const currentYear = new Date().getFullYear();

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {/* Ingresos */}
            <GlassPanel className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-cg-on-surface-variant text-sm font-medium">Ingresos</p>
                        <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                            {formatCLP(totalIngresos)}
                        </p>
                    </div>
                    <div className="from-cg-tertiary/20 to-cg-tertiary/5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                        <Banknote className="text-cg-tertiary-tonal h-6 w-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="bg-cg-tertiary/10 text-cg-tertiary-tonal inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                        <TrendingUp className="h-3 w-3" />
                        Anual
                    </span>
                    <span className="text-cg-on-surface-variant text-xs">acumulado {currentYear}</span>
                </div>
            </GlassPanel>

            {/* Egresos */}
            <GlassPanel className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-cg-on-surface-variant text-sm font-medium">Egresos</p>
                        <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                            {formatCLP(totalEgresos)}
                        </p>
                    </div>
                    <div className="from-cg-error/20 to-cg-error/5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                        <Wallet className="text-cg-error h-6 w-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="bg-cg-error/10 text-cg-error inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                        <TrendingUp className="h-3 w-3" />
                        Anual
                    </span>
                    <span className="text-cg-on-surface-variant text-xs">acumulado {currentYear}</span>
                </div>
            </GlassPanel>

            {/* Balance */}
            <GlassPanel className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-cg-on-surface-variant text-sm font-medium">Balance</p>
                        <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                            {formatCLP(balance)}
                        </p>
                    </div>
                    <div className="from-cg-secondary/20 to-cg-secondary/5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                        <TrendingUp className="text-cg-secondary-tonal h-6 w-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="bg-cg-secondary/10 text-cg-secondary-tonal inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                        <TrendingUp className="h-3 w-3" />
                        Neto
                    </span>
                    <span className="text-cg-on-surface-variant text-xs">ingresos - egresos</span>
                </div>
            </GlassPanel>

            {/* Hermanos activos */}
            <GlassPanel className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-cg-on-surface-variant text-sm font-medium">Hermanos</p>
                        <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                            {hermanos}
                        </p>
                    </div>
                    <div className="from-cg-primary-tonal/20 to-cg-primary-tonal/5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                        <Users className="text-cg-primary-tonal h-6 w-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="bg-cg-primary-tonal/10 text-cg-primary-tonal inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                        <Users className="h-3 w-3" />
                        Activos
                    </span>
                    <span className="text-cg-on-surface-variant text-xs">miembros registrados</span>
                </div>
            </GlassPanel>
        </div>
    );
}

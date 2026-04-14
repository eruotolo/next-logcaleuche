'use client';

import Link from 'next/link';



import { Banknote, Rss, TrendingUp, Users, Wallet } from 'lucide-react';



import { BirthdayCard } from '@/shared/components/BirthdayCard';
import { FeedNewsList } from '@/shared/components/FeedNewsList';
import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';
import { GlassPanel } from '@/shared/components/ui/glass-panel';
import { GRADO_LABEL } from '@/shared/constants/domain';
import { formatCLP } from '@/shared/lib/utils';

import type { getDashboardData } from '@/features/dashboard/actions';

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;











































































































































































































interface DashboardContentProps {
    data: DashboardData;
    categoryId: number;
}


export function DashboardContent({ data, categoryId }: DashboardContentProps) {
    const { feedPosts, upcomingBirthdays, eventos, activeUsersCount, tesoreria } = data;
    const isAdmin = categoryId <= 2;

    return (
        <div className="space-y-8">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-cg-on-surface text-2xl font-bold tracking-tight">
                        Escritorio
                    </h1>
                    <p className="text-cg-on-surface-variant mt-1 text-sm">
                        Resumen general de la Logia
                    </p>
                </div>
                <nav className="hidden sm:block">
                    <ol className="text-cg-on-surface-variant flex items-center gap-1 text-sm">
                        <li>
                            <Link
                                href="/dashboard"
                                className="hover:text-cg-primary-tonal transition-colors"
                            >
                                Panel Administración
                            </Link>
                        </li>
                        <li className="text-cg-outline">/</li>
                        <li className="text-cg-on-surface font-medium">Escritorio</li>
                    </ol>
                </nav>
            </div>

            {/* ── Row 1: KPI Cards (solo admins) ──────────────── */}
            {isAdmin && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Ingresos */}
                    <GlassPanel className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-cg-on-surface-variant text-sm font-medium">
                                    Ingresos
                                </p>
                                <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                                    {formatCLP(tesoreria.totalIngresos)}
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
                            <span className="text-cg-on-surface-variant text-xs">
                                acumulado {new Date().getFullYear()}
                            </span>
                        </div>
                    </GlassPanel>

                    {/* Egresos */}
                    <GlassPanel className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-cg-on-surface-variant text-sm font-medium">
                                    Egresos
                                </p>
                                <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                                    {formatCLP(tesoreria.totalEgresos)}
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
                            <span className="text-cg-on-surface-variant text-xs">
                                acumulado {new Date().getFullYear()}
                            </span>
                        </div>
                    </GlassPanel>

                    {/* Balance */}
                    <GlassPanel className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-cg-on-surface-variant text-sm font-medium">
                                    Balance
                                </p>
                                <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                                    {formatCLP(tesoreria.balance)}
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
                            <span className="text-cg-on-surface-variant text-xs">
                                ingresos - egresos
                            </span>
                        </div>
                    </GlassPanel>

                    {/* Hermanos */}
                    <GlassPanel className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-cg-on-surface-variant text-sm font-medium">
                                    Hermanos
                                </p>
                                <p className="font-display text-cg-on-surface mt-2 text-2xl font-bold">
                                    {activeUsersCount}
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
                            <span className="text-cg-on-surface-variant text-xs">
                                miembros registrados
                            </span>
                        </div>
                    </GlassPanel>
                </div>
            )}

            {/* ── Row 2: Feed + Eventos + Cumpleaños ─────────── */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-7">
                {/* Feed de Actividad */}
                <div className="md:col-span-2 xl:col-span-3">
                    <GlassPanel className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Rss className="text-cg-primary-tonal h-4 w-4" />
                                <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                                    Feed de Noticias
                                </h2>
                            </div>
                        </div>
                        <div className="flex-1 divide-y divide-[rgba(255,255,255,0.05)] px-6">
                            <FeedNewsList posts={feedPosts} maxItems={5} titleMaxLength={80} />
                        </div>
                        <div className="px-6 pb-4">
                            <Link
                                href="/feed"
                                className="border-cg-primary-tonal/30 text-cg-primary-tonal hover:bg-cg-primary-tonal/10 block w-full rounded-lg border py-2 text-center text-xs font-bold transition-colors"
                            >
                                Ver todo
                            </Link>
                        </div>
                    </GlassPanel>
                </div>

                {/* Proximos Eventos */}
                <div className="xl:col-span-2 flex flex-col">
                    <UpcomingEventsList
                        className="h-full"
                        eventos={eventos.slice(0, 7).map((ev) => ({
                            id: ev.id,
                            nombre: ev.nombre,
                            tipoActividad: ev.tipoActividad ?? null,
                            fecha: ev.fecha ? new Date(ev.fecha) : null,
                            hora: ev.hora ?? null,
                            grado: ev.gradoId
                                ? {
                                      id: ev.gradoId as number,
                                      nombre: GRADO_LABEL[ev.gradoId as number] ?? '',
                                  }
                                : null,
                        }))}
                        maxItems={7}
                        showHora={true}
                        showGradoBadge={true}
                        showLink={true}
                        linkText="Ver todos"
                        emptyMessage="No hay eventos para este mes."
                    />
                </div>

                {/* Próximos Cumpleaños */}
                <div className="xl:col-span-2 flex flex-col">
                    <BirthdayCard birthdays={upcomingBirthdays} maxItems={9} className="h-full" />
                </div>
            </div>
        </div>
    );
}

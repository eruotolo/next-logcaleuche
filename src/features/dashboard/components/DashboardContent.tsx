'use client';

import Link from 'next/link';

import { Banknote, TrendingUp, Users, Wallet } from 'lucide-react';

import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';
import { formatCLP, formatDate, getMesNombre, truncate } from '@/shared/lib/utils';

interface TesoreriaData {
    totalIngresos: number;
    totalEgresos: number;
    balance: number;
    monthlyIngresos: { mes: number; total: number }[];
    monthlyEgresos: { mes: number; total: number }[];
}

interface DashboardContentProps {
    data: {
        feedPosts: any[];
        upcomingBirthdays: any[];
        eventos: any[];
        activeUsersCount: number;
        tesoreria: TesoreriaData;
    };
    categoryId: number;
}

/* ── Panel glass reutilizable ─────────────────────────────── */
function GlassPanel({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] ${className}`}
        >
            {children}
        </div>
    );
}

// Mapa de gradoId → etiqueta legible para los badges de eventos
const GRADO_LABEL: Record<number, string> = { 1: 'Aprendiz', 2: 'Compañero', 3: 'Maestro' };

export function DashboardContent({ data, categoryId }: DashboardContentProps) {
    const { feedPosts, eventos, activeUsersCount, tesoreria } = data;
    const isAdmin = categoryId <= 2;

    /* ── Helpers para mini-charts ──────────────────────────── */
    const monthlyBalance = tesoreria.monthlyIngresos.map((ing, i) => ({
        mes: ing.mes,
        total: ing.total - tesoreria.monthlyEgresos[i].total,
    }));

    function getBarHeights(values: { mes: number; total: number }[]) {
        const max = Math.max(...values.map((v) => Math.abs(v.total)), 1);
        return values.map((v) => ({
            ...v,
            height: Math.max((Math.abs(v.total) / max) * 100, 4),
        }));
    }

    const ingBars = getBarHeights(tesoreria.monthlyIngresos);
    const egBars = getBarHeights(tesoreria.monthlyEgresos);
    const balBars = getBarHeights(monthlyBalance);

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

            {/* ── Row 2: Feed + Eventos ───────────────────────── */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-10">
                {/* Feed de Actividad */}
                <div className="xl:col-span-6">
                    <GlassPanel>
                        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                            <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                                Feed de Actividad
                            </h2>
                            <Link
                                href="/feed"
                                className="text-cg-primary-tonal text-xs font-medium transition-colors hover:underline"
                            >
                                Ver todo
                            </Link>
                        </div>
                        <div className="divide-y divide-[rgba(255,255,255,0.05)] px-6">
                            {feedPosts.slice(0, 5).map((post) => (
                                <div key={post.id} className="flex items-start gap-4 py-4">
                                    <div className="bg-cg-surface-high text-cg-primary-tonal flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {post.user?.name?.[0] ?? 'U'}
                                        {post.user?.lastName?.[0] ?? ''}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-cg-on-surface text-sm font-semibold">
                                                {post.user?.name} {post.user?.lastName}
                                            </span>
                                            <span className="text-cg-outline text-xs">
                                                {formatDate(post.createdAt)}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/feed/${post.slug ?? post.id}`}
                                            className="text-cg-on-surface-variant hover:text-cg-primary-tonal mt-1 block text-sm transition-colors"
                                        >
                                            {truncate(post.titulo, 80)}
                                        </Link>
                                        {post.category && (
                                            <span className="bg-cg-surface-high text-cg-on-surface-variant mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium">
                                                {post.category.nombre}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {feedPosts.length === 0 && (
                                <div className="text-cg-outline py-12 text-center text-sm italic">
                                    No hay publicaciones disponibles.
                                </div>
                            )}
                        </div>
                    </GlassPanel>
                </div>

                {/* Proximos Eventos */}
                <div className="xl:col-span-4">
                    <UpcomingEventsList
                        eventos={eventos.slice(0, 6).map((ev) => ({
                            id: ev.id,
                            nombre: ev.nombre,
                            trabajo: ev.trabajo,
                            fecha: new Date(ev.fecha),
                            hora: ev.inicio
                                ? new Date(
                                      `1970-01-01T${ev.inicio.toISOString().split('T')[1]}`,
                                  ).toLocaleTimeString('es-CL', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : null,
                            grado: ev.gradoId
                                ? { id: ev.gradoId as number, nombre: GRADO_LABEL[ev.gradoId as number] ?? '' }
                                : null,
                        }))}
                        maxItems={6}
                        showHora={true}
                        showGradoBadge={true}
                        showLink={true}
                        linkText="Ver todos"
                        emptyMessage="No hay eventos para este mes."
                    />
                </div>
            </div>

            {/* ── Row 3: Resumen Tesoreria ────────────────────── */}
            <GlassPanel className="p-6">
                <div className="mb-6">
                    <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                        Resumen Tesorería
                    </h2>
                    <p className="text-cg-on-surface-variant mt-1 text-xs">
                        Últimos 6 meses de movimientos financieros
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Mini chart: Ingresos */}
                    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5">
                        <p className="text-cg-on-surface-variant text-xs font-medium tracking-wider uppercase">
                            Ingresos
                        </p>
                        <p className="font-display text-cg-tertiary-tonal mt-1 text-xl font-bold">
                            {formatCLP(tesoreria.totalIngresos)}
                        </p>
                        <div className="mt-4 flex items-end gap-1.5" style={{ height: 64 }}>
                            {ingBars.map((bar) => (
                                <div
                                    key={bar.mes}
                                    className="bg-cg-tertiary/40 flex-1 rounded-t transition-all"
                                    style={{ height: `${bar.height}%` }}
                                    title={`${getMesNombre(bar.mes)}: ${formatCLP(bar.total)}`}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex gap-1.5">
                            {ingBars.map((bar) => (
                                <span
                                    key={bar.mes}
                                    className="text-cg-outline flex-1 text-center text-[9px]"
                                >
                                    {getMesNombre(bar.mes).slice(0, 3)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Mini chart: Egresos */}
                    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5">
                        <p className="text-cg-on-surface-variant text-xs font-medium tracking-wider uppercase">
                            Egresos
                        </p>
                        <p className="font-display text-cg-secondary-tonal mt-1 text-xl font-bold">
                            {formatCLP(tesoreria.totalEgresos)}
                        </p>
                        <div className="mt-4 flex items-end gap-1.5" style={{ height: 64 }}>
                            {egBars.map((bar) => (
                                <div
                                    key={bar.mes}
                                    className="bg-cg-secondary/40 flex-1 rounded-t transition-all"
                                    style={{ height: `${bar.height}%` }}
                                    title={`${getMesNombre(bar.mes)}: ${formatCLP(bar.total)}`}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex gap-1.5">
                            {egBars.map((bar) => (
                                <span
                                    key={bar.mes}
                                    className="text-cg-outline flex-1 text-center text-[9px]"
                                >
                                    {getMesNombre(bar.mes).slice(0, 3)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Mini chart: Balance */}
                    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5">
                        <p className="text-cg-on-surface-variant text-xs font-medium tracking-wider uppercase">
                            Balance
                        </p>
                        <p className="font-display text-cg-primary-tonal mt-1 text-xl font-bold">
                            {formatCLP(tesoreria.balance)}
                        </p>
                        <div className="mt-4 flex items-end gap-1.5" style={{ height: 64 }}>
                            {balBars.map((bar) => (
                                <div
                                    key={bar.mes}
                                    className="bg-cg-primary/40 flex-1 rounded-t transition-all"
                                    style={{ height: `${bar.height}%` }}
                                    title={`${getMesNombre(bar.mes)}: ${formatCLP(bar.total)}`}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex gap-1.5">
                            {balBars.map((bar) => (
                                <span
                                    key={bar.mes}
                                    className="text-cg-outline flex-1 text-center text-[9px]"
                                >
                                    {getMesNombre(bar.mes).slice(0, 3)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}

import { Suspense } from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

import { DashboardBirthdaySection } from '@/features/dashboard/components/DashboardBirthdaySection';
import { DashboardEventsSection } from '@/features/dashboard/components/DashboardEventsSection';
import { DashboardFeedSection } from '@/features/dashboard/components/DashboardFeedSection';
import { DashboardTesoreriaSection } from '@/features/dashboard/components/DashboardTesoreriaSection';
import { BirthdaySkeleton } from '@/features/dashboard/components/skeletons/BirthdaySkeleton';
import { EventsSkeleton } from '@/features/dashboard/components/skeletons/EventsSkeleton';
import { FeedSkeleton } from '@/features/dashboard/components/skeletons/FeedSkeleton';
import { TesoreriaSkeleton } from '@/features/dashboard/components/skeletons/TesoreriaSkeleton';
import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Dashboard — Logia Caleuche 250',
};

export default async function DashboardPage(): Promise<React.ReactNode> {
    const session = await auth();
    // El layout (admin) ya redirige si no hay sesión — este null es solo fallback defensivo
    if (!session) return null;

    const { categoryId, grado, oficialidad } = session.user;

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

            {/* ── Row 1: KPI Tesorería (solo admin/tesorero) — stream independiente */}
            <Suspense fallback={<TesoreriaSkeleton />}>
                <DashboardTesoreriaSection
                    categoryId={categoryId}
                    oficialidad={oficialidad}
                />
            </Suspense>

            {/* ── Row 2: Feed + Eventos + Cumpleaños — 3 streams independientes */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-7">
                {/* Feed de Actividad — xl:col-span-3 */}
                <div className="md:col-span-2 xl:col-span-3">
                    <Suspense fallback={<FeedSkeleton />}>
                        <DashboardFeedSection />
                    </Suspense>
                </div>

                {/* Próximos Eventos — xl:col-span-2 */}
                <div className="flex flex-col xl:col-span-2">
                    <Suspense fallback={<EventsSkeleton />}>
                        <DashboardEventsSection grado={grado} />
                    </Suspense>
                </div>

                {/* Próximos Cumpleaños — xl:col-span-2 */}
                <div className="flex flex-col xl:col-span-2">
                    <Suspense fallback={<BirthdaySkeleton />}>
                        <DashboardBirthdaySection />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

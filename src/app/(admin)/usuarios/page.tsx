import { BookOpen, Compass, Sun, Users } from 'lucide-react';
import type { Metadata } from 'next';

import { getCategories, getGrados, getOficiales, getUsuarios } from '@/features/usuarios/actions';
import { CandidatesSubtitle } from '@/features/usuarios/components/CandidatesSubtitle';
import { CreateUserModal } from '@/features/usuarios/components/CreateUserModal';
import { UserList } from '@/features/usuarios/components/UserList';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export const metadata: Metadata = {
    title: 'Directorio de Miembros — Logia Caleuche 250',
};

export default async function UsuariosPage() {
    const session = await auth();
    const canRegister = session?.user?.categoryId && session.user.categoryId <= 2;
    const isMaestro = session?.user?.grado === 3;
    const isSuperAdmin = session?.user?.categoryId === 1;

    const today = new Date();
    const twentyTwoMonthsAgo = new Date(today);
    twentyTwoMonthsAgo.setMonth(twentyTwoMonthsAgo.getMonth() - 22);

    const [
        usuarios,
        totalActivos,
        aprendices,
        companeros,
        maestros,
        candidatosAprendiz,
        candidatosCompanero,
        grados,
        categories,
        oficiales,
    ] = await Promise.all([
        getUsuarios(200, isSuperAdmin),
        prisma.user.count({ where: { active: true } }),
        prisma.user.count({ where: { active: true, gradoId: 1 } }),
        prisma.user.count({ where: { active: true, gradoId: 2 } }),
        prisma.user.count({ where: { active: true, gradoId: 3 } }),
        isMaestro
            ? prisma.user.findMany({
                  where: { active: true, gradoId: 1, dateInitiation: { lte: twentyTwoMonthsAgo } },
                  select: { name: true, lastName: true },
              })
            : Promise.resolve([]),
        isMaestro
            ? prisma.user.findMany({
                  where: { active: true, gradoId: 2, dateSalary: { lte: twentyTwoMonthsAgo } },
                  select: { name: true, lastName: true },
              })
            : Promise.resolve([]),
        canRegister ? getGrados() : Promise.resolve([]),
        canRegister ? getCategories() : Promise.resolve([]),
        canRegister ? getOficiales() : Promise.resolve([]),
    ]);

    const statCards = [
        {
            label: 'Total Hermanos',
            value: totalActivos,
            subtitle: '+2 este mes',
            icon: Users,
            iconBg: 'bg-cg-primary-tonal/10',
            iconColor: 'text-cg-primary-tonal',
            subtitleColor: 'text-cg-secondary-tonal',
        },
        {
            label: 'Aprendices',
            value: aprendices,
            subtitle: 'Grado 1',
            icon: Compass,
            iconBg: 'bg-slate-500/10',
            iconColor: 'text-slate-400',
            subtitleColor:
                candidatosAprendiz.length > 0 ? 'text-cg-secondary-tonal' : 'text-cg-outline',
            candidates: candidatosAprendiz,
        },
        {
            label: 'Compañeros',
            value: companeros,
            subtitle: 'Grado 2',
            icon: BookOpen,
            iconBg: 'bg-cg-secondary-tonal/10',
            iconColor: 'text-cg-secondary-tonal',
            subtitleColor:
                candidatosCompanero.length > 0 ? 'text-cg-secondary-tonal' : 'text-cg-outline',
            candidates: candidatosCompanero,
        },
        {
            label: 'Maestros',
            value: maestros,
            subtitle: 'Cámara del medio',
            icon: Sun,
            iconBg: 'bg-cg-tertiary-tonal/10',
            iconColor: 'text-cg-tertiary-tonal',
            subtitleColor: 'text-cg-tertiary-tonal',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                    <div className="text-cg-primary-tonal rounded-lg bg-[rgba(90,103,216,0.15)] p-2">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-cg-on-surface text-2xl font-bold tracking-tight">
                            Directorio de Miembros
                        </h1>
                        <p className="text-cg-on-surface-variant text-sm">
                            Gestión de integrantes de la Logia Caleuche 250.
                        </p>
                    </div>
                </div>

                {canRegister && <CreateUserModal grados={grados} categories={categories} />}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[20px]"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-cg-outline text-xs font-medium tracking-wider uppercase">
                                    {card.label}
                                </p>
                                <p className="text-cg-on-surface mt-1 text-3xl font-bold">
                                    {card.value}
                                </p>
                            </div>
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                            >
                                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                            </div>
                        </div>
                        {card.candidates && card.candidates.length > 0 ? (
                            <CandidatesSubtitle
                                candidates={card.candidates}
                                subtitleColor={card.subtitleColor}
                            />
                        ) : (
                            <p className={`mt-3 text-[10px] ${card.subtitleColor}`}>
                                {card.subtitle}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <UserList
                usuarios={usuarios}
                currentUserCategory={session?.user?.categoryId ?? 3}
                categoryId={session?.user?.categoryId ?? 3}
                grados={grados}
                oficiales={oficiales}
                categories={categories}
            />
        </div>
    );
}

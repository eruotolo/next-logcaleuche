import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { getAsistenciaEvento, getEventosCalendario, getGrados, getTiposActividad } from '@/features/eventos/actions';
import { EventoCalendar } from '@/features/eventos/components/EventoCalendar';
import { EventosAdminToolbar } from '@/features/eventos/components/EventosAdminToolbar';

import { auth } from '@/shared/lib/auth';

export const metadata: Metadata = {
    title: 'Eventos — Logia Caleuche 250',
};

export default async function EventosPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado ?? 1;
    const isAdmin = session.user.categoryId <= 2;

    const [eventos, grados, tiposActividad] = await Promise.all([
        getEventosCalendario(grado),
        isAdmin ? getGrados() : Promise.resolve([]),
        isAdmin ? getTiposActividad() : Promise.resolve([]),
    ]);

    const todayUTC = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const nextEventId = eventos
        .filter((e) => e.fecha && new Date(e.fecha).getTime() >= todayUTC)
        .sort((a, b) => new Date(a.fecha ?? 0).getTime() - new Date(b.fecha ?? 0).getTime())[0]?.id;

    const nextEventAsistencia = nextEventId ? await getAsistenciaEvento(nextEventId) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-display text-cg-on-surface text-4xl font-bold tracking-tight">
                        Calendario
                    </h1>
                    <p className="text-cg-on-surface-variant mt-1 text-sm">
                        Eventos y tenidas de la logia.
                    </p>
                </div>
                {isAdmin && <EventosAdminToolbar grados={grados} tiposActividad={tiposActividad} />}
            </div>

            <EventoCalendar eventos={eventos} isAdmin={isAdmin} grados={grados} tiposActividad={tiposActividad} nextEventAsistencia={nextEventAsistencia} />
        </div>
    );
}

import { redirect } from 'next/navigation';

import { getEventosCalendario, getGrados } from '@/features/eventos/actions';
import { EventoCalendar } from '@/features/eventos/components/EventoCalendar';
import { EventosAdminToolbar } from '@/features/eventos/components/EventosAdminToolbar';

import { auth } from '@/shared/lib/auth';

export default async function EventosPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const grado = session.user.grado ?? 1;
    const isAdmin = session.user.categoryId <= 2;

    const [eventos, grados] = await Promise.all([
        getEventosCalendario(grado),
        isAdmin ? getGrados() : Promise.resolve([]),
    ]);

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
                {isAdmin && <EventosAdminToolbar grados={grados} />}
            </div>

            <EventoCalendar eventos={eventos} isAdmin={isAdmin} grados={grados} />
        </div>
    );
}

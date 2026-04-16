import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';
import { GRADO_LABEL } from '@/shared/constants/domain';
import { prisma } from '@/shared/lib/db';

interface DashboardEventsSectionProps {
    grado: number;
}

export async function DashboardEventsSection({ grado }: DashboardEventsSectionProps): Promise<React.ReactNode> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Maestro (3) ve todo, Compañero (2) ve grados 1-2, Aprendiz (1) solo grado 1
    const eventGradoFilter =
        grado === 1
            ? { gradoId: 1 }
            : grado === 2
              ? { gradoId: { in: [1, 2] } }
              : {};

    const eventos = await prisma.evento.findMany({
        where: {
            active: 1,
            fecha: { gte: startOfToday },
            ...eventGradoFilter,
        },
        include: { grado: true, tipoActividad: true },
        orderBy: { fecha: 'asc' },
        take: 7,
    });

    const mapped = eventos.slice(0, 7).map((ev) => ({
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
    }));

    return (
        <UpcomingEventsList
            className="h-full"
            eventos={mapped}
            maxItems={7}
            showHora={true}
            showGradoBadge={true}
            showLink={true}
            linkText="Ver todos"
            emptyMessage="No hay eventos para este mes."
        />
    );
}

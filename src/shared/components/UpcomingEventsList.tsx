'use client';

import Link from 'next/link';

import { Calendar, Trash } from 'lucide-react';

import { getMesNombre } from '@/shared/lib/utils';

export type UpcomingEventItem = {
    id: number;
    nombre: string;
    trabajo?: string | null;
    fecha: Date | null;
    hora?: string | null;
    grado?: { id: number; nombre: string } | null;
};

interface UpcomingEventsListProps {
    eventos: UpcomingEventItem[];
    maxItems?: number;
    showTrabajo?: boolean;
    showHora?: boolean;
    showGradoBadge?: boolean;
    showLink?: boolean;
    linkText?: string;
    linkHref?: string;
    title?: string;
    emptyMessage?: string;
    className?: string;
    onEventClick?: (evento: UpcomingEventItem) => void;
    onEventDelete?: (id: number, nombre: string) => void;
}

// Colores por gradoId (1=Aprendiz, 2=Compañero, 3=Maestro)
const categoryColors: Record<number, { bg: string; text: string }> = {
    1: { bg: 'bg-cg-primary-tonal/20', text: 'text-cg-primary-tonal' },
    2: { bg: 'bg-cg-secondary-tonal/20', text: 'text-cg-secondary-tonal' },
    3: { bg: 'bg-cg-tertiary-tonal/20', text: 'text-cg-tertiary-tonal' },
};

function getGradoColor(id: number) {
    return categoryColors[id] ?? { bg: 'bg-[rgba(255,255,255,0.08)]', text: 'text-cg-on-surface-variant' };
}

export function UpcomingEventsList({
    eventos,
    maxItems = 6,
    showTrabajo = true,
    showHora = false,
    showGradoBadge = true,
    showLink = true,
    linkText = 'Ver todos',
    linkHref = '/eventos',
    title = 'Próximos Eventos',
    emptyMessage = 'No hay eventos próximos.',
    className = '',
    onEventClick,
    onEventDelete,
}: UpcomingEventsListProps) {
    const visibleEventos = eventos.slice(0, maxItems);

    return (
        <div className={`flex flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                <div className="flex items-center gap-2">
                    <Calendar className="text-cg-secondary-tonal h-4 w-4" />
                    <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                        {title}
                    </h2>
                </div>
            </div>

            <div className="flex-1 space-y-4 px-6 py-4">
                {visibleEventos.length === 0 && (
                    <p className="text-cg-outline py-8 text-center text-sm italic">
                        {emptyMessage}
                    </p>
                )}

                {visibleEventos.map((ev) => {
                    // Usar métodos UTC para evitar desfase horario (Chile UTC-3/4)
                    // Las fechas vienen como UTC midnight desde Prisma @db.Date
                    const fecha = ev.fecha ? new Date(ev.fecha) : null;
                    const dia = fecha?.getUTCDate() ?? '—';
                    const mesAbr = fecha
                        ? getMesNombre(fecha.getUTCMonth() + 1).slice(0, 3).toUpperCase()
                        : '';

                    const gradoColor = ev.grado ? getGradoColor(ev.grado.id) : null;
                    const isClickable = !!onEventClick;

                    const dateBlock = (
                        <div className="border-cg-primary-tonal/20 flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border bg-[rgba(255,255,255,0.05)]">
                            <span className="text-cg-primary-tonal text-xs font-bold">{mesAbr}</span>
                            <span className="text-cg-on-surface text-lg font-black">{dia}</span>
                        </div>
                    );

                    const infoBlock = (
                        <div className="min-w-0 flex-1">
                            <h4 className="text-cg-on-surface truncate text-sm font-bold">
                                {ev.nombre}
                            </h4>
                            {showTrabajo && ev.trabajo && (
                                <p className="text-cg-outline truncate text-xs">{ev.trabajo}</p>
                            )}
                            {showGradoBadge && ev.grado && gradoColor && (
                                <span
                                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${gradoColor.bg} ${gradoColor.text}`}
                                >
                                    {ev.grado.nombre}
                                </span>
                            )}
                            {showHora && ev.hora && (
                                <p className="text-cg-outline mt-1 flex items-center gap-1 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {ev.hora}
                                </p>
                            )}
                        </div>
                    );

                    return (
                        <div key={ev.id} className="flex items-start gap-4">
                            {isClickable ? (
                                <button
                                    type="button"
                                    onClick={() => onEventClick(ev)}
                                    className="flex min-w-0 flex-1 cursor-pointer items-start gap-4 text-left transition-opacity hover:opacity-80"
                                >
                                    {dateBlock}
                                    {infoBlock}
                                </button>
                            ) : (
                                <div className="flex min-w-0 flex-1 items-start gap-4">
                                    {dateBlock}
                                    {infoBlock}
                                </div>
                            )}

                            {onEventDelete && (
                                <button
                                    type="button"
                                    onClick={() => onEventDelete(ev.id, ev.nombre)}
                                    className="text-cg-outline hover:text-cg-error shrink-0 rounded-lg p-1.5 transition-colors hover:bg-[rgba(255,100,132,0.1)]"
                                    title="Cancelar evento"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {showLink && (
                <div className="px-6 pb-4">
                    <Link
                        href={linkHref}
                        className="border-cg-primary-tonal/30 text-cg-primary-tonal hover:bg-cg-primary-tonal/10 block w-full rounded-lg border py-2 text-center text-xs font-bold transition-colors"
                    >
                        {linkText}
                    </Link>
                </div>
            )}
        </div>
    );
}

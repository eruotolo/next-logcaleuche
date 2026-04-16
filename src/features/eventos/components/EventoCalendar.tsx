'use client';

import { useState } from 'react';

import { CheckCircle, ChevronLeft, ChevronRight, HelpCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';

import { deleteEvento, type AsistenciaItem } from '../actions';
import { EventoDetailModal } from './EventoDetailModal';

type EventoItem = {
    id: number;
    nombre: string;
    tipoActividad: { id: number; nombre: string } | null;
    autor: string | null;
    fecha: Date | null;
    hora: string | null;
    lugar: string | null;
    grado: { id: number; nombre: string } | null;
};

interface EventoCalendarProps {
    eventos: EventoItem[];
    isAdmin: boolean;
    grados?: { id: number; nombre: string }[];
    tiposActividad?: { id: number; nombre: string }[];
    nextEventAsistencia?: AsistenciaItem[];
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

const categoryColors: Record<number, { bg: string; text: string; border: string }> = {
    1: {
        bg: 'bg-cg-primary-tonal/20',
        text: 'text-cg-primary-tonal',
        border: 'border-cg-primary-tonal/30',
    },
    2: {
        bg: 'bg-cg-secondary-tonal/20',
        text: 'text-cg-secondary-tonal',
        border: 'border-cg-secondary-tonal/30',
    },
    3: {
        bg: 'bg-cg-tertiary-tonal/20',
        text: 'text-cg-tertiary-tonal',
        border: 'border-cg-tertiary-tonal/30',
    },
};

const RSVP_CONFIG = [
    {
        estado: 'confirmado',
        label: 'Asisten',
        Icon: CheckCircle,
        color: 'text-[#41a65a]',
        bg: 'bg-[#41a65a]/10',
        border: 'border-[#41a65a]/20',
    },
    {
        estado: 'tentativo',
        label: 'Asisten Sin Ágape',
        Icon: HelpCircle,
        color: 'text-[#f29c13]',
        bg: 'bg-[#f29c13]/10',
        border: 'border-[#f29c13]/20',
    },
    {
        estado: 'no_asiste',
        label: 'No Asisten',
        Icon: XCircle,
        color: 'text-[#ff6e84]',
        bg: 'bg-[#ff6e84]/10',
        border: 'border-[#ff6e84]/20',
    },
] as const;

function NextEventRsvpCounts({ asistencias }: { asistencias: AsistenciaItem[] }) {
    if (asistencias.length === 0) return null;

    const grouped: Record<string, AsistenciaItem[]> = {
        confirmado: asistencias.filter((a) => a.estado === 'confirmado'),
        tentativo: asistencias.filter((a) => a.estado === 'tentativo'),
        no_asiste: asistencias.filter((a) => a.estado === 'no_asiste'),
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {RSVP_CONFIG.map(({ estado, label, Icon, color, bg, border }) => {
                const items = grouped[estado] ?? [];
                const tooltipContent = (
                    <div className="min-w-[120px] space-y-1">
                        <p className="text-cg-outline mb-1 text-[10px] font-bold tracking-widest uppercase">
                            {label}
                        </p>
                        {items.length === 0 ? (
                            <p className="text-cg-outline italic">Sin registros</p>
                        ) : (
                            items.map((a) => (
                                <p key={a.userId} className="text-cg-on-surface-variant">
                                    {[a.user.name, a.user.lastName].filter(Boolean).join(' ')}
                                </p>
                            ))
                        )}
                    </div>
                );
                return (
                    <Tooltip key={estado} content={tooltipContent} side="bottom" delayDuration={100}>
                        <span
                            className={`inline-flex cursor-default items-center gap-1 rounded-full border ${border} ${bg} px-2 py-0.5 text-[10px] font-semibold ${color}`}
                        >
                            <Icon className="h-3 w-3" />
                            {items.length}
                        </span>
                    </Tooltip>
                );
            })}
        </div>
    );
}

function getMonthDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0, Sunday = 6
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days: { day: number; currentMonth: boolean; date: Date }[] = [];

    // Previous month days
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
        days.push({
            day: prevLastDay - i,
            currentMonth: false,
            date: new Date(year, month - 1, prevLastDay - i),
        });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push({ day: d, currentMonth: true, date: new Date(year, month, d) });
    }

    // Fill remaining to complete weeks
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
        for (let d = 1; d <= remaining; d++) {
            days.push({
                day: d,
                currentMonth: false,
                date: new Date(year, month + 1, d),
            });
        }
    }

    return days;
}

// Fechas del servidor vienen como UTC midnight desde @db.Date de Prisma.
// Comparamos con métodos UTC para evitar desfase por zona horaria (Chile UTC-3/4).
function isSameDay(dbDate: Date, localDate: Date) {
    return (
        dbDate.getUTCFullYear() === localDate.getFullYear() &&
        dbDate.getUTCMonth() === localDate.getMonth() &&
        dbDate.getUTCDate() === localDate.getDate()
    );
}

export function EventoCalendar({ eventos, isAdmin, grados = [], tiposActividad = [], nextEventAsistencia = [] }: EventoCalendarProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedEvento, setSelectedEvento] = useState<EventoItem | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; nombre: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const days = getMonthDays(currentYear, currentMonth);

    function prevMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    }

    function goToday() {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    }

    function getEventsForDay(date: Date) {
        return eventos.filter((e) => e.fecha && isSameDay(new Date(e.fecha), date));
    }

    // Umbral: hoy en UTC para comparar contra fechas del servidor (UTC midnight)
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const upcomingEvents = eventos
        .filter((e) => e.fecha && new Date(e.fecha).getTime() >= todayUTC)
        .sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime())
        .slice(0, 5);

    const nextEvent = upcomingEvents[0];

    function handleDelete(id: number, nombre: string) {
        setConfirmDelete({ id, nombre });
    }

    async function handleDeleteConfirm() {
        if (!confirmDelete) return;
        setIsDeleting(true);
        const res = await deleteEvento(confirmDelete.id);
        setIsDeleting(false);
        if (res.success) toast.success('Evento cancelado');
        else toast.error(typeof res.error === 'string' ? res.error : 'Error al cancelar');
    }

    const getColor = (catId: number | undefined) =>
        categoryColors[catId ?? 0] ?? {
            bg: 'bg-[rgba(255,255,255,0.08)]',
            text: 'text-cg-on-surface-variant',
            border: 'border-[rgba(255,255,255,0.1)]',
        };

    return (
        <>
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-10">
                {/* Left: Calendar Grid (70%) */}
                <section className="space-y-6 xl:col-span-7">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-cg-surface-high flex items-center gap-1 rounded-xl border border-[rgba(255,255,255,0.05)] p-1">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="text-cg-on-surface-variant rounded-lg p-2 transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="text-cg-on-surface min-w-[140px] px-4 text-center text-sm font-bold">
                                    {MONTHS[currentMonth]} {currentYear}
                                </span>
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="text-cg-on-surface-variant rounded-lg p-2 transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={goToday}
                                className="text-cg-on-surface-variant rounded-xl border border-[rgba(255,255,255,0.1)] px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                            >
                                Hoy
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[20px]">
                        {/* Day Headers */}
                        <div className="mb-2 grid grid-cols-7 border-b border-[rgba(255,255,255,0.05)] pb-4">
                            {DAYS.map((day) => (
                                <div
                                    key={day}
                                    className="text-cg-outline text-center text-[10px] font-bold tracking-widest uppercase"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                        {/* Day Cells */}
                        <div className="grid grid-cols-7" style={{ gridAutoRows: '120px' }}>
                            {days.map((d, i) => {
                                const dayEvents = getEventsForDay(d.date);
                                const isToday = d.currentMonth && isSameDay(d.date, today);
                                const hasEvents = dayEvents.length > 0;

                                return (
                                    <div
                                        key={`${d.date.toISOString()}-${i}`}
                                        className={`p-3 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                                            i >= 7 ? 'border-t border-[rgba(255,255,255,0.05)]' : ''
                                        } ${
                                            i % 7 !== 0
                                                ? 'border-l border-[rgba(255,255,255,0.05)]'
                                                : ''
                                        } ${
                                            isToday
                                                ? 'bg-cg-primary-tonal/5 ring-cg-primary-tonal/30 ring-1 ring-inset'
                                                : ''
                                        } ${!d.currentMonth ? 'opacity-20' : ''}`}
                                    >
                                        <span
                                            className={`text-xs font-medium ${isToday ? 'text-cg-on-surface font-bold' : 'text-cg-outline'}`}
                                        >
                                            {d.day}
                                        </span>
                                        {hasEvents && (
                                            <div className="mt-2 space-y-1">
                                                {dayEvents.slice(0, 2).map((ev) => {
                                                    const color = getColor(ev.grado?.id);
                                                    return (
                                                        <button
                                                            key={ev.id}
                                                            type="button"
                                                            onClick={() => setSelectedEvento(ev)}
                                                            className={`w-full truncate rounded-full ${color.bg} border ${color.border} px-2 py-0.5 text-left text-[9px] ${color.text} cursor-pointer transition-opacity hover:opacity-80`}
                                                        >
                                                            {ev.nombre}
                                                        </button>
                                                    );
                                                })}
                                                {dayEvents.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedEvento(dayEvents[2])
                                                        }
                                                        className="text-cg-outline w-full cursor-pointer truncate rounded-full bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-left text-[9px] transition-opacity hover:opacity-80"
                                                    >
                                                        +{dayEvents.length - 2} más
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Right: Event Details Sidebar (30%) */}
                <aside className="space-y-6 xl:col-span-3">
                    {/* Next Event Featured Card */}
                    {nextEvent && (
                        <button
                            type="button"
                            onClick={() => setSelectedEvento(nextEvent)}
                            className="relative w-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 text-left backdrop-blur-[20px] transition-opacity hover:opacity-90"
                        >
                            <div className="bg-cg-tertiary/20 absolute -top-12 -right-12 h-32 w-32 rounded-full blur-[50px]" />
                            <div className="relative z-10 space-y-4">
                                <span className="border-cg-tertiary-tonal/20 bg-cg-tertiary-tonal/20 text-cg-tertiary-tonal inline-block rounded-lg border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                                    Próximo Evento
                                </span>
                                <h3 className="font-display text-cg-on-surface text-xl font-bold">
                                    {nextEvent.nombre}
                                </h3>
                                {nextEvent.tipoActividad && (
                                    <p className="text-cg-on-surface-variant text-sm">
                                        {nextEvent.tipoActividad.nombre}
                                    </p>
                                )}
                                {nextEvent.autor && (
                                    <p className="text-cg-outline text-xs">{nextEvent.autor}</p>
                                )}
                                {nextEvent.grado && (
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold ${getColor(nextEvent.grado.id).bg} ${getColor(nextEvent.grado.id).text}`}
                                    >
                                        {nextEvent.grado.nombre}
                                    </span>
                                )}
                                <NextEventRsvpCounts asistencias={nextEventAsistencia} />
                            </div>
                        </button>
                    )}

                    {/* Upcoming Events List */}
                    <UpcomingEventsList
                        eventos={upcomingEvents}
                        maxItems={5}
                        showLink={false}
                        onEventClick={(ev) => setSelectedEvento(ev as EventoItem)}
                        onEventDelete={isAdmin ? (id, nombre) => handleDelete(id, nombre) : undefined}
                    />
                </aside>
            </div>

            <EventoDetailModal
                evento={selectedEvento}
                isOpen={selectedEvento !== null}
                onClose={() => setSelectedEvento(null)}
                isAdmin={isAdmin}
                grados={grados}
                tiposActividad={tiposActividad}
            />

            <ConfirmDialog
                open={confirmDelete !== null}
                onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}
                title="Cancelar evento"
                description={`¿Cancelar el evento "${confirmDelete?.nombre}"?`}
                confirmLabel="Sí, cancelar"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                isPending={isDeleting}
            />
        </>
    );
}

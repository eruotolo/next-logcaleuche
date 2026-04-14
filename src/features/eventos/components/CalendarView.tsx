'use client';

import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';

interface CalendarEvento {
    id: number;
    nombre: string | null;
    tipoActividad: { id: number; nombre: string } | null;
    fecha: Date | null;
    inicio: Date | null;
    fin: Date | null;
    category: { id: number; nombre: string } | null;
}

const CATEGORY_COLORS: Record<number, string> = {
    1: '#2980b9', // Tenida 1° — azul primario
    2: '#41a65a', // Tenida 2° — verde
    3: '#f29c13', // Tenida 3° — naranja
};

function getColor(categoryId: number | null) {
    return categoryId ? (CATEGORY_COLORS[categoryId] ?? '#6c757d') : '#6c757d';
}

function formatTime(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

interface CalendarViewProps {
    eventos: CalendarEvento[];
}

export function CalendarView({ eventos }: CalendarViewProps) {
    const events = eventos.map((e) => ({
        id: String(e.id),
        title: e.nombre ?? '(Sin título)',
        date: e.fecha ? new Date(e.fecha).toISOString().split('T')[0] : '',
        backgroundColor: getColor(e.category?.id ?? null),
        borderColor: getColor(e.category?.id ?? null),
        extendedProps: {
            tipoActividad: e.tipoActividad?.nombre ?? null,
            horario:
                e.inicio && e.fin
                    ? `${formatTime(e.inicio)} - ${formatTime(e.fin)}`
                    : e.inicio
                      ? formatTime(e.inicio)
                      : '',
            categoria: e.category?.nombre ?? '—',
        },
    }));

    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <FullCalendar
                plugins={[dayGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listMonth',
                }}
                events={events}
                height="auto"
                eventClick={(info) => {
                    const p = info.event.extendedProps;
                    alert(
                        `${info.event.title}\n\nTipo: ${p.tipoActividad ?? '—'}\nCategoría: ${p.categoria}\nHorario: ${p.horario || '—'}`,
                    );
                }}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    list: 'Lista',
                }}
            />
        </div>
    );
}

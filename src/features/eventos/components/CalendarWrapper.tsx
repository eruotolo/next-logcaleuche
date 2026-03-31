'use client';

import dynamic from 'next/dynamic';

const CalendarView = dynamic(() => import('./CalendarView').then((m) => m.CalendarView), {
    ssr: false,
    loading: () => (
        <div className="flex h-96 items-center justify-center rounded-xl border bg-white shadow-sm">
            <p className="text-gray-400">Cargando calendario…</p>
        </div>
    ),
});

interface CalendarEvento {
    id: number;
    nombre: string | null;
    trabajo: string | null;
    fecha: Date | null;
    inicio: Date | null;
    fin: Date | null;
    category: { id: number; nombre: string } | null;
}

export function CalendarWrapper({ eventos }: { eventos: CalendarEvento[] }) {
    return <CalendarView eventos={eventos} />;
}

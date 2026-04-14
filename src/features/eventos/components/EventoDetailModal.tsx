'use client';

import { useActionState, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';
import type { ActionResult } from '@/shared/types/actions';

import { updateEvento } from '../actions';

type Evento = {
    id: number;
    nombre: string;
    tipoActividad: { id: number; nombre: string } | null;
    autor: string | null;
    fecha: Date | null;
    hora: string | null;
    lugar: string | null;
    grado: { id: number; nombre: string } | null;
};

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

const categoryColors: Record<number, { bg: string; text: string }> = {
    1: { bg: 'bg-cg-primary-tonal/20', text: 'text-cg-primary-tonal' },
    2: { bg: 'bg-cg-secondary-tonal/20', text: 'text-cg-secondary-tonal' },
    3: { bg: 'bg-cg-tertiary-tonal/20', text: 'text-cg-tertiary-tonal' },
};

function EditForm({
    evento,
    grados,
    tiposActividad,
    onSuccess,
}: {
    evento: Evento;
    grados: { id: number; nombre: string }[];
    tiposActividad: { id: number; nombre: string }[];
    onSuccess: () => void;
}) {
    const router = useRouter();
    const updateEventoWithId = updateEvento.bind(null, evento.id);
    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        updateEventoWithId,
        null,
    );

    useEffect(() => {
        if (state?.success) {
            toast.success('Evento actualizado correctamente');
            router.refresh();
            onSuccess();
        } else if (state && !state.success) {
            toast.error(typeof state.error === 'string' ? state.error : 'Error al actualizar');
        }
    }, [state, router, onSuccess]);

    const fechaStr = evento.fecha ? new Date(evento.fecha).toISOString().slice(0, 10) : '';

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-1">
                <label className="form-label">Nombre del Evento *</label>
                <Input name="nombre" defaultValue={evento.nombre} required />
            </div>
            <div className="space-y-1">
                <label className="form-label">Tipo de Actividad *</label>
                <select
                    name="tipoActividadId"
                    required
                    className="form-select"
                    defaultValue={evento.tipoActividad?.id}
                >
                    <option value="">Seleccionar…</option>
                    {tiposActividad.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-1">
                <label className="form-label">Autor / Responsable</label>
                <Input name="autor" defaultValue={evento.autor ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="form-label">Fecha *</label>
                    <Input name="fecha" type="date" defaultValue={fechaStr} required />
                </div>
                <div className="space-y-1">
                    <label className="form-label">Hora</label>
                    <Input name="hora" type="time" defaultValue={evento.hora ?? ''} />
                </div>
            </div>
            <div className="space-y-1">
                <label className="form-label">Lugar</label>
                <Input
                    name="lugar"
                    defaultValue={evento.lugar ?? ''}
                    placeholder="Casa Masónica de Castro"
                />
            </div>
            <div className="space-y-1">
                <label className="form-label">Grado *</label>
                <select
                    name="grado"
                    required
                    className="form-select"
                    defaultValue={evento.grado?.id}
                >
                    <option value="">Seleccionar…</option>
                    {grados.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Guardando…' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    );
}

interface EventoDetailModalProps {
    evento: Evento | null;
    isOpen: boolean;
    onClose: () => void;
    isAdmin: boolean;
    grados: { id: number; nombre: string }[];
    tiposActividad?: { id: number; nombre: string }[];
}

export function EventoDetailModal({
    evento,
    isOpen,
    onClose,
    isAdmin,
    grados,
    tiposActividad = [],
}: EventoDetailModalProps) {
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!isOpen) setEditing(false);
    }, [isOpen]);

    if (!evento) return null;

    const fecha = evento.fecha ? new Date(evento.fecha) : null;
    const fechaStr = fecha
        ? `${fecha.getUTCDate()} de ${MONTHS[fecha.getUTCMonth()]} de ${fecha.getUTCFullYear()}`
        : '—';

    const color = evento.grado
        ? (categoryColors[evento.grado.id] ?? {
              bg: 'bg-[rgba(255,255,255,0.08)]',
              text: 'text-cg-on-surface-variant',
          })
        : { bg: 'bg-[rgba(255,255,255,0.08)]', text: 'text-cg-on-surface-variant' };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={editing ? 'Editar Evento' : 'Detalle del Evento'}
            size="sm"
        >
            {editing ? (
                <EditForm evento={evento} grados={grados} tiposActividad={tiposActividad} onSuccess={onClose} />
            ) : (
                <div className="space-y-5">
                    <div className="space-y-1">
                        <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                            Evento
                        </p>
                        <p className="text-cg-on-surface text-lg font-bold">{evento.nombre}</p>
                    </div>
                    {evento.tipoActividad && (
                        <div className="space-y-1">
                            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                                Tipo de Actividad
                            </p>
                            <p className="text-cg-on-surface-variant text-sm">{evento.tipoActividad.nombre}</p>
                        </div>
                    )}
                    {evento.autor && (
                        <div className="space-y-1">
                            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                                Autor / Responsable
                            </p>
                            <p className="text-cg-on-surface-variant text-sm">{evento.autor}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                                Fecha
                            </p>
                            <p className="text-cg-on-surface-variant text-sm">{fechaStr}</p>
                        </div>
                        {evento.hora && (
                            <div className="space-y-1">
                                <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                                    Hora
                                </p>
                                <p className="text-cg-on-surface-variant text-sm">
                                    {evento.hora} hrs.
                                </p>
                            </div>
                        )}
                    </div>
                    {evento.lugar && (
                        <div className="space-y-1">
                            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                                Lugar
                            </p>
                            <p className="text-cg-on-surface-variant text-sm">{evento.lugar}</p>
                        </div>
                    )}
                    {evento.grado && (
                        <div className="space-y-1">
                            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                                Grado
                            </p>
                            <span
                                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${color.bg} ${color.text}`}
                            >
                                {evento.grado.nombre}
                            </span>
                        </div>
                    )}
                    {isAdmin && (
                        <div className="flex justify-end border-t border-[rgba(255,255,255,0.05)] pt-4">
                            <Button variant="outline" onClick={() => setEditing(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar evento
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}

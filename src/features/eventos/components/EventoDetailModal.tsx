'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';


import { type LucideIcon, CheckCircle, HelpCircle, Pencil, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';
import type { ActionResult } from '@/shared/types/actions';

import { rsvpEvento, updateEvento, type AsistenciaItem, type RsvpEstado } from '../actions';

type Evento = {
    id: number;
    nombre: string;
    tipoActividad: { id: number; nombre: string } | null;
    autor: string | null;
    fecha: Date | null;
    hora: string | null;
    lugar: string | null;
    grado: { id: number; nombre: string } | null;
    active?: number;
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
                <label htmlFor="edit-nombre" className="form-label">Nombre del Evento *</label>
                <Input id="edit-nombre" name="nombre" defaultValue={evento.nombre} required />
            </div>
            <div className="space-y-1">
                <label htmlFor="edit-tipoActividadId" className="form-label">Tipo de Actividad *</label>
                <select
                    id="edit-tipoActividadId"
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
                <label htmlFor="edit-autor" className="form-label">Autor / Responsable</label>
                <Input id="edit-autor" name="autor" defaultValue={evento.autor ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="edit-fecha" className="form-label">Fecha *</label>
                    <Input id="edit-fecha" name="fecha" type="date" defaultValue={fechaStr} required />
                </div>
                <div className="space-y-1">
                    <label htmlFor="edit-hora" className="form-label">Hora</label>
                    <Input id="edit-hora" name="hora" type="time" defaultValue={evento.hora ?? ''} />
                </div>
            </div>
            <div className="space-y-1">
                <label htmlFor="edit-lugar" className="form-label">Lugar</label>
                <Input
                    id="edit-lugar"
                    name="lugar"
                    defaultValue={evento.lugar ?? ''}
                    placeholder="Casa Masónica de Castro"
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="edit-grado" className="form-label">Grado *</label>
                <select
                    id="edit-grado"
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

const RSVP_OPTIONS: { value: RsvpEstado; label: string; icon: LucideIcon; color: string }[] =
    [
        {
            value: 'confirmado',
            label: 'Confirmar',
            icon: CheckCircle,
            color: 'text-[#41a65a] border-[#41a65a]/40 hover:bg-[#41a65a]/10',
        },
        {
            value: 'tentativo',
            label: 'Sin Ágape',
            icon: HelpCircle,
            color: 'text-[#f29c13] border-[#f29c13]/40 hover:bg-[#f29c13]/10',
        },
        {
            value: 'no_asiste',
            label: 'No asisto',
            icon: XCircle,
            color: 'text-[#ff6e84] border-[#ff6e84]/40 hover:bg-[#ff6e84]/10',
        },
    ];

const ESTADO_LABEL: Record<string, string> = {
    confirmado: 'Confirmado',
    tentativo: 'Sin Ágape',
    no_asiste: 'No asiste',
};

const ESTADO_COLOR: Record<string, string> = {
    confirmado: 'text-[#41a65a]',
    tentativo: 'text-[#f29c13]',
    no_asiste: 'text-[#ff6e84]',
};

// Lista de asistentes para admins
function AsistentesSection({ asistencias }: { asistencias: AsistenciaItem[] }) {
    if (asistencias.length === 0) return null;
    return (
        <div className="space-y-2 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                Asistentes ({asistencias.length})
            </p>
            <div className="max-h-36 space-y-1 overflow-y-auto">
                {asistencias.map((a) => (
                    <div key={a.userId} className="flex items-center justify-between text-xs">
                        <span className="text-cg-on-surface-variant">
                            {a.user.name} {a.user.lastName}
                        </span>
                        <span className={`font-medium ${ESTADO_COLOR[a.estado] ?? 'text-[#9a9ab0]'}`}>
                            {ESTADO_LABEL[a.estado] ?? a.estado}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Sub-componente — reduce complejidad cognitiva del modal principal
function RsvpSection({
    eventoId,
    initialEstado,
}: {
    eventoId: number;
    initialEstado: RsvpEstado | null | undefined;
}) {
    const [rsvpEstado, setRsvpEstado] = useState<RsvpEstado | null>(initialEstado ?? null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleRsvp(estado: RsvpEstado) {
        startTransition(async () => {
            const result = await rsvpEvento(eventoId, estado);
            if (result.success) {
                setRsvpEstado(estado);
                toast.success(`Asistencia marcada: ${ESTADO_LABEL[estado]}`);
                router.refresh();
            } else {
                toast.error('No se pudo guardar tu respuesta.');
            }
        });
    }

    return (
        <div className="space-y-2 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <p className="text-cg-outline text-xs font-semibold tracking-widest uppercase">
                Tu asistencia
            </p>
            {rsvpEstado && (
                <p className={`text-xs font-medium ${ESTADO_COLOR[rsvpEstado]}`}>
                    Estado actual: {ESTADO_LABEL[rsvpEstado]}
                </p>
            )}
            <div className="flex gap-2">
                {RSVP_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleRsvp(value)}
                        disabled={isPending}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${color} ${rsvpEstado === value ? 'opacity-100 ring-1 ring-current' : 'opacity-70'}`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface EventoDetailModalProps {
    evento: Evento | null;
    isOpen: boolean;
    onClose: () => void;
    isAdmin: boolean;
    grados: { id: number; nombre: string }[];
    tiposActividad?: { id: number; nombre: string }[];
    /** Estado RSVP inicial del usuario actual para este evento */
    userRsvp?: RsvpEstado | null;
    /** Lista de asistencias (para admins) */
    asistencias?: AsistenciaItem[];
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: JSX condicional del modal compuesto por código preexistente + RSVP
export function EventoDetailModal({
    evento,
    isOpen,
    onClose,
    isAdmin,
    grados,
    tiposActividad = [],
    userRsvp = null,
    asistencias = [],
}: EventoDetailModalProps) {
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!isOpen) setEditing(false);
    }, [isOpen]);

    if (!evento) return null;

    const isActive = evento.active === 1 || evento.active === undefined;
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

                    {/* RSVP — componente separado para mantener complejidad baja */}
                    {isActive && (
                        <RsvpSection eventoId={evento.id} initialEstado={userRsvp} />
                    )}

                    {/* Lista de asistentes (solo admin) */}
                    {isAdmin && <AsistentesSection asistencias={asistencias} />}

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

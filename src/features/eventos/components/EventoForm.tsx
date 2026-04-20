'use client';

import { useActionState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ActionResult } from '@/shared/types/actions';

import { createEvento } from '../actions';

interface EventoFormProps {
    grados: { id: number; nombre: string }[];
    tiposActividad: { id: number; nombre: string }[];
    onSuccess?: () => void;
}

export function EventoForm({ grados, tiposActividad, onSuccess }: EventoFormProps) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        createEvento,
        null,
    );

    useEffect(() => {
        if (state?.success) {
            toast.success('Evento creado correctamente');
            if (onSuccess) onSuccess();
            else router.push('/eventos');
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess]);

    return (
        <form action={formAction} className="cg-form-container max-w-lg space-y-5">
            <div className="space-y-1">
                <label htmlFor="nombre" className="form-label">Nombre del Evento *</label>
                <Input id="nombre" name="nombre" placeholder="Ej: La Búsqueda de la Verdad" required />
            </div>

            <div className="space-y-1">
                <label htmlFor="tipoActividadId" className="form-label">Tipo de Actividad *</label>
                <select id="tipoActividadId" name="tipoActividadId" required className="form-select">
                    <option value="">Seleccionar…</option>
                    {tiposActividad.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1">
                <label htmlFor="autor" className="form-label">Autor / Responsable</label>
                <Input
                    id="autor"
                    name="autor"
                    placeholder="Ej: Q.H. Pedro Bravo — Brindis: Q.H. Juan Serra / Q.H. Ivan Segovia"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="fecha" className="form-label">Fecha *</label>
                    <Input id="fecha" name="fecha" type="date" required />
                </div>
                <div className="space-y-1">
                    <label htmlFor="hora" className="form-label">Hora</label>
                    <Input id="hora" name="hora" type="time" placeholder="20:00" />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="lugar" className="form-label">Lugar</label>
                <Input id="lugar" name="lugar" placeholder="Ej: Casa Masónica de Castro" />
            </div>

            <div className="space-y-1">
                <label htmlFor="grado" className="form-label">Grado *</label>
                <select id="grado" name="grado" required className="form-select">
                    <option value="">Seleccionar…</option>
                    {grados.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                {!onSuccess && (
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Guardando…' : 'Crear Evento'}
                </Button>
            </div>
        </form>
    );
}

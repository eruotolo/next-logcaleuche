'use client';

import { useActionState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ActionResult } from '@/shared/types/actions';

import { updateSalida } from '../actions';

const MESES = [
    '01 - Enero',
    '02 - Febrero',
    '03 - Marzo',
    '04 - Abril',
    '05 - Mayo',
    '06 - Junio',
    '07 - Julio',
    '08 - Agosto',
    '09 - Septiembre',
    '10 - Octubre',
    '11 - Noviembre',
    '12 - Diciembre',
];

interface EditSalidaFormProps {
    id: number;
    salida: {
        mes: string | null;
        ano: string | null;
        motivoId: number | null;
        monto: unknown;
        fechaMov: Date;
    };
    motivos: { id: number; nombre: string }[];
    onSuccess?: () => void;
}

export function EditSalidaForm({ id, salida, motivos, onSuccess }: EditSalidaFormProps) {
    const router = useRouter();
    const boundAction = updateSalida.bind(null, id);

    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        boundAction,
        null,
    );

    useEffect(() => {
        if (state?.success) {
            toast.success('Egreso actualizado');
            if (onSuccess) onSuccess();
            else router.push('/tesoreria/egresos');
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess]);

    const fechaDefault = new Date(salida.fechaMov).toISOString().split('T')[0];

    return (
        <form action={formAction} className="cg-form-container max-w-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="mes" className="form-label">Mes *</label>
                    <select
                        id="mes"
                        name="mes"
                        required
                        defaultValue={salida.mes ?? ''}
                        className="form-select"
                    >
                        <option value="">Seleccionar…</option>
                        {MESES.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="ano" className="form-label">Año *</label>
                    <Input id="ano" name="ano" defaultValue={salida.ano ?? ''} required />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="motivoId" className="form-label">Motivo *</label>
                <select
                    id="motivoId"
                    name="motivoId"
                    required
                    defaultValue={salida.motivoId ?? ''}
                    className="form-select"
                >
                    <option value="">Seleccionar motivo…</option>
                    {motivos.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1">
                <label htmlFor="fecha" className="form-label">Fecha del movimiento *</label>
                <Input id="fecha" name="fecha" type="date" required defaultValue={fechaDefault} />
            </div>

            <div className="space-y-1">
                <label htmlFor="monto" className="form-label">Monto (CLP) *</label>
                <Input
                    id="monto"
                    name="monto"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={String(Number(salida.monto ?? 0))}
                    required
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                {!onSuccess && (
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Guardando…' : 'Actualizar Egreso'}
                </Button>
            </div>
        </form>
    );
}

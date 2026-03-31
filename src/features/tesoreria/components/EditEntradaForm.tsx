'use client';

import { useActionState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ActionResult } from '@/shared/types/actions';

import { updateEntrada } from '../actions';

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

interface EditEntradaFormProps {
    id: number;
    entrada: {
        userId: number | null;
        mes: string | null;
        ano: string | null;
        motivoId: number | null;
        monto: unknown;
        fechaMov: Date;
    };
    usuarios: { id: number; name: string | null; lastName: string | null }[];
    motivos: { id: number; nombre: string }[];
    onSuccess?: () => void;
}

export function EditEntradaForm({
    id,
    entrada,
    usuarios,
    motivos,
    onSuccess,
}: EditEntradaFormProps) {
    const router = useRouter();
    const boundAction = updateEntrada.bind(null, id);

    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        boundAction,
        null,
    );

    useEffect(() => {
        if (state?.success) {
            toast.success('Ingreso actualizado');
            if (onSuccess) onSuccess();
            else router.push('/tesoreria/ingresos');
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess]);

    const fechaDefault = new Date(entrada.fechaMov).toISOString().split('T')[0];

    return (
        <form action={formAction} className="cg-form-container max-w-lg space-y-4">
            <div className="space-y-1">
                <label className="form-label">Miembro *</label>
                <select
                    name="userId"
                    required
                    defaultValue={entrada.userId ?? ''}
                    className="form-select"
                >
                    <option value="">Seleccionar miembro…</option>
                    {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name} {u.lastName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="form-label">Mes *</label>
                    <select
                        name="mes"
                        required
                        defaultValue={entrada.mes ?? ''}
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
                    <label className="form-label">Año *</label>
                    <Input name="ano" defaultValue={entrada.ano ?? ''} required />
                </div>
            </div>

            <div className="space-y-1">
                <label className="form-label">Motivo *</label>
                <select
                    name="motivoId"
                    required
                    defaultValue={entrada.motivoId ?? ''}
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
                <label className="form-label">Fecha del movimiento *</label>
                <Input name="fecha" type="date" required defaultValue={fechaDefault} />
            </div>

            <div className="space-y-1">
                <label className="form-label">Monto (CLP) *</label>
                <Input
                    name="monto"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={String(Number(entrada.monto ?? 0))}
                    required
                />
                <div className="mt-1 flex gap-2">
                    {[45000, 30000, 15000].map((v) => (
                        <button
                            key={v}
                            type="button"
                            className="text-cg-on-surface-variant rounded bg-[rgba(255,255,255,0.06)] px-2 py-1 text-xs transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                            onClick={(e) => {
                                const input = (e.target as HTMLElement)
                                    .closest('form')
                                    ?.querySelector<HTMLInputElement>('[name="monto"]');
                                if (input) input.value = String(v);
                            }}
                        >
                            ${v.toLocaleString('es-CL')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                {!onSuccess && (
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Guardando…' : 'Actualizar Ingreso'}
                </Button>
            </div>
        </form>
    );
}

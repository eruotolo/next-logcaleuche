'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOTIVO_ENTRADA } from '@/shared/constants/domain';
import type { ActionResult } from '@/shared/types/actions';

import { createEntrada } from '../actions';

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

interface EntradaFormProps {
    usuarios: { id: number; name: string | null; lastName: string | null; tarifaMonto?: number }[];
    motivos: { id: number; nombre: string }[];
    onSuccess?: () => void;
}

export function EntradaForm({ usuarios, motivos, onSuccess }: EntradaFormProps) {
    const router = useRouter();
    const currentYear = new Date().getFullYear().toString();

    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        createEntrada,
        null,
    );

    // Estado para auto-fill de monto al seleccionar cuota mensual + miembro
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedMotivoId, setSelectedMotivoId] = useState<number | null>(null);
    const montoRef = useRef<HTMLInputElement>(null);

    // Mapa de usuario → tarifa para lookup rápido
    const tarifaMap = Object.fromEntries(usuarios.map((u) => [u.id, u.tarifaMonto ?? 0]));

    // Auto-fill: cuando cambia usuario o motivo, recalcular si es cuota mensual
    useEffect(() => {
        if (
            selectedUserId !== null &&
            selectedMotivoId === MOTIVO_ENTRADA.CUOTA_MENSUAL &&
            montoRef.current
        ) {
            const tarifa = tarifaMap[selectedUserId] ?? 0;
            if (tarifa > 0) {
                montoRef.current.value = String(tarifa);
            }
        }
        // Si el motivo cambia a otro que no es cuota, no limpiar — dejar que el usuario edite
    }, [selectedUserId, selectedMotivoId, tarifaMap]);

    useEffect(() => {
        if (state?.success) {
            toast.success('Ingreso registrado');
            if (onSuccess) onSuccess();
            else router.push('/tesoreria/ingresos');
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess]);

    return (
        <form action={formAction} className="cg-form-container max-w-lg space-y-4">
            <div className="space-y-1">
                <label htmlFor="userId" className="form-label">Miembro *</label>
                <select
                    id="userId"
                    name="userId"
                    required
                    className="form-select"
                    onChange={(e) =>
                        setSelectedUserId(e.target.value ? Number(e.target.value) : null)
                    }
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
                    <label htmlFor="mes" className="form-label">Mes *</label>
                    <select id="mes" name="mes" required className="form-select">
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
                    <Input id="ano" name="ano" defaultValue={currentYear} required />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="motivoId" className="form-label">Motivo *</label>
                <select
                    id="motivoId"
                    name="motivoId"
                    required
                    className="form-select"
                    onChange={(e) =>
                        setSelectedMotivoId(e.target.value ? Number(e.target.value) : null)
                    }
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
                <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="monto" className="form-label">
                    Monto (CLP) *
                    {selectedMotivoId === MOTIVO_ENTRADA.CUOTA_MENSUAL &&
                        selectedUserId !== null &&
                        (tarifaMap[selectedUserId] ?? 0) > 0 && (
                            <span className="text-cg-primary-tonal ml-2 text-[10px] font-normal">
                                (auto-completado por tarifa)
                            </span>
                        )}
                </label>
                <input
                    ref={montoRef}
                    id="monto"
                    name="monto"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="45000"
                    required
                    className="form-input"
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
                    {isPending ? 'Guardando…' : 'Registrar Ingreso'}
                </Button>
            </div>
        </form>
    );
}

'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';

import { ListPlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { MESES, formatCLP } from '@/shared/lib/utils';

import { createMultipleEntradas } from '../actions';

// Formato "01 - Enero" que espera la BD
const MESES_OPCIONES = MESES.map((nombre, i) => ({
    value: `${String(i + 1).padStart(2, '0')} - ${nombre}`,
    label: nombre,
}));

interface MultiCuotaModalProps {
    usuarios: { id: number; name: string | null; lastName: string | null; tarifaMonto?: number }[];
}

export function MultiCuotaModal({ usuarios }: MultiCuotaModalProps) {
    const { isOpen, open, close } = useModal();
    const [isPending, startTransition] = useTransition();

    const currentYear = new Date().getFullYear();

    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
    const [monto, setMonto] = useState<string>('');
    const [ano, setAno] = useState<string>(String(currentYear));

    // Mapa usuario → tarifa para auto-fill
    const tarifaMap = useMemo(
        () => Object.fromEntries(usuarios.map((u) => [u.id, u.tarifaMonto ?? 0])),
        [usuarios],
    );

    // Auto-fill monto al cambiar usuario
    useEffect(() => {
        if (selectedUserId !== '') {
            const tarifa = tarifaMap[selectedUserId] ?? 0;
            if (tarifa > 0) setMonto(String(tarifa));
        }
    }, [selectedUserId, tarifaMap]);

    function toggleMes(mes: string) {
        setSelectedMeses((prev) =>
            prev.includes(mes) ? prev.filter((m) => m !== mes) : [...prev, mes],
        );
    }

    function handleSelectAll() {
        setSelectedMeses(MESES_OPCIONES.map((m) => m.value));
    }

    function handleClearAll() {
        setSelectedMeses([]);
    }

    function handleClose() {
        close();
        setSelectedUserId('');
        setSelectedMeses([]);
        setMonto('');
        setAno(String(currentYear));
    }

    function handleSubmit() {
        if (!selectedUserId) {
            toast.error('Selecciona un miembro');
            return;
        }
        if (selectedMeses.length === 0) {
            toast.error('Selecciona al menos un mes');
            return;
        }
        if (!monto || Number(monto) <= 0) {
            toast.error('Ingresa un monto válido');
            return;
        }

        const fd = new FormData();
        fd.append('userId', String(selectedUserId));
        fd.append('ano', ano);
        fd.append('monto', monto);
        fd.append('fecha', new Date().toISOString().split('T')[0]);
        for (const mes of selectedMeses) {
            fd.append('meses', mes);
        }

        startTransition(async () => {
            const res = await createMultipleEntradas(fd);
            if (res.success) {
                toast.success(`${res.data.count} cuota(s) registrada(s) correctamente`);
                handleClose();
            } else {
                toast.error(res.error as string);
            }
        });
    }

    const totalMonto = selectedMeses.length * Number(monto || 0);

    return (
        <>
            <Button variant="outline" onClick={() => open()} title="Registrar múltiples cuotas">
                <ListPlus className="mr-2 h-4 w-4" />
                Múltiples Cuotas
            </Button>

            <Modal open={isOpen} onClose={handleClose} title="Registrar Múltiples Cuotas" size="lg">
                <div className="space-y-5">
                    {/* Selección de miembro y año */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="mc-userId" className="form-label">
                                Miembro *
                            </label>
                            <select
                                id="mc-userId"
                                className="form-select"
                                value={selectedUserId}
                                onChange={(e) =>
                                    setSelectedUserId(e.target.value ? Number(e.target.value) : '')
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
                        <div className="space-y-1">
                            <label htmlFor="mc-ano" className="form-label">
                                Año *
                            </label>
                            <input
                                id="mc-ano"
                                type="number"
                                className="form-input"
                                value={ano}
                                min="2000"
                                max={currentYear + 2}
                                onChange={(e) => setAno(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Monto por cuota */}
                    <div className="space-y-1">
                        <label htmlFor="mc-monto" className="form-label">
                            Monto por cuota (CLP) *
                            {selectedUserId !== '' && (tarifaMap[selectedUserId] ?? 0) > 0 && (
                                <span className="text-cg-primary-tonal ml-2 text-[10px] font-normal">
                                    (auto-completado por tarifa)
                                </span>
                            )}
                        </label>
                        <input
                            id="mc-monto"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="45000"
                            className="form-input"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                        />
                    </div>

                    {/* Grid de meses */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="form-label mb-0">Meses a registrar *</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="text-cg-primary-tonal text-xs underline-offset-2 hover:underline"
                                    onClick={handleSelectAll}
                                >
                                    Seleccionar todos
                                </button>
                                <span className="text-cg-outline">·</span>
                                <button
                                    type="button"
                                    className="text-cg-outline hover:text-cg-on-surface-variant text-xs"
                                    onClick={handleClearAll}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {MESES_OPCIONES.map((mes) => {
                                const isSelected = selectedMeses.includes(mes.value);
                                return (
                                    <button
                                        key={mes.value}
                                        type="button"
                                        onClick={() => toggleMes(mes.value)}
                                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                            isSelected
                                                ? 'border-[rgba(65,166,90,0.4)] bg-[rgba(65,166,90,0.15)] text-[var(--color-entrada)]'
                                                : 'text-cg-on-surface-variant border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]'
                                        }`}
                                    >
                                        {mes.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resumen */}
                    {selectedMeses.length > 0 && Number(monto) > 0 && (
                        <div className="text-cg-on-surface rounded-xl border border-[rgba(65,166,90,0.2)] bg-[rgba(65,166,90,0.07)] px-4 py-3 text-sm">
                            <span className="text-cg-on-surface-variant">Resumen: </span>
                            <strong className="text-cg-on-surface">{selectedMeses.length}</strong>
                            {' cuota(s) × '}
                            <strong className="text-[var(--color-entrada)]">
                                {formatCLP(Number(monto))}
                            </strong>
                            {' = '}
                            <strong className="text-[var(--color-total)]">
                                {formatCLP(totalMonto)}
                            </strong>
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="flex justify-end gap-3 pt-1">
                        <Button variant="outline" onClick={handleClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                isPending ||
                                selectedUserId === '' ||
                                selectedMeses.length === 0 ||
                                !monto ||
                                Number(monto) <= 0
                            }
                        >
                            {isPending
                                ? 'Registrando…'
                                : `Registrar ${selectedMeses.length > 0 ? `(${selectedMeses.length})` : ''}`}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

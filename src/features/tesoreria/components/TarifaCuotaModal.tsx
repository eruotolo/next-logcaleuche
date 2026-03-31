'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';



import { Pencil, Settings, Trash2 } from 'lucide-react';
import { toast } from 'sonner';



import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { formatCLP } from '@/shared/lib/utils';



import { createTarifaCuota, deleteTarifaCuota, getTarifasCuota, updateTarifaCuota } from '../actions';





















































































































































interface Tarifa {
    id: number;
    nombre: string;
    monto: number;
}

export function TarifaCuotaModal() {
    const { isOpen, open, close } = useModal();
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    // Refs para el formulario de creación
    const newNombreRef = useRef<HTMLInputElement>(null);
    const newMontoRef = useRef<HTMLInputElement>(null);

    // Refs para el formulario de edición (por id)
    const editNombreRef = useRef<HTMLInputElement>(null);
    const editMontoRef = useRef<HTMLInputElement>(null);

    const loadTarifas = useCallback(async () => {
        try {
            const data = await getTarifasCuota();
            setTarifas(data.map((t) => ({ ...t, monto: Number(t.monto) })));
        } catch {
            toast.error('Error al cargar tarifas');
        }
    }, []);

    // Cargar tarifas al abrir el modal
    useEffect(() => {
        if (isOpen) {
            loadTarifas();
        } else {
            setEditingId(null);
        }
    }, [isOpen, loadTarifas]);

    function handleCreate() {
        const fd = new FormData();
        fd.append('nombre', newNombreRef.current?.value ?? '');
        fd.append('monto', newMontoRef.current?.value ?? '');

        startTransition(async () => {
            const res = await createTarifaCuota(fd);
            if (res.success) {
                toast.success('Tarifa creada');
                if (newNombreRef.current) newNombreRef.current.value = '';
                if (newMontoRef.current) newMontoRef.current.value = '';
                await loadTarifas();
            } else {
                toast.error(res.error as string);
            }
        });
    }

    function handleStartEdit(tarifa: Tarifa) {
        setEditingId(tarifa.id);
        // Esperamos un tick para que los refs estén disponibles tras el render
        setTimeout(() => {
            if (editNombreRef.current) editNombreRef.current.value = tarifa.nombre;
            if (editMontoRef.current) editMontoRef.current.value = String(tarifa.monto);
        }, 0);
    }

    function handleUpdate(id: number) {
        const fd = new FormData();
        fd.append('nombre', editNombreRef.current?.value ?? '');
        fd.append('monto', editMontoRef.current?.value ?? '');

        startTransition(async () => {
            const res = await updateTarifaCuota(id, fd);
            if (res.success) {
                toast.success('Tarifa actualizada');
                setEditingId(null);
                await loadTarifas();
            } else {
                toast.error(res.error as string);
            }
        });
    }

    function handleDelete(id: number, nombre: string) {
        if (!confirm(`¿Eliminar la tarifa "${nombre}"?`)) return;
        startTransition(async () => {
            const res = await deleteTarifaCuota(id);
            if (res.success) {
                toast.success('Tarifa eliminada');
                await loadTarifas();
            } else {
                toast.error(res.error as string);
            }
        });
    }

    return (
        <>
            <Button variant="outline" onClick={() => open()} title="Gestionar tarifas de cuota">
                <Settings className="mr-2 h-4 w-4" />
                Tarifas
            </Button>

            <Modal open={isOpen} onClose={close} title="Gestión de Tarifas de Cuota" size="md">
                <div className="space-y-5">
                    {/* Tabla de tarifas existentes */}
                    <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
                                    <th className="text-cg-on-surface-variant px-4 py-2.5 text-left font-medium">
                                        Nombre
                                    </th>
                                    <th className="text-cg-on-surface-variant px-4 py-2.5 text-right font-medium">
                                        Monto
                                    </th>
                                    <th className="text-cg-on-surface-variant px-4 py-2.5 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tarifas.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-cg-on-surface-variant px-4 py-6 text-center italic"
                                        >
                                            No hay tarifas registradas.
                                        </td>
                                    </tr>
                                )}
                                {tarifas.map((tarifa) => (
                                    <tr
                                        key={tarifa.id}
                                        className="border-b border-[rgba(255,255,255,0.04)] transition-colors last:border-0 hover:bg-[rgba(255,255,255,0.02)]"
                                    >
                                        {editingId === tarifa.id ? (
                                            // Fila en modo edición
                                            <>
                                                <td className="px-3 py-2">
                                                    <input
                                                        ref={editNombreRef}
                                                        defaultValue={tarifa.nombre}
                                                        className="form-input h-8 w-full text-sm"
                                                        placeholder="Nombre"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        ref={editMontoRef}
                                                        defaultValue={tarifa.monto}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        className="form-input h-8 w-full text-right text-sm"
                                                        placeholder="Monto"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            size="sm"
                                                            disabled={isPending}
                                                            onClick={() => handleUpdate(tarifa.id)}
                                                        >
                                                            Guardar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // Fila en modo lectura
                                            <>
                                                <td className="text-cg-on-surface px-4 py-3">
                                                    {tarifa.nombre}
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono text-[var(--color-entrada)]">
                                                    {formatCLP(tarifa.monto)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Editar"
                                                            onClick={() => handleStartEdit(tarifa)}
                                                        >
                                                            <Pencil className="text-cg-primary-tonal h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            title="Eliminar"
                                                            disabled={isPending}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    tarifa.id,
                                                                    tarifa.nombre,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Formulario de creación */}
                    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4">
                        <p className="text-cg-on-surface-variant mb-3 text-xs font-medium tracking-wide uppercase">
                            Nueva Tarifa
                        </p>
                        <div className="grid grid-cols-5 gap-x-3">
                            <input
                                ref={newNombreRef}
                                type="text"
                                placeholder="Nombre (ej: Estándar)"
                                className="form-input col-span-2 h-9 w-full text-sm"
                            />
                            <input
                                ref={newMontoRef}
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Monto CLP"
                                className="form-input col-span-2 h-9 flex-1 text-right text-sm"
                            />
                            <Button
                                size="sm"
                                disabled={isPending}
                                onClick={handleCreate}
                                className="col-span-1 shrink-0"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

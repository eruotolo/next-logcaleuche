'use client';

import { useActionState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { useModal } from '@/shared/hooks/useModal';

import { updateLibro, updateTrazado } from '../actions';

interface BibliotecaItem {
    id: number;
    nombre?: string | null;
    autor?: string | null;
    gradoId?: number;
}

interface TrazadoItem {
    id: number;
    nombre?: string | null;
    autorId?: number;
    gradoId?: number;
    fecha?: Date | null;
    tipoActividadId?: number | null;
}

interface EditBibliotecaProps {
    tipo: 'biblioteca';
    item: BibliotecaItem;
    grados: { id: number; nombre: string }[];
    usuarios?: never;
}

interface EditTrazadoProps {
    tipo: 'trazado';
    item: TrazadoItem;
    grados: { id: number; nombre: string }[];
    usuarios: { id: number; name: string | null; lastName: string | null }[];
    tiposActividad?: { id: number; nombre: string }[];
}

type EditDocGradoModalProps = EditBibliotecaProps | EditTrazadoProps;

function toInputDate(date: Date | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

export function EditDocGradoModal(props: EditDocGradoModalProps) {
    const { tipo, item, grados } = props;
    const { isOpen, open, close } = useModal();
    const router = useRouter();

    const boundAction =
        tipo === 'biblioteca' ? updateLibro.bind(null, item.id) : updateTrazado.bind(null, item.id);

    const [state, action, isPending] = useActionState(boundAction, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(tipo === 'biblioteca' ? 'Libro actualizado' : 'Trazado actualizado');
            close();
            router.refresh();
        } else if (state && !state.success) {
            toast.error(typeof state.error === 'string' ? state.error : 'Error al actualizar.');
        }
    }, [state, close, router, tipo]);

    const title = tipo === 'biblioteca' ? 'Editar Libro' : 'Editar Trazado';

    return (
        <>
            <Tooltip content={title}>
                <button
                    type="button"
                    onClick={() => open()}
                    className="text-cg-outline hover:text-cg-primary-tonal flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(158,167,255,0.15)]"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </Tooltip>

            <Modal open={isOpen} onClose={close} title={title} size="sm">
                <form action={action} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label htmlFor={`edit-${tipo}-nombre-${item.id}`} className="form-label">
                            Nombre
                        </label>
                        <Input
                            id={`edit-${tipo}-nombre-${item.id}`}
                            name="nombre"
                            defaultValue={item.nombre ?? ''}
                            placeholder="Nombre"
                            required
                        />
                    </div>

                    {/* Autor — texto para biblioteca, select para trazado */}
                    {tipo === 'biblioteca' ? (
                        <div className="space-y-2">
                            <label htmlFor={`edit-bib-autor-${item.id}`} className="form-label">
                                Autor
                            </label>
                            <Input
                                id={`edit-bib-autor-${item.id}`}
                                name="autor"
                                defaultValue={(item as BibliotecaItem).autor ?? ''}
                                placeholder="Autor del libro"
                                required
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label htmlFor={`edit-traz-autor-${item.id}`} className="form-label">
                                Autor
                            </label>
                            <select
                                id={`edit-traz-autor-${item.id}`}
                                name="autor"
                                defaultValue={(item as TrazadoItem).autorId ?? ''}
                                required
                                className="text-cg-on-surface block w-full rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px]"
                            >
                                <option value="">Seleccionar autor</option>
                                {props.usuarios.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} {u.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Grado */}
                    <div className="space-y-2">
                        <label htmlFor={`edit-${tipo}-grado-${item.id}`} className="form-label">
                            Grado
                        </label>
                        <select
                            id={`edit-${tipo}-grado-${item.id}`}
                            name="grado"
                            defaultValue={item.gradoId ?? ''}
                            required
                            className="text-cg-on-surface block w-full rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px]"
                        >
                            <option value="">Seleccionar grado</option>
                            {grados.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo de Actividad — solo para trazado */}
                    {tipo === 'trazado' && props.tiposActividad && props.tiposActividad.length > 0 && (
                        <div className="space-y-2">
                            <label htmlFor={`edit-traz-tipo-${item.id}`} className="form-label">
                                Tipo de Actividad
                            </label>
                            <select
                                id={`edit-traz-tipo-${item.id}`}
                                name="tipoActividadId"
                                defaultValue={(item as TrazadoItem).tipoActividadId ?? ''}
                                className="text-cg-on-surface block w-full rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px]"
                            >
                                <option value="">Sin tipo</option>
                                {props.tiposActividad.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Fecha — solo para trazado */}
                    {tipo === 'trazado' && (
                        <div className="space-y-2">
                            <label htmlFor={`edit-traz-fecha-${item.id}`} className="form-label">
                                Fecha
                            </label>
                            <Input
                                id={`edit-traz-fecha-${item.id}`}
                                name="fecha"
                                type="date"
                                defaultValue={toInputDate((item as TrazadoItem).fecha)}
                                required
                            />
                        </div>
                    )}

                    {/* Archivo opcional */}
                    <div className="space-y-2">
                        <label htmlFor={`edit-${tipo}-file-${item.id}`} className="form-label">
                            Reemplazar Archivo{' '}
                            <span className="text-cg-outline text-[11px] font-normal">
                                (opcional)
                            </span>
                        </label>
                        <input
                            id={`edit-${tipo}-file-${item.id}`}
                            type="file"
                            name="file"
                            accept=".pdf,.doc,.docx"
                            className="text-cg-on-surface-variant file:text-cg-primary-tonal block w-full cursor-pointer rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px] file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[rgba(158,167,255,0.15)] file:px-2 file:py-0.5 file:text-[11px] file:font-medium"
                        />
                        <p className="text-cg-outline text-[10px]">
                            Deja vacío para mantener el archivo actual.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[rgba(70,70,88,0.2)] pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={close}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

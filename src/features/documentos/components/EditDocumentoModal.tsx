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

import { updateDocumento } from '../actions';

interface EditDocumentoModalProps {
    documento: {
        id: number;
        nombre: string | null;
        fechaDoc: Date | null;
    };
}

// Convierte Date a string "YYYY-MM-DD" para el input[type=date]
function toInputDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

export function EditDocumentoModal({ documento }: EditDocumentoModalProps) {
    const { isOpen, open, close } = useModal();
    const router = useRouter();

    const boundAction = updateDocumento.bind(null, documento.id);
    const [state, action, isPending] = useActionState(boundAction, null);

    useEffect(() => {
        if (state?.success) {
            toast.success('Documento actualizado');
            close();
            router.refresh();
        } else if (state && !state.success) {
            toast.error(typeof state.error === 'string' ? state.error : 'Error al actualizar.');
        }
    }, [state, close, router]);

    return (
        <>
            <Tooltip content="Editar documento">
                <button
                    type="button"
                    onClick={() => open()}
                    className="text-cg-outline hover:text-cg-primary-tonal flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(158,167,255,0.15)]"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </Tooltip>

            <Modal open={isOpen} onClose={close} title="Editar Documento" size="sm">
                <form action={action} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label htmlFor="edit-doc-nombre" className="form-label">
                            Nombre
                        </label>
                        <Input
                            id="edit-doc-nombre"
                            name="nombre"
                            defaultValue={documento.nombre ?? ''}
                            placeholder="Nombre del documento"
                            required
                        />
                    </div>

                    {/* Fecha */}
                    <div className="space-y-2">
                        <label htmlFor="edit-doc-fecha" className="form-label">
                            Fecha del Documento
                        </label>
                        <Input
                            id="edit-doc-fecha"
                            name="fecha"
                            type="date"
                            defaultValue={toInputDate(documento.fechaDoc)}
                            required
                        />
                    </div>

                    {/* Archivo opcional */}
                    <div className="space-y-2">
                        <label htmlFor="edit-doc-file" className="form-label">
                            Reemplazar Archivo{' '}
                            <span className="text-cg-outline text-[11px] font-normal">
                                (opcional)
                            </span>
                        </label>
                        <input
                            id="edit-doc-file"
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

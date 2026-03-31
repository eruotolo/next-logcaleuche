'use client';

import { useActionState, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ActionResult } from '@/shared/types/actions';

import { createLibro, createTrazado } from '../actions';
import type { DocTipo } from './DocGradoList';

interface DocGradoFormProps {
    tipo: DocTipo;
    grados: { id: number; nombre: string }[];
    usuarios?: { id: number; name: string | null; lastName: string | null }[];
    redirectTo: string;
    onSuccess?: () => void;
}

const createActions: Record<
    DocTipo,
    (prev: ActionResult<null> | null, formData: FormData) => Promise<ActionResult<null>>
> = {
    biblioteca: createLibro,
    trazado: createTrazado,
};

const labels: Record<DocTipo, string> = {
    biblioteca: 'Subir Libro',
    trazado: 'Subir Trazado',
};

export function DocGradoForm({
    tipo,
    grados,
    usuarios = [],
    redirectTo,
    onSuccess,
}: DocGradoFormProps) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        createActions[tipo],
        null,
    );
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    useEffect(() => {
        if (state?.success) {
            toast.success('Archivo subido correctamente');
            if (onSuccess) onSuccess();
            else router.push(redirectTo);
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router, redirectTo, onSuccess]);

    return (
        <form action={formAction} className="cg-form-container max-w-lg space-y-4">
            {/* Nombre */}
            <div className="space-y-1">
                <label className="form-label">Nombre *</label>
                <Input
                    name="nombre"
                    placeholder={tipo === 'trazado' ? 'Nombre del trazado' : 'Nombre del libro'}
                    required
                />
            </div>

            {/* Autor (solo biblioteca y trazado) */}
            {tipo === 'biblioteca' && (
                <div className="space-y-1">
                    <label className="form-label">Autor *</label>
                    <Input name="autor" placeholder="Autor del libro" required />
                </div>
            )}
            {tipo === 'trazado' && usuarios.length > 0 && (
                <div className="space-y-1">
                    <label className="form-label">Autor *</label>
                    <select name="autor" required className="form-select">
                        <option value="">Seleccionar hermano…</option>
                        {usuarios.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} {u.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Fecha (solo trazado) */}
            {tipo === 'trazado' && (
                <div className="space-y-1">
                    <label className="form-label">Fecha *</label>
                    <Input name="fecha" type="date" required />
                </div>
            )}

            {/* Grado */}
            <div className="space-y-1">
                <label className="form-label">Grado *</label>
                <select name="grado" required className="form-select">
                    <option value="">Seleccionar grado…</option>
                    {grados.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Archivo PDF */}
            <div className="space-y-3">
                <label className="form-label">Archivo PDF *</label>
                <div className="flex flex-col gap-3">
                    {selectedFileName && (
                        <div className="flex items-center gap-3 rounded-lg border border-[rgba(70,70,88,0.3)] bg-[rgba(255,255,255,0.02)] p-3 shadow-sm">
                            <FileText className="h-6 w-6 text-[#ff6e84]" />
                            <span className="w-full truncate text-sm font-medium text-[#e7e6fc]">
                                {selectedFileName}
                            </span>
                        </div>
                    )}
                    <label className="text-cg-on-surface-variant flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)]">
                        <FileText className="h-4 w-4" />
                        <span>{selectedFileName ? 'Cambiar PDF' : 'Seleccionar PDF'}</span>
                        <input
                            type="file"
                            name="file"
                            accept=".pdf"
                            required
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 15 * 1024 * 1024) {
                                        toast.error('El documento no debe superar los 15MB');
                                        e.target.value = '';
                                        setSelectedFileName(null);
                                        return;
                                    }
                                    if (file.type !== 'application/pdf') {
                                        toast.error('El archivo debe ser un formato PDF válido');
                                        e.target.value = '';
                                        setSelectedFileName(null);
                                        return;
                                    }
                                    setSelectedFileName(file.name);
                                } else {
                                    setSelectedFileName(null);
                                }
                            }}
                        />
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                {!onSuccess && (
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Subiendo…' : labels[tipo]}
                </Button>
            </div>
        </form>
    );
}

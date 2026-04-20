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
    tiposActividad?: { id: number; nombre: string }[];
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
    tiposActividad = [],
    redirectTo,
    onSuccess,
}: DocGradoFormProps) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        createActions[tipo],
        null,
    );
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

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
                <label htmlFor="nombre" className="form-label">Nombre *</label>
                <Input
                    id="nombre"
                    name="nombre"
                    placeholder={tipo === 'trazado' ? 'Nombre del trazado' : 'Nombre del libro'}
                    required
                />
            </div>

            {/* Autor (solo biblioteca y trazado) */}
            {tipo === 'biblioteca' && (
                <div className="space-y-1">
                    <label htmlFor="autor" className="form-label">Autor *</label>
                    <Input id="autor" name="autor" placeholder="Autor del libro" required />
                </div>
            )}
            {tipo === 'trazado' && usuarios.length > 0 && (
                <div className="space-y-1">
                    <label htmlFor="autor" className="form-label">Autor *</label>
                    <select id="autor" name="autor" required className="form-select">
                        <option value="">Seleccionar hermano…</option>
                        {usuarios.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} {u.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Tipo de Actividad (solo trazado) */}
            {tipo === 'trazado' && tiposActividad.length > 0 && (
                <div className="space-y-1">
                    <label htmlFor="tipoActividadId" className="form-label">Tipo de Actividad</label>
                    <select id="tipoActividadId" name="tipoActividadId" className="form-select">
                        <option value="">Seleccionar…</option>
                        {tiposActividad.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Fecha (solo trazado) */}
            {tipo === 'trazado' && (
                <div className="space-y-1">
                    <label htmlFor="fecha" className="form-label">Fecha *</label>
                    <Input id="fecha" name="fecha" type="date" required />
                </div>
            )}

            {/* Grado */}
            <div className="space-y-1">
                <label htmlFor="grado" className="form-label">Grado *</label>
                <select id="grado" name="grado" required className="form-select">
                    <option value="">Seleccionar grado…</option>
                    {grados.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Archivo — selector de modo solo para biblioteca */}
            <div className="space-y-3">
                {tipo === 'biblioteca' && (
                    <div className="flex rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.02)] p-1">
                        <button
                            type="button"
                            onClick={() => setUploadMode('file')}
                            className={`flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                                uploadMode === 'file'
                                    ? 'bg-[rgba(158,167,255,0.2)] text-[#e7e6fc]'
                                    : 'text-cg-outline hover:text-cg-on-surface'
                            }`}
                        >
                            Subir archivo
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadMode('url')}
                            className={`flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                                uploadMode === 'url'
                                    ? 'bg-[rgba(158,167,255,0.2)] text-[#e7e6fc]'
                                    : 'text-cg-outline hover:text-cg-on-surface'
                            }`}
                        >
                            Link Google Drive
                        </button>
                    </div>
                )}

                {(tipo !== 'biblioteca' || uploadMode === 'file') && (
                    <>
                        <p className="form-label">Archivo PDF *</p>
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
                    </>
                )}

                {tipo === 'biblioteca' && uploadMode === 'url' && (
                    <div className="space-y-1">
                        <label htmlFor="externalUrl" className="form-label">URL de Google Drive *</label>
                        <input
                            id="externalUrl"
                            type="url"
                            name="externalUrl"
                            required
                            placeholder="https://drive.google.com/file/d/.../view"
                            className="text-cg-on-surface block w-full rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px] placeholder:text-[rgba(255,255,255,0.25)] focus:outline-none focus:ring-1 focus:ring-[rgba(158,167,255,0.4)]"
                        />
                        <p className="text-cg-outline text-[11px]">
                            El archivo debe estar compartido como "Cualquiera con el link".
                        </p>
                    </div>
                )}
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

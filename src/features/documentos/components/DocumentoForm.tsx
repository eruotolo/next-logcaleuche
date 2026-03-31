'use client';

import { useActionState, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ActionResult } from '@/shared/types/actions';

import { createDocumento } from '../actions';

interface DocumentoFormProps {
    onSuccess?: () => void;
}

export function DocumentoForm({ onSuccess }: DocumentoFormProps = {}) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<ActionResult<null> | null, FormData>(
        createDocumento,
        null,
    );
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    useEffect(() => {
        if (state?.success) {
            toast.success('Documento subido correctamente');
            if (onSuccess) onSuccess();
            else router.push('/documentos');
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess]);

    return (
        <form action={formAction} className="cg-form-container max-w-lg space-y-5">
            <div className="space-y-1">
                <label className="form-label">Nombre del Documento *</label>
                <Input name="nombre" placeholder="Ej: Reglamento Interno 2024" required />
            </div>

            <div className="space-y-1">
                <label className="form-label">Fecha *</label>
                <Input name="fecha" type="date" required />
            </div>

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
                    {isPending ? 'Subiendo…' : 'Subir Documento'}
                </Button>
            </div>
        </form>
    );
}

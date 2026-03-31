'use client';

import { useRef, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { FileUp } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

import { importEventos } from '../actions';
import type { ImportResult } from '../schemas';

export function ImportEventosButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorResult, setErrorResult] = useState<ImportResult | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
    }

    function handleConfirm() {
        if (!selectedFile) return;

        startTransition(async () => {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const result = await importEventos(formData);

            if (!result.success) {
                toast.error(typeof result.error === 'string' ? result.error : 'Error al importar');
                resetState();
                return;
            }

            if (result.data.errors.length > 0) {
                setErrorResult(result.data);
                setSelectedFile(null);
                return;
            }

            toast.success(`Se importaron ${result.data.imported} eventos correctamente.`);
            resetState();
            router.refresh();
        });
    }

    function resetState() {
        setSelectedFile(null);
        setErrorResult(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileChange}
            />
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
                <FileUp className="mr-2 h-4 w-4" />
                Importar Planilla
            </Button>

            {/* Modal de confirmación */}
            <Modal
                open={selectedFile !== null}
                onClose={resetState}
                title="Confirmar importación"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cg-on-surface-variant text-sm">
                        Se importará el archivo:{' '}
                        <span className="text-cg-on-surface font-medium">
                            {selectedFile?.name}
                        </span>
                    </p>
                    <p className="text-cg-on-surface-variant text-xs">
                        Si alguna fila tiene errores, no se importará ningún evento.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={resetState} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} loading={isPending}>
                            Importar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de errores */}
            <Modal
                open={errorResult !== null}
                onClose={resetState}
                title="Errores en la planilla"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-cg-on-surface-variant text-sm">
                        No se importó ningún evento. Corrige los errores y vuelve a intentar.
                    </p>
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-[rgba(70,70,88,0.35)]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[rgba(70,70,88,0.35)]">
                                    <th className="px-3 py-2 text-left font-medium">Fila</th>
                                    <th className="px-3 py-2 text-left font-medium">Errores</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errorResult?.errors.map((err) => (
                                    <tr
                                        key={err.row}
                                        className="border-b border-[rgba(70,70,88,0.2)]"
                                    >
                                        <td className="px-3 py-2 font-mono">{err.row}</td>
                                        <td className="text-cg-error px-3 py-2">
                                            {err.messages.join(', ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="ghost" onClick={resetState}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

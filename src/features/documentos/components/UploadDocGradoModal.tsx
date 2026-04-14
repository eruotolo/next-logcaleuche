'use client';

import { useRouter } from 'next/navigation';

import { Upload } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { DocGradoForm } from './DocGradoForm';
import type { DocTipo } from './DocGradoList';

interface UploadDocGradoModalProps {
    tipo: DocTipo;
    grados: { id: number; nombre: string }[];
    usuarios?: { id: number; name: string | null; lastName: string | null }[];
    tiposActividad?: { id: number; nombre: string }[];
    redirectTo: string;
}

const titles: Record<DocTipo, string> = {
    biblioteca: 'Subir Libro',
    trazado: 'Subir Trazado',
};

export function UploadDocGradoModal({
    tipo,
    grados,
    usuarios,
    tiposActividad,
    redirectTo,
}: UploadDocGradoModalProps) {
    const { isOpen, open, close } = useModal();
    const router = useRouter();

    function handleSuccess() {
        close();
        router.refresh();
    }

    return (
        <>
            <Button onClick={() => open()}>
                <Upload className="mr-2 h-4 w-4" />
                {titles[tipo]}
            </Button>
            <Modal open={isOpen} onClose={close} title={titles[tipo]} size="md">
                <DocGradoForm
                    tipo={tipo}
                    grados={grados}
                    usuarios={usuarios}
                    tiposActividad={tiposActividad}
                    redirectTo={redirectTo}
                    onSuccess={handleSuccess}
                />
            </Modal>
        </>
    );
}

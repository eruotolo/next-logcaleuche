'use client';

import { useRouter } from 'next/navigation';

import { Upload } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { DocumentoForm } from './DocumentoForm';

export function UploadDocumentoModal() {
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
                Subir Documento
            </Button>
            <Modal open={isOpen} onClose={close} title="Subir Documento" size="md">
                <DocumentoForm onSuccess={handleSuccess} />
            </Modal>
        </>
    );
}

'use client';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { SalidaForm } from './SalidaForm';

interface CreateSalidaModalProps {
    motivos: { id: number; nombre: string }[];
}

export function CreateSalidaModal({ motivos }: CreateSalidaModalProps) {
    const { isOpen, open, close } = useModal();
    const router = useRouter();

    function handleSuccess() {
        close();
        router.refresh();
    }

    return (
        <>
            <Button onClick={() => open()}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Egreso
            </Button>
            <Modal open={isOpen} onClose={close} title="Registrar Egreso" size="sm">
                <SalidaForm motivos={motivos} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
}

'use client';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { EntradaForm } from './EntradaForm';

interface CreateEntradaModalProps {
    usuarios: { id: number; name: string | null; lastName: string | null; tarifaMonto?: number }[];
    motivos: { id: number; nombre: string }[];
}

export function CreateEntradaModal({ usuarios, motivos }: CreateEntradaModalProps) {
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
                Registrar Ingreso
            </Button>
            <Modal open={isOpen} onClose={close} title="Registrar Ingreso" size="md">
                <EntradaForm usuarios={usuarios} motivos={motivos} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
}

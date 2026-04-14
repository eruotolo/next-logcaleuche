'use client';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { EventoForm } from './EventoForm';

interface CreateEventoModalProps {
    grados: { id: number; nombre: string }[];
    tiposActividad: { id: number; nombre: string }[];
}

export function CreateEventoModal({ grados, tiposActividad }: CreateEventoModalProps) {
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
                Nuevo Evento
            </Button>
            <Modal open={isOpen} onClose={close} title="Nuevo Evento" size="sm">
                <EventoForm grados={grados} tiposActividad={tiposActividad} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
}

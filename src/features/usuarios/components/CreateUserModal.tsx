'use client';

import { useRouter } from 'next/navigation';

import { UserPlus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { UserForm } from './UserForm';

interface CreateUserModalProps {
    grados: { id: number; nombre: string }[];
    categories: { id: number; nombre: string }[];
}

export function CreateUserModal({ grados, categories }: CreateUserModalProps) {
    const { isOpen, open, close } = useModal();
    const router = useRouter();

    function handleSuccess() {
        close();
        router.refresh();
    }

    return (
        <>
            <Button onClick={() => open()} className="shadow-sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Miembro
            </Button>
            <Modal open={isOpen} onClose={close} title="Registrar Nuevo Miembro" size="md">
                <UserForm grados={grados} categories={categories} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
}

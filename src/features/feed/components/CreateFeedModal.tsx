'use client';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';

import { FeedForm } from './FeedForm';

interface CreateFeedModalProps {
    categories: any[];
}

export function CreateFeedModal({ categories }: CreateFeedModalProps) {
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
                Nueva Publicación
            </Button>
            <Modal open={isOpen} onClose={close} title="Nueva Publicación" size="lg">
                <FeedForm categories={categories} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
}

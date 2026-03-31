'use client';

import { useTransition } from 'react';

import { Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';

import { sendRecordatorioCuotasAction } from '../actions';

export function RecordatorioButton() {
    const [isPending, startTransition] = useTransition();

    function handleClick() {
        if (!confirm('¿Enviar recordatorio de pago a TODOS los miembros activos?')) return;
        startTransition(async () => {
            const result = await sendRecordatorioCuotasAction();
            if (result.success) {
                toast.success('Recordatorio enviado a todos los miembros.');
            } else {
                toast.error(result.error);
            }
        });
    }

    return (
        <Button variant="outline" onClick={handleClick} disabled={isPending}>
            <Mail className="mr-2 h-4 w-4" />
            {isPending ? 'Enviando…' : 'Recordatorio Pago'}
        </Button>
    );
}

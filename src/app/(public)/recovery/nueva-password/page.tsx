'use client';

import { useActionState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { confirmRecoveryAction } from '@/features/auth/actions';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export default function NuevaPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [state, action, isPending] = useActionState(confirmRecoveryAction, null);

    useEffect(() => {
        if (state?.success) {
            toast.success('Contraseña actualizada. Ahora puedes iniciar sesión.');
            router.push('/login');
        } else if (state && !state.success) {
            toast.error(state.error);
        }
    }, [state, router]);

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-red-500">Enlace inválido o expirado.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Nueva Contraseña</h1>
                <p className="mt-2 text-sm text-gray-500">Ingresa tu nueva contraseña.</p>
            </div>

            <form action={action} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                <input type="hidden" name="token" value={token} />

                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Nueva Contraseña *
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                        Confirmar Contraseña *
                    </label>
                    <Input
                        id="confirm"
                        name="confirm"
                        type="password"
                        placeholder="Repite tu contraseña"
                        required
                        minLength={6}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
            </form>
        </div>
    );
}

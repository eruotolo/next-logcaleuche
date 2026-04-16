'use client';

import { useActionState } from 'react';

import { Loader2, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

import { disable2FA } from '../actions';

export function TwoFactorDisable(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(disable2FA, null);

    // Show toast on success (component will be replaced by parent re-render)
    if (state?.success) {
        toast.success('2FA desactivado correctamente');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg bg-yellow-500/10 p-4">
                <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                <div>
                    <p className="text-sm font-medium text-[#e7e6fc]">
                        2FA está activo en tu cuenta
                    </p>
                    <p className="mt-1 text-xs text-[#aaa9be]">
                        Para desactivarlo debes confirmar con el código actual de tu app autenticadora.
                        Esto reducirá la seguridad de tu cuenta.
                    </p>
                </div>
            </div>

            {state && !state.success && (
                <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="disable-2fa-code"
                        className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                    >
                        Código TOTP actual
                    </label>
                    <input
                        id="disable-2fa-code"
                        name="code"
                        type="text"
                        inputMode="numeric"
                        placeholder="123 456"
                        maxLength={7}
                        autoComplete="one-time-code"
                        className="ag-input text-center tracking-widest text-lg"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Desactivando…
                        </>
                    ) : (
                        'Desactivar 2FA'
                    )}
                </button>
            </form>
        </div>
    );
}

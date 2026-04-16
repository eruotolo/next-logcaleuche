'use client';

import { useActionState, useState } from 'react';

import { useRouter } from 'next/navigation';

import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';

import { verify2FALogin } from '../actions';

interface TwoFactorVerifyProps {
    tempToken: string;
}

export function TwoFactorVerify({ tempToken }: TwoFactorVerifyProps): React.ReactElement {
    const [isBackupMode, setIsBackupMode] = useState(false);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(verify2FALogin, null);

    // verify2FALogin calls signIn which throws a redirect internally.
    // If for any reason signIn doesn't redirect (edge case), push manually.
    if (state?.success) {
        router.push('/dashboard');
    }

    return (
        <div className="ag-card w-full max-w-sm">
            {/* Header */}
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(90,103,216,0.18)]">
                    <ShieldCheck className="h-6 w-6 text-[#9ea7ff]" />
                </div>
                <div>
                    <h2 className="font-display text-xl font-bold text-[#e7e6fc]">
                        Verificación en dos pasos
                    </h2>
                    <p className="mt-1 text-sm text-[#aaa9be]">
                        {isBackupMode
                            ? 'Ingresa uno de tus códigos de respaldo (8 caracteres).'
                            : 'Ingresa el código de 6 dígitos de tu app autenticadora.'}
                    </p>
                </div>
            </div>

            {state && !state.success && (
                <div className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="tempToken" value={tempToken} />

                <div className="space-y-1.5">
                    <label
                        htmlFor="2fa-code"
                        className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                    >
                        {isBackupMode ? 'Código de respaldo' : 'Código de verificación'}
                    </label>
                    <input
                        id="2fa-code"
                        name="code"
                        type="text"
                        inputMode={isBackupMode ? 'text' : 'numeric'}
                        placeholder={isBackupMode ? 'XXXXXXXX' : '123 456'}
                        maxLength={isBackupMode ? 8 : 7}
                        autoComplete="one-time-code"

                        className="ag-input text-center tracking-widest text-lg"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="ag-btn flex w-full items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Verificando…
                        </>
                    ) : (
                        'Verificar'
                    )}
                </button>
            </form>

            {/* Toggle backup code mode */}
            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={() => setIsBackupMode((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#9ea7ff] hover:text-[#e7e6fc] transition-colors"
                >
                    <KeyRound className="h-3.5 w-3.5" />
                    {isBackupMode
                        ? 'Usar código de la app autenticadora'
                        : 'Usar código de respaldo'}
                </button>
            </div>

            {/* Back to login */}
            <div className="mt-3 text-center">
                <a
                    href="/login"
                    className="text-xs text-[#aaa9be] hover:text-[#e7e6fc] transition-colors"
                >
                    Volver al inicio de sesión
                </a>
            </div>
        </div>
    );
}

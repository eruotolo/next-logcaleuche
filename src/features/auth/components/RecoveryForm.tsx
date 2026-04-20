'use client';

import { useActionState } from 'react';

import Link from 'next/link';

import { recoveryAction } from '../actions';

export function RecoveryForm() {
    const [state, formAction, isPending] = useActionState(recoveryAction, null);

    if (state?.success) {
        return (
            <div className="space-y-4 text-center">
                <div className="ag-success-icon">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <p className="text-sm text-[#aaa9be]">
                    Si el correo ingresado está registrado, recibirás un enlace para restablecer tu
                    contraseña.
                </p>
                <Link href="/login" className="ag-link block">
                    ← Volver al inicio de sesión
                </Link>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-4">
            {state && !state.success && <div className="ag-alert-error">{state.error}</div>}

            <p className="text-sm text-[#aaa9be]">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu
                contraseña.
            </p>

            <div className="space-y-1.5">
                <label
                    htmlFor="email"
                    className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                >
                    Correo electrónico
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    autoComplete="email"
                    required
                    className="ag-input"
                />
            </div>

            <button type="submit" disabled={isPending} className="ag-btn mt-2">
                {isPending ? (
                    <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-label="Cargando">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Enviando…
                    </>
                ) : (
                    'Enviar enlace'
                )}
            </button>

            <div className="text-center">
                <Link href="/login" className="ag-link">
                    ← Volver al inicio de sesión
                </Link>
            </div>
        </form>
    );
}

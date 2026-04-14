'use client';

import { useActionState, useState } from 'react';

import Link from 'next/link';

import * as Tabs from '@radix-ui/react-tabs';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { cleanRut, formatRut } from '@/shared/lib/rut';

import { loginAction } from '../actions';

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const [showPassword, setShowPassword] = useState(false);
    const [rutDisplay, setRutDisplay] = useState('');

    function handleRutChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setRutDisplay(formatRut(e.target.value));
    }

    return (
        <form action={formAction} className="space-y-5">
            {state && !state.success && <div className="ag-alert-error">{state.error as string}</div>}

            {/* Tabs Email / RUT */}
            <Tabs.Root defaultValue="email" className="space-y-4">
                {/* Lista de tabs */}
                <Tabs.List className="flex gap-1 rounded-lg bg-white/5 p-1">
                    <Tabs.Trigger
                        value="email"
                        className="flex-1 rounded-md px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-all
                            text-[#aaa9be] hover:text-[#e7e6fc]
                            data-[state=active]:bg-white/10 data-[state=active]:text-[#e7e6fc] data-[state=active]:shadow-sm"
                    >
                        Email
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="rut"
                        className="flex-1 rounded-md px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-all
                            text-[#aaa9be] hover:text-[#e7e6fc]
                            data-[state=active]:bg-white/10 data-[state=active]:text-[#e7e6fc] data-[state=active]:shadow-sm"
                    >
                        RUT
                    </Tabs.Trigger>
                </Tabs.List>

                {/* Panel Email */}
                <Tabs.Content value="email" className="space-y-1.5">
                    <label
                        htmlFor="identifier-email"
                        className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                    >
                        Correo electrónico
                    </label>
                    <input
                        id="identifier-email"
                        name="identifier"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        autoComplete="email"
                        className="ag-input"
                    />
                </Tabs.Content>

                {/* Panel RUT */}
                <Tabs.Content value="rut" className="space-y-1.5">
                    <label
                        htmlFor="identifier-rut"
                        className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                    >
                        RUT
                    </label>
                    <input
                        id="identifier-rut"
                        type="text"
                        inputMode="numeric"
                        placeholder="12.345.678-9"
                        autoComplete="username"
                        className="ag-input"
                        value={rutDisplay}
                        onChange={handleRutChange}
                        maxLength={12}
                    />
                    <input type="hidden" name="identifier" value={cleanRut(rutDisplay)} />
                </Tabs.Content>
            </Tabs.Root>

            {/* Contraseña — compartida por ambas tabs */}
            <div className="space-y-1.5">
                <label
                    htmlFor="password"
                    className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                >
                    Contraseña
                </label>
                <div className="ag-input-wrap">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="ag-input ag-input-padded"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="ag-input-action"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            {/* Recordarme + Olvidé contraseña */}
            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" name="remember" className="ag-checkbox" />
                    <span className="text-sm text-[#aaa9be]">Recordarme</span>
                </label>
                <Link href="/recovery" className="ag-link">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <button type="submit" disabled={isPending} className="ag-btn mt-1">
                {isPending ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Ingresando…
                    </>
                ) : (
                    'Ingresar'
                )}
            </button>
        </form>
    );
}

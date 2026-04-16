'use client';

import { useActionState, useState, useTransition } from 'react';

import Image from 'next/image';

import { CheckCircle2, Copy, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';

import { confirm2FASetup, initiate2FASetup } from '../actions';

type SetupStep = 'idle' | 'qr' | 'codes' | 'verify' | 'done';

interface SetupData {
    qrDataUrl: string;
    backupCodes: string[];
    tempSecret: string;
}

export function TwoFactorSetup(): React.ReactElement | null {
    const [step, setStep] = useState<SetupStep>('idle');
    const [setupData, setSetupData] = useState<SetupData | null>(null);
    const [isPending, startTransition] = useTransition();

    const [confirmState, confirmAction, isConfirming] = useActionState(confirm2FASetup, null);

    function handleStart(): void {
        startTransition(async () => {
            const result = await initiate2FASetup();
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            setSetupData(result.data);
            setStep('qr');
        });
    }

    function handleCopyCode(code: string): void {
        navigator.clipboard.writeText(code).then(() => {
            toast.success('Código copiado');
        });
    }

    function handleCopyAllCodes(): void {
        if (!setupData) return;
        navigator.clipboard.writeText(setupData.backupCodes.join('\n')).then(() => {
            toast.success('Todos los códigos copiados');
        });
    }

    // Watch for successful confirm
    if (confirmState?.success && step !== 'done') {
        setStep('done');
        toast.success('2FA activado correctamente');
    }

    if (step === 'done') {
        return (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-7 w-7 text-green-400" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-[#e7e6fc]">
                        Autenticación de dos factores activada
                    </h3>
                    <p className="mt-1 text-sm text-[#aaa9be]">
                        Tu cuenta ahora requiere un código TOTP al iniciar sesión.
                    </p>
                </div>
            </div>
        );
    }

    if (step === 'idle') {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-white/[0.03] p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#9ea7ff]" />
                    <div>
                        <p className="text-sm font-medium text-[#e7e6fc]">
                            Autenticación de dos factores (2FA)
                        </p>
                        <p className="mt-1 text-xs text-[#aaa9be]">
                            Agrega una capa extra de seguridad usando una app como Google Authenticator o
                            Authy. Al iniciar sesión se te pedirá un código de 6 dígitos además de tu
                            contraseña.
                        </p>
                    </div>
                </div>
                <Button onClick={handleStart} loading={isPending} variant="primary" size="md">
                    Activar 2FA
                </Button>
            </div>
        );
    }

    if (step === 'qr' && setupData) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-[#e7e6fc]">
                        1. Escanea el código QR
                    </h3>
                    <p className="mt-1 text-xs text-[#aaa9be]">
                        Abre Google Authenticator, Authy u otra app compatible y escanea el código.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="rounded-xl bg-white p-3">
                        <Image
                            src={setupData.qrDataUrl}
                            alt="Código QR para 2FA"
                            width={180}
                            height={180}
                            unoptimized
                        />
                    </div>
                </div>

                <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="mb-1 text-[10px] font-semibold tracking-widest text-[#9a9ab0] uppercase">
                        Clave manual
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 break-all font-mono text-xs text-[#e7e6fc]">
                            {setupData.tempSecret}
                        </code>
                        <button
                            type="button"
                            onClick={() => handleCopyCode(setupData.tempSecret)}
                            className="shrink-0 text-[#9ea7ff] hover:text-[#e7e6fc] transition-colors"
                            title="Copiar clave"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <Button onClick={() => setStep('codes')} variant="primary" size="md">
                    Continuar
                </Button>
            </div>
        );
    }

    if (step === 'codes' && setupData) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-[#e7e6fc]">
                        2. Guarda tus códigos de respaldo
                    </h3>
                    <p className="mt-1 text-xs text-[#aaa9be]">
                        Estos códigos son de un solo uso. Guárdalos en un lugar seguro — si pierdes tu
                        dispositivo los necesitarás para acceder a tu cuenta.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {setupData.backupCodes.map((code) => (
                        <div
                            key={code}
                            className="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2"
                        >
                            <code className="font-mono text-xs tracking-widest text-[#e7e6fc]">
                                {code}
                            </code>
                            <button
                                type="button"
                                onClick={() => handleCopyCode(code)}
                                className="ml-2 shrink-0 text-[#9a9ab0] hover:text-[#9ea7ff] transition-colors"
                                title="Copiar"
                            >
                                <Copy className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleCopyAllCodes}
                    className="text-xs text-[#9ea7ff] hover:text-[#e7e6fc] transition-colors"
                >
                    Copiar todos los códigos
                </button>

                <Button onClick={() => setStep('verify')} variant="primary" size="md">
                    Los guardé, continuar
                </Button>
            </div>
        );
    }

    if (step === 'verify' && setupData) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-[#e7e6fc]">
                        3. Confirma tu app autenticadora
                    </h3>
                    <p className="mt-1 text-xs text-[#aaa9be]">
                        Ingresa el código de 6 dígitos que muestra tu app para verificar que todo está
                        configurado correctamente.
                    </p>
                </div>

                {confirmState && !confirmState.success && (
                    <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {confirmState.error}
                    </div>
                )}

                <form action={confirmAction} className="space-y-4">
                    <input type="hidden" name="tempSecret" value={setupData.tempSecret} />
                    <input
                        type="hidden"
                        name="backupCodes"
                        value={JSON.stringify(setupData.backupCodes)}
                    />

                    <div className="space-y-1.5">
                        <label
                            htmlFor="totp-confirm-code"
                            className="block text-xs font-medium tracking-wide text-[#aaa9be] uppercase"
                        >
                            Código de verificación
                        </label>
                        <input
                            id="totp-confirm-code"
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
                        disabled={isConfirming}
                        className="ag-btn flex w-full items-center justify-center gap-2"
                    >
                        {isConfirming ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Verificando…
                            </>
                        ) : (
                            'Activar 2FA'
                        )}
                    </button>
                </form>
            </div>
        );
    }

    return null;
}

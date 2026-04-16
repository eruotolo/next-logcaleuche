import type { Metadata } from 'next';

import { TwoFactorDisable } from '@/features/auth/components/TwoFactorDisable';
import { TwoFactorSetup } from '@/features/auth/components/TwoFactorSetup';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export const metadata: Metadata = {
    title: 'Seguridad — Logia Caleuche 250',
};

export default async function SeguridadPage(): Promise<React.ReactElement> {
    const session = await auth();
    // The (admin) layout guarantees session exists — safe to assert here
    const userId = Number(session?.user.id);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { twoFactorEnabled: true },
    });

    return (
        <div className="mx-auto max-w-xl px-4 py-8">
            {/* Page header */}
            <div className="mb-8">
                <p className="mb-1 text-xs font-medium tracking-widest text-[#9a9ab0] uppercase">
                    Perfil
                </p>
                <h1 className="font-display text-2xl font-bold text-[#e7e6fc]">Seguridad</h1>
                <p className="mt-1.5 text-sm text-[#aaa9be]">
                    Gestiona la autenticación de dos factores de tu cuenta.
                </p>
            </div>

            {/* 2FA Card */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
                <div className="mb-6 border-b border-white/[0.06] pb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-[#e7e6fc]">
                            Autenticación de dos factores
                        </h2>
                        {user?.twoFactorEnabled && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                Activo
                            </span>
                        )}
                    </div>
                </div>

                {user?.twoFactorEnabled ? <TwoFactorDisable /> : <TwoFactorSetup />}
            </div>
        </div>
    );
}

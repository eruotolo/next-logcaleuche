import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { TwoFactorVerify } from '@/features/auth/components/TwoFactorVerify';

export const metadata: Metadata = {
    title: 'Verificación en dos pasos — Logia Caleuche 250',
};

interface VerifyTwoFactorPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function VerifyTwoFactorPage({
    searchParams,
}: VerifyTwoFactorPageProps): Promise<React.ReactElement> {
    const { token } = await searchParams;
    if (!token) redirect('/login');

    return (
        <div className="ag-page">
            {/* Panel izquierdo — Branding (mismo layout que login) */}
            <div className="ag-brand-panel">
                <div className="ag-brand-logo">
                    <p className="ag-brand-name">Logia Caleuche Nº 250</p>
                    <p className="ag-brand-subtitle">Verificación segura &middot; Acceso protegido</p>
                </div>
            </div>

            {/* Panel derecho — Formulario 2FA */}
            <div className="ag-form-panel">
                <TwoFactorVerify tempToken={token} />
                <p className="mt-8 text-center text-xs text-[#464658]">
                    © 2026 Logia Caleuche 250
                </p>
            </div>
        </div>
    );
}

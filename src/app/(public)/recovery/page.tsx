import Image from 'next/image';

import type { Metadata } from 'next';

import { RecoveryForm } from '@/features/auth/components/RecoveryForm';
import { BrandStats } from '@/shared/components/layout/BrandStats';

export const metadata: Metadata = {
    title: 'Recuperar Contraseña — Logia Caleuche 250',
};

const Logo: string = 'logo-vectorizado-blanco.svg';

export default function RecoveryPage() {
    return (
        <div className="ag-page">
            {/* Panel izquierdo — Branding */}
            <div className="ag-brand-panel">
                <div className="ag-brand-logo">
                    <Image
                        src={Logo}
                        alt="Logia Caleuche 250"
                        width={140}
                        height={140}
                        className="h-auto w-[300px]"
                        priority
                    />
                    <h1 className="ag-brand-name">Logia Caleuche Nº 250</h1>
                    <p className="ag-brand-subtitle">Intranet Masónica &middot; Acceso Seguro</p>
                </div>

                {/* Stats decorativos */}
                <BrandStats />
            </div>

            {/* Panel derecho — Formulario */}
            <div className="ag-form-panel">
                <div className="ag-card">
                    {/* Encabezado */}
                    <div className="mb-8">
                        <p className="mb-2 text-xs font-medium tracking-widest text-[rgba(158,167,255,0.55)] uppercase">
                            Recuperación
                        </p>
                        <h2 className="font-display text-[1.75rem] font-bold tracking-tight text-[#e7e6fc]">
                            Recuperar Contraseña
                        </h2>
                        <p className="mt-1.5 text-sm text-[#aaa9be]">
                            Ingresa tu RUT para recibir instrucciones de recuperación.
                        </p>
                    </div>

                    <RecoveryForm />
                    
                </div>

                <p className="mt-8 text-center text-xs text-[#464658]">
                    © 2026 Logia Caleuche 250
                </p>
            </div>
        </div>
    );
}

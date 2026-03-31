import { redirect } from 'next/navigation';

import { InformeTesoreria } from '@/features/tesoreria/components/InformeTesoreria';

import { CATEGORIA, OFICIALIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';

export default async function InformePage() {
    const session = await auth();
    if (!session) redirect('/login');

    const isTesorero =
        session.user.oficialidad === OFICIALIDAD.TESORERO ||
        session.user.categoryId === CATEGORIA.SUPER_ADMIN;
    if (!isTesorero) redirect('/dashboard');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-cg-on-surface text-2xl font-bold">Informe de Tesorería</h1>
                <p className="text-cg-on-surface-variant text-sm">
                    Genera informes mensual, anual o por rango de fechas.
                </p>
            </div>
            <InformeTesoreria />
        </div>
    );
}

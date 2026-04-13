import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { getPagosUsuarioAno } from '@/features/tesoreria/actions';
import {
    getCategories,
    getGrados,
    getOficiales,
    getTarifas,
    getUsuarioById,
} from '@/features/usuarios/actions';
import { UserProfile } from '@/features/usuarios/components/UserProfile';

import { auth } from '@/shared/lib/auth';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const user = await getUsuarioById(Number.parseInt(id, 10));
    return {
        title: user
            ? `Perfil: ${user.name} ${user.lastName} — Logia Caleuche 250`
            : 'Usuario no encontrado',
    };
}

export default async function UsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const user = await getUsuarioById(Number.parseInt(id, 10));

    if (!user) {
        notFound();
    }

    const [grados, oficiales, categories, tarifas, pagos] = await Promise.all([
        getGrados(),
        getOficiales(),
        getCategories(),
        getTarifas(),
        getPagosUsuarioAno(user.id),
    ]);

    return (
        <UserProfile
            user={user}
            currentUser={session?.user}
            grados={grados}
            oficiales={oficiales}
            categories={categories}
            tarifas={tarifas}
            pagos={pagos}
        />
    );
}

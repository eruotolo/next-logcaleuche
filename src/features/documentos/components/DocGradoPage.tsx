import { redirect } from 'next/navigation';

import { getTiposActividad } from '@/features/eventos/actions';
import { getGrados, getUsuarios } from '@/features/usuarios/actions';

import { auth } from '@/shared/lib/auth';

import { getBiblioteca, getTrazados, getUserDocumentFavorites } from '../actions';
import { DocGradoList, type DocTipo } from './DocGradoList';
import { UploadDocGradoModal } from './UploadDocGradoModal';

interface DocGradoPageProps {
    tipo: DocTipo;
    gradoMin: number; // grado mínimo para acceder (1=todos, 2=compañero+, 3=maestro)
    redirectTo: string;
    titulo: string;
    subtitulo: string;
}

const fetchers: Record<DocTipo, (grado: number) => Promise<unknown[]>> = {
    biblioteca: getBiblioteca,
    trazado: getTrazados,
};

export async function DocGradoPage({
    tipo,
    gradoMin,
    redirectTo,
    titulo,
    subtitulo,
}: DocGradoPageProps) {
    const session = await auth();
    if (!session) redirect('/login');

    const userGrado = session.user.grado ?? 1;
    const isAdmin = session.user.categoryId <= 2;
    const canEdit = session.user.categoryId <= 3;

    if (userGrado < gradoMin && !isAdmin) redirect('/dashboard');

    const [rawItems, grados, allUsers, tiposActividad, allFavorites] = await Promise.all([
        fetchers[tipo](gradoMin),
        getGrados(),
        tipo === 'trazado' ? getUsuarios() : Promise.resolve([]),
        tipo === 'trazado' ? getTiposActividad() : Promise.resolve([]),
        getUserDocumentFavorites(),
    ]);

    const favoritedIds = allFavorites
        .filter((f) => f.documentType === tipo)
        .map((f) => f.documentId);

    // Biblioteca: Prisma returns `autor` (TS field name) but DocItem expects `autor_Libro`
    const items =
        tipo === 'biblioteca'
            ? (rawItems as Record<string, unknown>[]).map(({ autor, ...rest }) => ({
                  ...rest,
                  autor_Libro: autor,
              }))
            : rawItems;

    const usuarios = allUsers as { id: number; name: string | null; lastName: string | null }[];

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-cg-on-surface text-2xl font-bold">{titulo}</h1>
                    <p className="text-cg-on-surface-variant text-sm">{subtitulo}</p>
                </div>
                {isAdmin && (
                    <UploadDocGradoModal
                        tipo={tipo}
                        grados={grados}
                        usuarios={usuarios}
                        tiposActividad={tiposActividad as { id: number; nombre: string }[]}
                        redirectTo={redirectTo}
                    />
                )}
            </div>

            <DocGradoList
                tipo={tipo}
                items={items as Parameters<typeof DocGradoList>[0]['items']}
                isAdmin={isAdmin}
                canEdit={canEdit}
                favoritedIds={favoritedIds}
                grados={grados}
                usuarios={usuarios}
                tiposActividad={tiposActividad as { id: number; nombre: string }[]}
            />
        </div>
    );
}

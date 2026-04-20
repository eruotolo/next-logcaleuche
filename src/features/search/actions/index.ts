'use server';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

export interface SearchResult {
    type: 'usuario' | 'feed' | 'documento' | 'evento';
    label: string;
    sublabel?: string;
    href: string;
}

const LIMIT_PER_TYPE = 4;

export async function globalSearch(query: string): Promise<SearchResult[]> {
    const session = await auth();
    if (!session) throw new Error('No autorizado');

    const q = query.trim();
    if (q.length < 2) return [];

    const userGrado = session.user.grado;

    const [usuarios, feedPosts, biblioteca, trazados, documentos, eventos] = await Promise.all([
        prisma.user.findMany({
            where: {
                active: true,
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { lastName: { contains: q, mode: 'insensitive' } },
                ],
            },
            select: { id: true, name: true, lastName: true },
            take: LIMIT_PER_TYPE,
        }),
        prisma.feed.findMany({
            where: { active: 1, titulo: { contains: q, mode: 'insensitive' } },
            select: { slug: true, titulo: true },
            take: LIMIT_PER_TYPE,
        }),
        prisma.biblioteca.findMany({
            where: {
                nombre: { contains: q, mode: 'insensitive' },
                gradoId: { lte: userGrado },
            },
            select: { id: true, nombre: true, autor: true, fileName: true },
            take: LIMIT_PER_TYPE,
        }),
        prisma.trazado.findMany({
            where: {
                nombre: { contains: q, mode: 'insensitive' },
                gradoId: { lte: userGrado },
            },
            select: { id: true, nombre: true, fileName: true },
            take: LIMIT_PER_TYPE,
        }),
        prisma.document.findMany({
            where: { nombre: { contains: q, mode: 'insensitive' } },
            select: { id: true, nombre: true, fileName: true },
            take: LIMIT_PER_TYPE,
        }),
        prisma.evento.findMany({
            where: { active: 1, nombre: { contains: q, mode: 'insensitive' } },
            select: { id: true, nombre: true, fecha: true },
            take: LIMIT_PER_TYPE,
        }),
    ]);

    const results: SearchResult[] = [
        ...usuarios.map((u) => ({
            type: 'usuario' as const,
            label: [u.name, u.lastName].filter(Boolean).join(' ') || 'Usuario sin nombre',
            href: `/usuarios/${u.id}`,
        })),
        ...feedPosts.map((f) => ({
            type: 'feed' as const,
            label: f.titulo ?? 'Sin título',
            href: `/feed/${f.slug ?? ''}`,
        })),
        ...biblioteca.map((d) => ({
            type: 'documento' as const,
            label: d.nombre ?? 'Documento sin nombre',
            sublabel: d.autor ? `Biblioteca · ${d.autor}` : 'Biblioteca',
            href: d.fileName
                ? `/documentos/preview?fileName=${encodeURIComponent(d.fileName)}&nombre=${encodeURIComponent(d.nombre ?? '')}`
                : '/documentos',
        })),
        ...trazados.map((t) => ({
            type: 'documento' as const,
            label: t.nombre ?? 'Trazado sin nombre',
            sublabel: 'Trazados',
            href: `/documentos/preview?fileName=${encodeURIComponent(t.fileName)}&nombre=${encodeURIComponent(t.nombre ?? '')}`,
        })),
        ...documentos.map((d) => ({
            type: 'documento' as const,
            label: d.nombre ?? 'Documento sin nombre',
            sublabel: 'Documentos Generales',
            href: d.fileName
                ? `/documentos/preview?fileName=${encodeURIComponent(d.fileName)}&nombre=${encodeURIComponent(d.nombre ?? '')}`
                : '/documentos',
        })),
        ...eventos.map((e) => ({
            type: 'evento' as const,
            label: e.nombre,
            sublabel: e.fecha
                ? new Date(e.fecha).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                  })
                : undefined,
            href: '/eventos',
        })),
    ];

    return results.slice(0, 20);
}

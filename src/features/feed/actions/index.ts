'use server';

import { revalidatePath } from 'next/cache';

import { ACTIVITY_ACTION, ACTIVITY_ENTITY } from '@/shared/constants/activity-log';
import { auth } from '@/shared/lib/auth';
import { logActivity } from '@/shared/lib/activity-log';
import { requireAdmin } from '@/shared/lib/auth-guards';
import { uploadToCloudinary } from '@/shared/lib/cloudinary-upload';
import { prisma } from '@/shared/lib/db';
import { generateUniqueSlug } from '@/shared/lib/slugs';
import type { ActionResult } from '@/shared/types/actions';

import { CommentSchema, FeedPostSchema } from '../schemas';

export async function getFeedPosts(limit = 50) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.feed.findMany({
        where: { active: 1 },
        include: {
            category: true,
            user: {
                select: {
                    name: true,
                    lastName: true,
                    image: true,
                    gradoId: true,
                    grado: { select: { nombre: true } },
                },
            },
            _count: { select: { comments: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

export async function getFeedPostBySlug(slug: string) {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    const post = await prisma.feed.findUnique({
        where: { slug },
        include: {
            category: true,
            user: { select: { id: true, name: true, lastName: true, image: true } },
            comments: {
                include: {
                    user: { select: { name: true, lastName: true, image: true } },
                },
                orderBy: { createdAt: 'asc' },
            },
        },
    });

    if (!post) return { post: null, others: [] };

    const others = await prisma.feed.findMany({
        where: { active: 1, id: { not: post.id } },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    return { post, others };
}

export async function getCategoryFeeds() {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return prisma.categoryFeed.findMany({ orderBy: { id: 'asc' } });
}

export async function createFeedPost(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = FeedPostSchema.safeParse({
        titulo: formData.get('titulo'),
        category: formData.get('category'),
        contenido: formData.get('contenido'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Verifica los datos del formulario.' };
    }

    let fileName: string | null = null;
    const file = formData.get('file') as File | null;

    if (file && file.size > 0) {
        try {
            fileName = await uploadToCloudinary(file, 'logiacaleuche/feed', 'image');
        } catch {
            return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
        }
    }

    // Generar slug único
    const slug = await generateUniqueSlug('feed', parsed.data.titulo || 'publicacion');

    const post = await prisma.feed.create({
        data: {
            titulo: parsed.data.titulo,
            slug: slug,
            categoryId: parsed.data.category,
            contenido: parsed.data.contenido,
            fileName: fileName,
            userId: Number.parseInt(session.user.id, 10),
            active: 1,
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.FEED_CREATE,
        entity: ACTIVITY_ENTITY.FEED,
        entityId: post.id,
        description: `Creó publicación "${parsed.data.titulo}"`,
    });

    revalidatePath('/feed');
    return { success: true, data: null };
}

export async function updateFeedPost(
    id: number,
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = FeedPostSchema.safeParse({
        titulo: formData.get('titulo'),
        category: formData.get('category'),
        contenido: formData.get('contenido'),
    });

    if (!parsed.success) {
        return { success: false, error: 'Verifica los datos del formulario.' };
    }

    let fileName: string | null | undefined;
    const file = formData.get('file') as File | null;

    if (file && file.size > 0) {
        try {
            fileName = await uploadToCloudinary(file, 'logiacaleuche/feed', 'image');
        } catch {
            return { success: false, error: 'Error al subir el archivo. Intenta de nuevo.' };
        }
    }

    await prisma.feed.update({
        where: { id },
        data: {
            titulo: parsed.data.titulo,
            categoryId: parsed.data.category,
            contenido: parsed.data.contenido,
            ...(fileName !== undefined && { fileName }),
        },
    });

    await logActivity({
        action: ACTIVITY_ACTION.FEED_UPDATE,
        entity: ACTIVITY_ENTITY.FEED,
        entityId: id,
        description: `Editó publicación "${parsed.data.titulo}"`,
    });

    revalidatePath('/feed');
    return { success: true, data: null };
}

export async function deleteFeedPost(id: number): Promise<ActionResult<null>> {
    const session = await requireAdmin();
    if (!session) return { success: false, error: 'No autorizado' };

    await prisma.feed.update({ where: { id }, data: { active: 0 } });

    await logActivity({
        action: ACTIVITY_ACTION.FEED_DELETE,
        entity: ACTIVITY_ENTITY.FEED,
        entityId: id,
        description: `Eliminó publicación con ID ${id}`,
    });

    revalidatePath('/feed');
    return { success: true, data: null };
}

export async function addComment(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = CommentSchema.safeParse({
        feedId: formData.get('feedId'),
        message: formData.get('message'),
    });

    if (!parsed.success) return { success: false, error: 'Comentario inválido.' };

    await prisma.commentFeed.create({
        data: {
            userId: Number.parseInt(session.user.id, 10),
            feedId: parsed.data.feedId,
            message: parsed.data.message,
        },
    });

    revalidatePath('/feed');
    return { success: true, data: null };
}

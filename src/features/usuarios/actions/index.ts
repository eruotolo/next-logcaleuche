'use server';

import { revalidatePath } from 'next/cache';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { auth } from '@/shared/lib/auth';
import { requireAuth } from '@/shared/lib/auth-guards';
import { uploadToCloudinary } from '@/shared/lib/cloudinary-upload';
import { prisma } from '@/shared/lib/db';
import { generateUniqueSlug } from '@/shared/lib/slugs';
import type { ActionResult } from '@/shared/types/actions';

const ProfileSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    dateBirthday: z.string().optional(),
});

const UserCreateSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string().min(8),
    gradoId: z.coerce.number().int(),
    categoryId: z.coerce.number().int(),
});

const PasswordSchema = z
    .object({
        current: z.string().min(8),
        password: z.string().min(8),
        confirm: z.string().min(8),
    })
    .refine((d) => d.password === d.confirm, {
        message: 'Las contraseñas no coinciden',
        path: ['confirm'],
    });

export async function getUsuarios(limit = 200, includeInactive = false) {
    await requireAuth();
    return prisma.user.findMany({
        where: includeInactive ? undefined : { active: true },
        omit: { password: true, token: true, tokenExpiry: true },
        include: {
            grado: true,
            category: true,
            oficialidad: true,
        },
        orderBy: { name: 'asc' },
        take: limit,
    });
}

export async function getUsuarioById(id: number) {
    await requireAuth();
    return prisma.user.findUnique({
        where: { id },
        omit: { password: true, token: true, tokenExpiry: true },
        include: { grado: true, oficialidad: true, category: true, tarifa: true },
    });
}

export async function getGrados() {
    await requireAuth();
    return prisma.grado.findMany({ orderBy: { id: 'asc' } });
}

export async function getCategories() {
    await requireAuth();
    return prisma.userCategory.findMany({ orderBy: { id: 'asc' } });
}

export async function getOficiales() {
    await requireAuth();
    return prisma.oficial.findMany({ orderBy: { id: 'asc' } });
}

export async function getTarifas() {
    await requireAuth();
    return prisma.tarifaCuota.findMany({ orderBy: { monto: 'asc' } });
}

export async function assignTarifa(
    userId: number,
    cuotaId: number | null,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    await prisma.user.update({ where: { id: userId }, data: { cuotaId } });
    revalidatePath(`/usuarios/${userId}`);
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function createUser(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const parsed = UserCreateSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        return { success: false, error: 'Verifica los datos obligatorios.' };
    }

    // Verificar email o username duplicado
    const exists = await prisma.user.findFirst({
        where: {
            OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
        },
    });

    if (exists) {
        return { success: false, error: 'El email o RUT ya está registrado.' };
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);

    // Subir imagen si viene una
    let image: string | undefined;
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        try {
            image = await uploadToCloudinary(file, 'logiacaleuche/usuarios', 'image');
        } catch {
            return { success: false, error: 'Error al subir la imagen. Intenta de nuevo.' };
        }
    }

    // Generar slug único para el perfil
    const slug = await generateUniqueSlug('user', `${parsed.data.name} ${parsed.data.lastName}`);

    await prisma.user.create({
        data: {
            name: parsed.data.name,
            lastName: parsed.data.lastName,
            email: parsed.data.email,
            username: parsed.data.username,
            password: hashed,
            slug: slug,
            image: image,
            gradoId: parsed.data.gradoId,
            categoryId: parsed.data.categoryId,
            active: true,
        },
    });

    console.info('[AUDIT] createUser: nuevo usuario creado', {
        by: session.user.id,
        email: parsed.data.email,
        username: parsed.data.username,
        gradoId: parsed.data.gradoId,
    });

    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function updateProfile(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    const formDataUserId = formData.get('userId');
    const targetUserId = formDataUserId
        ? Number.parseInt(formDataUserId as string, 10)
        : Number.parseInt(session.user.id, 10);

    // Check permission: can only update self OR if admin (categoryId <= 2)
    if (String(targetUserId) !== session.user.id && session.user.categoryId > 2) {
        return { success: false, error: 'No autorizado para editar este perfil' };
    }

    const parsed = ProfileSchema.safeParse({
        name: formData.get('name'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        dateBirthday: formData.get('dateBirthday'),
    });

    if (!parsed.success) {
        console.error('Validation error profile:', parsed.error.format());
        return { success: false, error: 'Verifica los datos. Revisa campos obligatorios.' };
    }

    const currentUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!currentUser) return { success: false, error: 'Usuario no encontrado.' };

    // Verificar que el nuevo email no esté en uso por otro usuario
    if (parsed.data.email !== currentUser.email) {
        const emailTaken = await prisma.user.findFirst({
            where: { email: parsed.data.email, NOT: { id: targetUserId } },
            select: { id: true },
        });
        if (emailTaken)
            return { success: false, error: 'El email ya está en uso por otro usuario.' };
    }

    let image: string | undefined;
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        try {
            image = await uploadToCloudinary(file, 'logiacaleuche/usuarios', 'image');
        } catch (err) {
            console.error('Failed cloudinary upload:', err);
            return { success: false, error: 'Error al subir la imagen. Intenta de nuevo.' };
        }
    }

    // Si cambió el nombre/apellido, regenerar slug
    let slug = currentUser.slug;
    if (
        !slug ||
        parsed.data.name !== currentUser.name ||
        parsed.data.lastName !== currentUser.lastName
    ) {
        slug = await generateUniqueSlug(
            'user',
            `${parsed.data.name} ${parsed.data.lastName}`,
            'slug',
            'id',
            targetUserId,
        );
    }

    try {
        await prisma.user.update({
            where: { id: targetUserId },
            data: {
                name: parsed.data.name,
                lastName: parsed.data.lastName,
                email: parsed.data.email,
                slug: slug,
                phone: parsed.data.phone ?? null,
                address: parsed.data.address ?? null,
                city: parsed.data.city ?? null,
                dateBirthday: parsed.data.dateBirthday
                    ? new Date(parsed.data.dateBirthday)
                    : undefined,
                ...(image ? { image } : {}),
            },
        });
    } catch (e: unknown) {
        console.error('[updateProfile] Error al guardar en BD:', e);
        return { success: false, error: 'Error al guardar los datos. Intenta de nuevo.' };
    }

    revalidatePath('/perfil');
    revalidatePath('/usuarios');
    revalidatePath(`/usuarios/${targetUserId}`);

    return { success: true, data: null };
}

export async function updatePassword(
    _prev: ActionResult<null> | null,
    formData: FormData,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session) return { success: false, error: 'No autorizado' };

    const parsed = PasswordSchema.safeParse({
        current: formData.get('current'),
        password: formData.get('password'),
        confirm: formData.get('confirm'),
    });

    if (!parsed.success) {
        const err = parsed.error.flatten().fieldErrors;
        return { success: false, error: err.confirm?.[0] ?? 'Verifica los datos.' };
    }

    const user = await prisma.user.findUnique({
        where: { id: Number.parseInt(session.user.id, 10) },
    });
    if (!user) return { success: false, error: 'Usuario no encontrado.' };

    const match = await bcrypt.compare(parsed.data.current, user.password);
    if (!match) return { success: false, error: 'La contraseña actual es incorrecta.' };

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return { success: true, data: null };
}

export async function deactivateUsuario(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const hashed = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD ?? 'Cambiar2024!', 12);
    await prisma.user.update({ where: { id }, data: { active: false, password: hashed } });
    console.info('[AUDIT] deactivateUsuario:', { by: session.user.id, targetId: id });
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function resetPassword(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    const hashed = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD ?? 'Cambiar2024!', 12);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
    console.info('[AUDIT] resetPassword:', { by: session.user.id, targetId: id });
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function setAdmin(id: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId !== 1)
        return { success: false, error: 'No autorizado' };

    await prisma.user.update({ where: { id }, data: { categoryId: 2 } });
    console.info('[AUDIT] setAdmin:', { by: session.user.id, targetId: id });
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function updateUserCategory(
    userId: number,
    categoryId: number,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2)
        return { success: false, error: 'No autorizado' };

    // Solo superadmin puede asignar categoryId 1 (SuperAdmin)
    if (categoryId === 1 && session.user.categoryId !== 1)
        return { success: false, error: 'Solo el SuperAdmin puede asignar esa categoría' };

    // No puede cambiar su propia categoría
    if (String(userId) === session.user.id)
        return { success: false, error: 'No puedes cambiar tu propia categoría' };

    await prisma.user.update({ where: { id: userId }, data: { categoryId } });
    console.info('[AUDIT] updateUserCategory:', {
        by: session.user.id,
        targetId: userId,
        newCategoryId: categoryId,
    });
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function assignGrado(userId: number, gradoId: number): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    await prisma.user.update({ where: { id: userId }, data: { gradoId } });
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

export async function assignOficialidad(
    userId: number,
    oficialidadId: number,
): Promise<ActionResult<null>> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return { success: false, error: 'No autorizado' };

    await prisma.user.update({ where: { id: userId }, data: { oficialidadId } });
    revalidatePath('/usuarios');
    return { success: true, data: null };
}

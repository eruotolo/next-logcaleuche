import type { Session } from 'next-auth';

import { auth } from './auth';

export async function requireAuth(): Promise<Session> {
    const session = await auth();
    if (!session) throw new Error('No autorizado');
    return session;
}

export async function requireAdmin(): Promise<Session | null> {
    const session = await auth();
    if (!session || session.user.categoryId > 2) return null;
    return session;
}

export async function requireTesorero(): Promise<Session | null> {
    const session = await auth();
    if (
        !session ||
        (session.user.categoryId > 2 && session.user.oficialidad !== 7)
    )
        return null;
    return session;
}

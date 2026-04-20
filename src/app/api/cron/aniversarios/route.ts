import { createNotifications } from '@/features/notificaciones/actions';
import { prisma } from '@/shared/lib/db';
import { sendAniversario } from '@/shared/lib/email';

type UsuarioRow = {
    id: number;
    name: string | null;
    lastName: string | null;
    email: string;
    slug: string | null;
    dateInitiation: Date | null;
};

type AniversarioEntry = {
    usuario: UsuarioRow;
    anios: number;
};

function matchesToday(date: Date | null, day: number, month: number): boolean {
    if (!date) return false;
    const d = new Date(date);
    return d.getDate() === day && d.getMonth() + 1 === month;
}

function collectAniversarios(usuarios: UsuarioRow[], day: number, month: number, year: number): AniversarioEntry[] {
    const result: AniversarioEntry[] = [];
    for (const u of usuarios) {
        const initDate = u.dateInitiation;
        if (initDate && matchesToday(initDate, day, month)) {
            const anios = year - new Date(initDate).getFullYear();
            if (anios > 0) result.push({ usuario: u, anios });
        }
    }
    return result;
}

async function notifyAniversario(entry: AniversarioEntry, allUserIds: number[]): Promise<void> {
    const { usuario, anios } = entry;
    const nombre = `${usuario.name ?? ''} ${usuario.lastName ?? ''}`.trim();
    const aniosLabel = anios === 1 ? '1 año' : `${anios} años`;

    // Send email only if the aniversario user has opted in
    try {
        const emailPref = await prisma.notificationPreference.findUnique({
            where: { userId_type: { userId: usuario.id, type: 'aniversario' } },
            select: { email: true },
        });
        if (emailPref?.email === true) {
            await sendAniversario({ email: usuario.email, nombre, anios });
        }
    } catch {
        // Non-critical
    }

    // In-app notifications via createNotifications (respects inApp preferences)
    try {
        const destinatarios = allUserIds.filter((id) => id !== usuario.id);
        await createNotifications(
            destinatarios,
            'aniversario',
            `¡${aniosLabel} de Iniciación de Q∴H∴ ${nombre}!`,
            'Felicitemos a nuestro Hermano por este aniversario masónico.',
            usuario.slug ? `/usuarios/${usuario.slug}` : undefined,
        );
    } catch {
        // Non-critical
    }
}

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const [usuarios, todosLosIds] = await Promise.all([
        prisma.user.findMany({
            where: { active: true },
            select: { id: true, name: true, lastName: true, email: true, slug: true, dateInitiation: true },
        }),
        prisma.user.findMany({ where: { active: true }, select: { id: true } }),
    ]);

    const aniversarios = collectAniversarios(usuarios, day, month, year);

    if (aniversarios.length === 0) {
        return Response.json({ notified: 0, message: 'Sin aniversarios hoy' });
    }

    const allUserIds = todosLosIds.map((u) => u.id);

    for (const entry of aniversarios) {
        await notifyAniversario(entry, allUserIds);
    }

    return Response.json({ success: true, notified: aniversarios.length });
}

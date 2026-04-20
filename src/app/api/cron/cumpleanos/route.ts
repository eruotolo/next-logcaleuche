import { createNotifications } from '@/features/notificaciones/actions';
import { prisma } from '@/shared/lib/db';
import { sendCumpleanos } from '@/shared/lib/email';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const [usuarios, todosLosIds] = await Promise.all([
        prisma.user.findMany({
            where: { active: true, dateBirthday: { not: null } },
            select: { id: true, name: true, lastName: true, email: true, dateBirthday: true, slug: true },
        }),
        prisma.user.findMany({
            where: { active: true },
            select: { id: true },
        }),
    ]);

    const cumpleaneros = usuarios.filter((u) => {
        if (!u.dateBirthday) return false;
        const bday = new Date(u.dateBirthday);
        return bday.getDate() === day && bday.getMonth() + 1 === month;
    });

    if (cumpleaneros.length === 0) {
        return Response.json({ notified: 0, message: 'Sin cumpleaños hoy' });
    }

    const allUserIds = todosLosIds.map((u) => u.id);
    let notified = 0;

    for (const usuario of cumpleaneros) {
        const nombre = `${usuario.name ?? ''} ${usuario.lastName ?? ''}`.trim();

        // Send email only if the user has opted in
        try {
            const emailPref = await prisma.notificationPreference.findUnique({
                where: { userId_type: { userId: usuario.id, type: 'cumpleanos' } },
                select: { email: true },
            });
            if (emailPref?.email === true) {
                await sendCumpleanos({ email: usuario.email, nombre });
            }
        } catch {
            // Non-critical
        }

        // In-app notifications via createNotifications (respects inApp preferences)
        try {
            const destinatarios = allUserIds.filter((id) => id !== usuario.id);
            await createNotifications(
                destinatarios,
                'cumpleanos',
                `¡Hoy es el cumpleaños de Q∴H∴ ${nombre}!`,
                'Envíale un saludo fraternal.',
                usuario.slug ? `/usuarios/${usuario.slug}` : undefined,
            );
        } catch {
            // Non-critical
        }

        notified++;
    }

    return Response.json({
        success: true,
        notified,
        total: cumpleaneros.length,
    });
}

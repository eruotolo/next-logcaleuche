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

        try {
            await sendCumpleanos({ email: usuario.email, nombre });
        } catch {
            // No interrumpir el loop por un fallo individual de email
        }

        try {
            const destinatarios = allUserIds.filter((id) => id !== usuario.id);
            await prisma.notification.createMany({
                data: destinatarios.map((userId) => ({
                    userId,
                    type: 'cumpleanos',
                    title: `¡Hoy es el cumpleaños de Q∴H∴ ${nombre}!`,
                    message: 'Envíale un saludo fraternal.',
                    href: usuario.slug ? `/usuarios/${usuario.slug}` : null,
                })),
                skipDuplicates: true,
            });
        } catch {
            // No interrumpir si falla la notificación in-app
        }

        notified++;
    }

    return Response.json({
        success: true,
        notified,
        total: cumpleaneros.length,
    });
}

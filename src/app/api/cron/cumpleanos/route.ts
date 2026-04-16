import { prisma } from '@/shared/lib/db';
import { sendCumpleanos } from '@/shared/lib/email';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // getMonth() is 0-indexed

    // Buscar usuarios activos con cumpleaños hoy (mismo día y mes)
    const usuarios = await prisma.user.findMany({
        where: {
            active: true,
            dateBirthday: { not: null },
        },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            dateBirthday: true,
        },
    });

    // Filtrar en JS porque Prisma/PostgreSQL no tiene extracción de día/mes directa
    // sin SQL raw — mantenemos el patrón del proyecto
    const cumpleaneros = usuarios.filter((u) => {
        if (!u.dateBirthday) return false;
        const bday = new Date(u.dateBirthday);
        return bday.getDate() === day && bday.getMonth() + 1 === month;
    });

    if (cumpleaneros.length === 0) {
        return Response.json({ notified: 0, message: 'Sin cumpleaños hoy' });
    }

    let notified = 0;

    for (const usuario of cumpleaneros) {
        try {
            const nombre = `${usuario.name ?? ''} ${usuario.lastName ?? ''}`.trim();
            await sendCumpleanos({ email: usuario.email, nombre });
            notified++;
        } catch {
            // No interrumpir el loop por un fallo individual de email
        }
    }

    return Response.json({
        success: true,
        notified,
        total: cumpleaneros.length,
    });
}

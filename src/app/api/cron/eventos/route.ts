import { getProximaTenida, getUsuariosParaEvento } from '@/features/eventos/actions';

import { OFICIALIDAD } from '@/shared/constants/domain';
import { prisma } from '@/shared/lib/db';
import { sendInvitacionEvento } from '@/shared/lib/email';

// Event emails are mandatory — no preference filter applied
async function buildDestinatarios(
    gradoId: number,
    isTest: boolean,
): Promise<{ email: string; nombre: string }[]> {
    if (isTest) {
        const testEmail = process.env.CRON_TEST_EMAIL ?? '';
        return testEmail ? [{ email: testEmail, nombre: process.env.CRON_TEST_NAME ?? 'Test' }] : [];
    }

    const candidatos = await getUsuariosParaEvento(gradoId);
    return candidatos.map((u) => ({
        email: u.email,
        nombre: `${u.name ?? ''} ${u.lastName ?? ''}`.trim(),
    }));
}

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const evento = await getProximaTenida();
    if (!evento || !evento.gradoId || !evento.grado || !evento.fecha) {
        return Response.json({ message: 'No hay próximo evento programado' });
    }

    const [vm, secretario] = await Promise.all([
        prisma.user.findFirst({
            where: { oficialidadId: OFICIALIDAD.VENERABLE_MAESTRO, active: true },
            select: { name: true, lastName: true },
        }),
        prisma.user.findFirst({
            where: { oficialidadId: OFICIALIDAD.SECRETARIO, active: true },
            select: { name: true, lastName: true },
        }),
    ]);

    const isTest = new URL(request.url).searchParams.get('test') === 'true';
    const destinatarios = await buildDestinatarios(evento.gradoId, isTest);

    if (destinatarios.length === 0) {
        return Response.json({ message: 'No hay destinatarios para este evento' });
    }

    await sendInvitacionEvento({
        destinatarios,
        nombreVM: vm ? `${vm.name ?? ''} ${vm.lastName ?? ''}`.trim() : null,
        nombreSecretario: secretario ? `${secretario.name ?? ''} ${secretario.lastName ?? ''}`.trim() : null,
        evento: {
            nombre: evento.nombre,
            tipoActividad: evento.tipoActividad?.nombre ?? '',
            autor: evento.autor,
            fecha: evento.fecha,
            hora: evento.hora,
            lugar: evento.lugar,
            gradoId: evento.gradoId,
            gradoNombre: evento.grado.nombre,
        },
    });

    return Response.json({
        success: true,
        message: `Invitación enviada a ${destinatarios.length} hermanos`,
        evento: evento.nombre,
        grado: evento.grado.nombre,
        fecha: evento.fecha,
    });
}

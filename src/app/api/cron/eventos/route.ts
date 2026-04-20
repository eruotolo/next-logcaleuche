import { getProximaTenida, getUsuariosParaEvento } from '@/features/eventos/actions';

import { OFICIALIDAD } from '@/shared/constants/domain';
import { prisma } from '@/shared/lib/db';
import { sendInvitacionEvento } from '@/shared/lib/email';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const evento = await getProximaTenida();

    if (!evento || !evento.gradoId || !evento.grado || !evento.fecha) {
        return Response.json({ message: 'No hay próximo evento programado' });
    }

    // Traer el Venerable Maestro y Secretario activos
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
    const nombreVM = vm ? `${vm.name ?? ''} ${vm.lastName ?? ''}`.trim() : null;
    const nombreSecretario = secretario
        ? `${secretario.name ?? ''} ${secretario.lastName ?? ''}`.trim()
        : null;

    const url = new URL(request.url);
    const isTest = url.searchParams.get('test') === 'true';

    const testEmail = process.env.CRON_TEST_EMAIL ?? '';
    const testNombre = process.env.CRON_TEST_NAME ?? 'Test';
    const destinatarios = isTest
        ? testEmail
            ? [{ email: testEmail, nombre: testNombre }]
            : []
        : (await getUsuariosParaEvento(evento.gradoId)).map((u) => ({
              email: u.email,
              nombre: `${u.name ?? ''} ${u.lastName ?? ''}`.trim(),
          }));

    if (destinatarios.length === 0) {
        return Response.json({ message: 'No hay destinatarios para este evento' });
    }

    await sendInvitacionEvento({
        destinatarios,
        nombreVM,
        nombreSecretario,
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

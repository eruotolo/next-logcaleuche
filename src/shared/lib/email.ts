import nodemailer from 'nodemailer';

// Sanitiza texto para evitar inyección HTML en plantillas de email
function esc(text: string | null | undefined): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const TESORERO_FIRMA = process.env.EMAIL_TESORERO_NOMBRE ?? 'Tesorero';
const TESORERO_TEL = process.env.EMAIL_TESORERO_TEL ?? '';
const TESORERO_EMAIL = process.env.EMAIL_TESORERO_EMAIL ?? '';
const TESORERO_ADJUNTO = process.env.EMAIL_TESORERO_ADJUNTO ?? '';

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST ?? 'smtp-relay.brevo.com',
    port: Number(process.env.BREVO_PORT ?? 587),
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
    },
});

const FROM_EMAIL = process.env.BREVO_FROM ?? 'tesoreria@logiacaleuche.cl';
const FROM_NAME = process.env.BREVO_FROM_NAME ?? 'Tesoreria R∴ L∴ Caleuche 250';
const FROM = `"${FROM_NAME}" <${FROM_EMAIL}>`;

const NOREPLY_EMAIL = process.env.BREVO_NOREPLY ?? 'noreply@logiacaleuche.cl';
const NOREPLY_FROM = `"R∴L∴ Caleuche 250" <${NOREPLY_EMAIL}>`;

function formatMonto(monto: number): string {
    return monto.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatFecha(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
}

function boletaHtml(data: {
    id: number;
    nombre: string;
    mes: string;
    ano: string;
    motivo: string;
    fecha: Date;
    monto: number;
    saldoPendiente?: number;
}): string {
    const mesCortado = data.mes.includes(' - ') ? data.mes.split(' - ')[1] : data.mes;
    const saldoHtml =
        data.saldoPendiente !== undefined
            ? `
      <div style="width:100%;padding:0 20px 20px 20px;box-sizing:border-box;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;min-width:600px;">
          <tr>
            <td style="border:1px solid #000000;padding:10px;font-size:12px;font-weight:bold;">
              Saldo pendiente de cuotas — Año ${data.ano}
            </td>
            <td style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;font-weight:bold;${data.saldoPendiente === 0 ? 'color:#41a65a;' : 'color:#e67e22;'}">
              ${data.saldoPendiente === 0 ? 'Al dia' : `$ ${formatMonto(data.saldoPendiente)}`}
            </td>
          </tr>
        </table>
      </div>`
            : '';
    return `
    <div style="max-width:840px;width:100%;margin:0 auto;border:1px solid #000000;box-sizing:border-box;">
      <div style="display:block;">
        <div style="width:100%;padding:20px;box-sizing:border-box;text-align:center;">
          <img src="https://intranet.logiacaleuche.cl/admin/assets/images/logo.jpg" style="max-width:160px;width:100%;height:auto;" alt="Logo">
        </div>
        <div style="width:100%;padding:0 20px 20px 20px;box-sizing:border-box;">
          <p style="text-align:right;font-size:16px;font-weight:600;margin-top:1px;margin-bottom:10px;">Boleta N° ${data.id}</p>
          <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:1px;margin-bottom:1px;">Respetable Logia Caleuche 250</p>
          <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:1px;margin-bottom:1px;">Valle de Castro - Chiloé</p>
        </div>
      </div>
      <div style="width:100%;padding:20px;box-sizing:border-box;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;min-width:600px;">
          <thead>
            <tr>
              <th style="border:1px solid #000000;padding:10px;font-size:12px;">Nombre Q∴H∴</th>
              <th style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">Mes Cuota</th>
              <th style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">Año</th>
              <th style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">Motivo</th>
              <th style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">Fecha de Pago</th>
              <th style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000000;padding:10px;font-size:12px;">${data.nombre}</td>
              <td style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">${mesCortado}</td>
              <td style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">${data.ano}</td>
              <td style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">${data.motivo}</td>
              <td style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">${formatFecha(data.fecha)}</td>
              <td style="border:1px solid #000000;padding:10px;text-align:center;font-size:12px;">$ ${formatMonto(data.monto)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ${saldoHtml}
    </div>
    <div style="margin-top:30px;padding:0 20px;">
      <p>Le agradecemos por su puntualidad y compromiso con las obligaciones financieras de nuestra Logia.</p>
      <p>Si tiene alguna pregunta o necesita información adicional, no dude en ponerse en contacto con mi persona.</p><br />
      <p>Un Triple Abrazo Fraternal.</p>
      <p>Q∴H∴ Tesor. ${esc(TESORERO_FIRMA)}${TESORERO_TEL ? `<br /> Tel: ${esc(TESORERO_TEL)}` : ''}${TESORERO_EMAIL ? `<br /> Email: ${esc(TESORERO_EMAIL)}` : ''}</p>
    </div>`;
}

export async function sendBoleta(data: {
    id: number;
    emailDestino: string;
    nombreDestino: string;
    nombre: string;
    mes: string;
    ano: string;
    motivo: string;
    fecha: Date;
    monto: number;
    saldoPendiente?: number;
}) {
    await transporter.sendMail({
        from: FROM,
        to: `"${data.nombreDestino}" <${data.emailDestino}>`,
        subject: 'Boleta de Pago de Cuota Logial',
        html: boletaHtml(data),
        text: 'No responder a este correo, Muchas gracias.',
    });
}

export async function sendRecordatorioCuotas(emails: string[]) {
    if (emails.length === 0) return;
    await transporter.sendMail({
        from: FROM,
        to: FROM_EMAIL,
        bcc: emails.join(','),
        subject: 'Recordatorio de Pago de Cuotas Logiales',
        html: `
            Estimados QQ∴HH∴,<br><br>
            Junto con saludarles fraternalmente, nos dirigimos a ustedes para recordarles la importancia de mantener al día el pago de sus cuotas logiales.<br><br>
            Como es de su conocimiento, el compromiso de cada uno de nosotros es vital para el correcto sostenimiento de nuestro Taller, permitiéndonos cumplir con nuestras actividades, proyectos y obligaciones institucionales ante la Gran Logia.<br><br>
            Les invitamos a regularizar su situación financiera a la brevedad posible. En caso de presentar alguna dificultad o tener dudas sobre sus saldos, les solicitamos ponerse en contacto directo con la Tesorería para buscar, en conjunto, la mejor solución.<br><br>
            Agradecemos de antemano su fraternidad y compromiso constante con nuestra querida Logia.<br><br>
            Reciban un fuerte y fraternal abrazo.<br><br>
            <b>Tesorería R∴ L∴ Caleuche 250</b><br>
            Q∴H∴ Tesorero. ${esc(TESORERO_FIRMA)}<br>
            ${TESORERO_ADJUNTO ? `Q∴H∴ Tesorero Adjunto. ${esc(TESORERO_ADJUNTO)}<br>` : ''}
            ${TESORERO_EMAIL ? `Email: ${esc(TESORERO_EMAIL)}<br>` : ''}
            ${TESORERO_TEL ? `Tel: ${esc(TESORERO_TEL)}` : ''}
        `,
    });
}

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
];

function saludoPorGrado(gradoId: number): string {
    if (gradoId === 3) return 'Queridos Hermanos VV∴MM∴';
    if (gradoId === 2) return 'Queridos Hermanos VV∴CC∴';
    return 'Queridos Hermanos AA∴';
}

function nombreTenida(gradoId: number): string {
    if (gradoId === 3) return 'Tercer Grado';
    if (gradoId === 2) return 'Segundo Grado';
    return 'Primer Grado';
}

export async function sendInvitacionEvento(params: {
    destinatarios: { email: string; nombre: string }[];
    nombreVM: string | null;
    nombreSecretario: string | null;
    evento: {
        nombre: string;
        trabajo: string;
        autor?: string | null;
        fecha: Date;
        hora?: string | null;
        lugar?: string | null;
        gradoId: number;
        gradoNombre: string;
    };
}): Promise<void> {
    const { destinatarios, nombreVM, nombreSecretario, evento } = params;
    if (destinatarios.length === 0) return;

    const fecha = new Date(evento.fecha);
    const diaNombre = DIAS_SEMANA[fecha.getUTCDay()];
    const diaNum = fecha.getUTCDate();
    const mesNombre = MESES[fecha.getUTCMonth()];
    const anio = fecha.getUTCFullYear();

    const horaStr = evento.hora ?? '20:00';
    const lugarStr = evento.lugar ?? 'Casa Masónica de Castro';
    const saludo = saludoPorGrado(evento.gradoId);
    const tenida = nombreTenida(evento.gradoId);

    const tratamientoAutor = evento.gradoId === 3 ? 'V∴M∴' : 'Q∴H∴';
    const tratamientoRM = evento.gradoId === 3 ? 'R∴M∴' : 'V∴M∴';

    const autorLinea = evento.autor
        ? `<div style="margin:0 0 16px 0;padding:12px 20px;border-left:3px solid #2980b9;background:#f0f7ff;">
               <p style="margin:0 0 6px 0;"><strong>Tema:</strong> <em>"${esc(evento.nombre)}"</em></p>
               <p style="margin:0;"><strong>Autor:</strong> ${esc(tratamientoAutor)} ${esc(evento.autor)}</p>
           </div>`
        : `<div style="margin:0 0 16px 0;padding:12px 20px;border-left:3px solid #2980b9;background:#f0f7ff;">
               <p style="margin:0;"><strong>Tema:</strong> <em>"${esc(evento.nombre)}"</em></p>
           </div>`;

    const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a;">
        <div style="text-align:center;padding:24px 0 16px 0;border-bottom:2px solid #2980b9;">
            <img src="https://www.logiacaleuche.cl/logo.jpg"
                 style="max-width:120px;width:100%;height:auto;" alt="R∴L∴ Caleuche 250">
            <p style="margin:8px 0 0 0;font-size:13px;letter-spacing:2px;color:#2980b9;text-transform:uppercase;">
                Respetable Logia Caleuche N°250
            </p>
            <p style="margin:2px 0 0 0;font-size:12px;color:#888;">Valle de Castro — Chiloé</p>
        </div>

        <div style="padding:32px 24px;">
            <p style="font-size:18px;font-weight:bold;margin:0 0 24px 0;">${saludo},</p>

            <p style="margin:0 0 16px 0;line-height:1.7;">
                Por especial encargo de nuestro <strong>${tratamientoRM}${nombreVM ? ` ${nombreVM}` : ''}</strong>, cito a ustedes a
                <strong>Tenida de ${tenida}</strong>, a realizarse el día
                <strong>${diaNombre} ${diaNum} de ${mesNombre} de ${anio}</strong>,
                a las <strong>${horaStr} hrs.</strong>, en <strong>${lugarStr}</strong>.
            </p>

            ${autorLinea}

            <p style="margin:0 0 16px 0;line-height:1.7;">
                Esperamos contar con la presencia de todos los Hermanos para aportar
                fuerza y vigor a nuestros trabajos.
            </p>

            <div style="margin-top:32px;padding-top:20px;border-top:1px solid #ddd;">
                <p style="margin:0 0 12px 0;">Les saluda fraternalmente,</p>
                <p style="margin:0;font-weight:bold;">Q∴H∴ Secretario ${nombreSecretario ? ` ${nombreSecretario}` : ''}</p>
                <p style="margin:0;color:#2980b9;">R∴L∴ Caleuche N°250 del Valle de Castro</p>
            </div>
        </div>

        <div style="padding:12px 24px;background:#f5f5f5;border-top:1px solid #ddd;text-align:center;">
            <p style="margin:0;font-size:11px;color:#999;">
                Este es un mensaje automático del sistema de la logia. Por favor no responder.
            </p>
        </div>
    </div>`;

    const bccEmails = destinatarios.map((d) => d.email).join(',');

    await transporter.sendMail({
        from: NOREPLY_FROM,
        to: NOREPLY_EMAIL,
        bcc: bccEmails,
        subject: `Convocatoria — Tenida de ${tenida} · ${diaNombre} ${diaNum} de ${mesNombre}`,
        html,
    });
}

export async function sendRecovery(
    emailDestino: string,
    nombre: string,
    token: string,
    baseUrl: string,
) {
    const link = `${baseUrl}/recovery/nueva-password?token=${token}`;
    await transporter.sendMail({
        from: FROM,
        to: `"${nombre}" <${emailDestino}>`,
        subject: 'Recuperación de Contraseña — Logia Caleuche 250',
        html: `
            <div style="max-width:600px;margin:0 auto;font-family:sans-serif;">
                <h2>Recuperación de Contraseña</h2>
                <p>Q∴H∴ ${nombre},</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la Intranet Logia Caleuche 250.</p>
                <p>Haz clic en el siguiente enlace para crear una nueva contraseña (válido por 24 horas):</p>
                <p style="margin:24px 0;">
                  <a href="${link}" style="background:#2980b9;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
                    Restablecer Contraseña
                  </a>
                </p>
                <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                <br>
                <p>Un Triple Abrazo Fraternal.</p>
                <p><b>Intranet R∴ L∴ Caleuche 250</b></p>
            </div>
        `,
    });
}

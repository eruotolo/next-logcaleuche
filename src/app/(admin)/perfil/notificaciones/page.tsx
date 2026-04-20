import type { Metadata } from 'next';

import { NotificationPreferencesForm } from '@/features/notificaciones/components/NotificationPreferencesForm';
import { getNotificationPreferences } from '@/features/notificaciones/actions';

export const metadata: Metadata = {
    title: 'Notificaciones — Logia Caleuche 250',
};

export default async function NotificacionesPage(): Promise<React.ReactElement> {
    const rawPrefs = await getNotificationPreferences();

    const preferences = Object.fromEntries(
        rawPrefs.map((p) => [p.type, { inApp: p.inApp, email: p.email }]),
    );

    return (
        <div className="mx-auto max-w-xl px-4 py-8">
            <div className="mb-8">
                <p className="mb-1 text-xs font-medium tracking-widest text-[#9a9ab0] uppercase">
                    Perfil
                </p>
                <h1 className="font-display text-2xl font-bold text-[#e7e6fc]">Notificaciones</h1>
                <p className="mt-1.5 text-sm text-[#aaa9be]">
                    Elige qué notificaciones recibir en la intranet y por correo.
                </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
                <div className="mb-4 border-b border-white/[0.06] pb-4">
                    <h2 className="text-sm font-semibold text-[#e7e6fc]">Preferencias de notificación</h2>
                    <p className="mt-1 text-xs text-[#747487]">
                        Los cambios se aplican de inmediato.
                    </p>
                </div>

                <NotificationPreferencesForm preferences={preferences} />
            </div>
        </div>
    );
}

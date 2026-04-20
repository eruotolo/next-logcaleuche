'use client';

import { useTransition } from 'react';

import { toast } from 'sonner';

import { updateNotificationPreference } from '@/features/notificaciones/actions';

const NOTIFICATION_TYPES = [
    { key: 'feed', label: 'Publicaciones del Feed', desc: 'Cuando alguien publica en el feed' },
    { key: 'comment', label: 'Comentarios', desc: 'Comentarios en tus publicaciones' },
    { key: 'evento', label: 'Eventos', desc: 'Nuevos eventos de la Logia' },
    { key: 'biblioteca', label: 'Biblioteca', desc: 'Nuevos documentos de biblioteca' },
    { key: 'trazado', label: 'Trazados', desc: 'Nuevos trazados publicados' },
    { key: 'cumpleanos', label: 'Cumpleaños', desc: 'Cumpleaños de Hermanos' },
    { key: 'aniversario', label: 'Aniversarios de Iniciación', desc: 'Aniversarios masónicos de Hermanos' },
] as const;

interface PreferenceMap {
    [type: string]: { inApp: boolean; email: boolean };
}

interface NotificationPreferencesFormProps {
    preferences: PreferenceMap;
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled: boolean }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            disabled={disabled}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-40 ${
                checked ? 'bg-[rgba(90,103,216,0.85)]' : 'bg-white/[0.1]'
            }`}
        >
            <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    checked ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
            />
        </button>
    );
}

export function NotificationPreferencesForm({ preferences }: NotificationPreferencesFormProps) {
    const [isPending, startTransition] = useTransition();

    function handleToggle(type: string, field: 'inApp' | 'email', currentValue: boolean) {
        startTransition(async () => {
            const result = await updateNotificationPreference(type, field, !currentValue);
            if (!result.success) {
                toast.error('No se pudo guardar el cambio.');
            }
        });
    }

    return (
        <div className="divide-y divide-white/[0.05]">
            {/* Cabecera de columnas */}
            <div className="mb-2 grid grid-cols-[1fr_80px_80px] items-center px-1 pb-3">
                <span className="text-xs font-medium text-[#9a9ab0]" />
                <span className="text-center text-xs font-medium text-[#9a9ab0]">Intranet</span>
                <span className="text-center text-xs font-medium text-[#9a9ab0]">Email</span>
            </div>

            {NOTIFICATION_TYPES.map(({ key, label, desc }) => {
                const pref = preferences[key] ?? { inApp: true, email: false };
                return (
                    <div key={key} className="grid grid-cols-[1fr_80px_80px] items-center gap-2 py-4 px-1">
                        <div>
                            <p className="text-sm font-medium text-[#e7e6fc]">{label}</p>
                            <p className="text-xs text-[#747487]">{desc}</p>
                        </div>
                        <div className="flex justify-center">
                            <Toggle
                                checked={pref.inApp}
                                onChange={() => handleToggle(key, 'inApp', pref.inApp)}
                                disabled={isPending}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Toggle
                                checked={pref.email}
                                onChange={() => handleToggle(key, 'email', pref.email)}
                                disabled={isPending}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

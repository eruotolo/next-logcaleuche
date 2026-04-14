import Image from 'next/image';

import { Cake } from 'lucide-react';

import { getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';
import { getMesNombre } from '@/shared/lib/utils';

interface BirthdayUser {
    id: number;
    name: string | null;
    lastName: string | null;
    image: string | null;
    nextBirthday: Date;
    daysUntil: number;
}

interface BirthdayCardProps {
    birthdays: BirthdayUser[];
    maxItems?: number;
    className?: string;
}

function formatBirthdayDate(date: Date): string {
    const day = date.getUTCDate();
    const month = getMesNombre(date.getUTCMonth() + 1);
    return `${day} de ${month}`;
}

function DaysLabel({ daysUntil, nextBirthday }: { daysUntil: number; nextBirthday: Date }): React.ReactNode {
    if (daysUntil === 0) {
        return (
            <span className="bg-cg-tertiary/15 text-cg-tertiary-tonal rounded-full px-2 py-0.5 text-[11px] font-semibold">
                ¡Hoy!
            </span>
        );
    }
    if (daysUntil <= 7) {
        return (
            <span className="bg-cg-primary-tonal/10 text-cg-primary-tonal rounded-full px-2 py-0.5 text-[11px] font-medium">
                en {daysUntil} {daysUntil === 1 ? 'día' : 'días'}
            </span>
        );
    }
    return (
        <span className="text-cg-outline text-[11px]">{formatBirthdayDate(nextBirthday)}</span>
    );
}

export function BirthdayCard({ birthdays, maxItems = 6, className = '' }: BirthdayCardProps) {
    return (
        <div className={`flex flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                <div className="flex items-center gap-2">
                    <Cake className="text-cg-tertiary-tonal h-4 w-4" />
                    <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                        Próximos Cumpleaños
                    </h2>
                </div>
                <span className="text-cg-outline text-xs">próximos {maxItems}</span>
            </div>

            {/* Lista */}
            <div className="flex-1 divide-y divide-[rgba(255,255,255,0.05)] px-6">
                {birthdays.length === 0 ? (
                    <div className="text-cg-outline py-12 text-center text-sm italic">
                        No hay cumpleaños registrados.
                    </div>
                ) : (
                    birthdays.slice(0, maxItems).map((user) => {
                        const initials = `${user.name?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
                        return (
                            <div key={user.id} className="flex items-center gap-4 py-3.5">
                                {/* Avatar */}
                                {user.image ? (
                                    <Image
                                        src={getCloudinaryRawImageUrl(user.image) ?? ''}
                                        alt={`${user.name} ${user.lastName}`}
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-cg-surface-high text-cg-primary-tonal flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                                        {initials || 'HH'}
                                    </div>
                                )}

                                {/* Nombre */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-cg-on-surface truncate text-sm font-medium">
                                        {user.name} {user.lastName}
                                    </p>
                                    <p className="text-cg-outline text-xs">
                                        {formatBirthdayDate(user.nextBirthday)}
                                    </p>
                                </div>

                                {/* Badge de días */}
                                <DaysLabel daysUntil={user.daysUntil} nextBirthday={user.nextBirthday} />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

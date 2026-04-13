import Link from 'next/link';

import { BirthdayCard } from '@/shared/components/BirthdayCard';
import { FeedNewsList } from '@/shared/components/FeedNewsList';
import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';
import { GRADO_LABEL } from '@/shared/constants/domain';

interface BirthdayUser {
    id: number;
    name: string | null;
    lastName: string | null;
    image: string | null;
    nextBirthday: Date;
    daysUntil: number;
}

interface FeedSidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    posts: any[];
    eventos: {
        id: number;
        nombre: string;
        trabajo: string | null;
        fecha: Date | null;
        hora: string | null;
        gradoId: number | null;
    }[];
    upcomingBirthdays: BirthdayUser[];
    totalPosts: number;
}

export function FeedSidebar({ posts, eventos, upcomingBirthdays, totalPosts }: FeedSidebarProps) {
    return (
        <aside className="space-y-8">
            {/* Feed de Noticias */}
            <section className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-6 py-4">
                    <h2 className="font-display text-cg-on-surface text-[15px] font-semibold">
                        Feed de Noticias
                    </h2>
                    <Link
                        href="/feed"
                        className="text-cg-primary-tonal text-xs font-medium transition-colors hover:underline"
                    >
                        Ver todo
                    </Link>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.05)] px-6">
                    <FeedNewsList posts={posts} maxItems={5} titleMaxLength={60} />
                </div>
            </section>

            {/* Próximos Eventos */}
            <UpcomingEventsList
                eventos={eventos.slice(0, 6).map((ev) => ({
                    id: ev.id,
                    nombre: ev.nombre,
                    trabajo: ev.trabajo,
                    fecha: ev.fecha ? new Date(ev.fecha) : null,
                    hora: ev.hora ?? null,
                    grado: ev.gradoId
                        ? {
                              id: ev.gradoId,
                              nombre: GRADO_LABEL[ev.gradoId] ?? '',
                          }
                        : null,
                }))}
                maxItems={6}
                showHora={true}
                showGradoBadge={true}
                showLink={true}
                linkText="Ver todos"
                emptyMessage="No hay eventos para este mes."
            />

            {/* Próximos Cumpleaños */}
            <BirthdayCard birthdays={upcomingBirthdays} />

        </aside>
    );
}

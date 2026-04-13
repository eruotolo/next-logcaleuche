import Link from 'next/link';

import { BirthdayCard } from '@/features/dashboard/components/BirthdayCard';
import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';
import { formatDate, truncate } from '@/shared/lib/utils';

const GRADO_LABEL: Record<number, string> = { 1: 'Aprendiz', 2: 'Compañero', 3: 'Maestro' };

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
                    {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex items-start gap-4 py-4">
                            <div className="bg-cg-surface-high text-cg-primary-tonal flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                {post.user?.name?.[0] ?? 'U'}
                                {post.user?.lastName?.[0] ?? ''}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <Link href={`/feed/${post.slug}`}>
                                        <span className="text-cg-on-surface hover:text-cg-primary-tonal text-sm font-semibold">
                                            {truncate(post.titulo ?? '', 60)}
                                        </span>
                                    </Link>
                                    <span className="text-cg-outline shrink-0 text-xs">
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>
                                <span className="text-cg-on-surface-variant mt-1 block text-sm">
                                    {post.user?.name} {post.user?.lastName}
                                </span>
                                {post.category && (
                                    <span className="bg-cg-surface-high text-cg-on-surface-variant mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium">
                                        {post.category.nombre}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="text-cg-outline py-12 text-center text-sm italic">
                            No hay publicaciones disponibles.
                        </div>
                    )}
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

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { UpcomingEventsList } from '@/shared/components/UpcomingEventsList';
import { getCloudinaryImageUrl } from '@/shared/lib/cloudinary';

interface FeedSidebarProps {
    usuarios: {
        id: number;
        name: string | null;
        lastName: string | null;
        image: string | null;
        grado?: { nombre: string } | null;
    }[];
    eventos: {
        id: number;
        nombre: string;
        fecha: Date | null;
    }[];
    totalPosts: number;
}

export function FeedSidebar({ usuarios, eventos, totalPosts }: FeedSidebarProps) {
    return (
        <aside className="space-y-8">
            {/* Hermanos Activos */}
            <section className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] p-6 backdrop-blur-[20px]">
                <h2 className="font-display text-cg-primary-tonal mb-6 border-b border-[rgba(255,255,255,0.1)] pb-4 text-lg font-bold">
                    Hermanos Activos
                </h2>
                <div className="space-y-5">
                    {usuarios.slice(0, 7).map((u) => (
                        <Link
                            key={u.id}
                            href={`/usuarios/${u.id}`}
                            className="group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-[rgba(255,255,255,0.1)]">
                                        <AvatarImage
                                            src={
                                                u.image ? getCloudinaryImageUrl(u.image) : undefined
                                            }
                                        />
                                        <AvatarFallback className="text-cg-primary-tonal bg-[rgba(90,103,216,0.2)] text-xs font-bold">
                                            {u.name?.[0]}
                                            {u.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-cg-tertiary-tonal absolute right-0 bottom-0 h-3 w-3 animate-pulse rounded-full border-2 border-[#17182a]" />
                                </div>
                                <div>
                                    <p className="text-cg-on-surface group-hover:text-cg-primary-tonal text-sm font-bold transition-colors">
                                        {u.name} {u.lastName}
                                    </p>
                                    {u.grado && (
                                        <p className="text-cg-on-surface-variant text-[10px] uppercase">
                                            {u.grado.nombre}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <ChevronRight className="text-cg-primary-tonal/40 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Eventos Próximos */}
            <UpcomingEventsList
                eventos={eventos}
                maxItems={3}
                showTrabajo={false}
                showGradoBadge={false}
                title="Eventos Próximos"
                linkText="Ver Calendario Completo"
            />

            {/* Activity Stats */}
            <section className="from-cg-primary-tonal/10 to-cg-secondary-tonal/10 rounded-xl border border-[rgba(255,255,255,0.05)] bg-gradient-to-br p-6">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-cg-on-surface/50 text-xs font-bold uppercase">
                        Actividad
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-display text-cg-on-surface text-2xl font-black">
                            {totalPosts}
                        </p>
                        <p className="text-cg-on-surface-variant text-[10px]">Publicaciones</p>
                    </div>
                    <div>
                        <p className="font-display text-cg-on-surface text-2xl font-black">
                            {usuarios.length}
                        </p>
                        <p className="text-cg-on-surface-variant text-[10px]">Miembros</p>
                    </div>
                </div>
            </section>
        </aside>
    );
}

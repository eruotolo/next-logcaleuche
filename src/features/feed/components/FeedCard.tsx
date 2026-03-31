'use client';

import Link from 'next/link';

import { Calendar, Eye, Heart, MessageSquare, Pencil } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { getCloudinaryImageUrl, getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';
import { formatDate } from '@/shared/lib/utils';

import { EditFeedModal } from './EditFeedModal';

interface FeedCardProps {
    post: any;
    canEdit?: boolean;
    categories?: { id: number; nombre: string }[];
}

const gradoColors: Record<number, string> = {
    1: 'bg-[rgba(158,167,255,0.2)] text-cg-primary-tonal',
    2: 'bg-[rgba(76,214,251,0.2)] text-cg-secondary-tonal',
    3: 'bg-[rgba(155,255,206,0.2)] text-cg-tertiary-tonal',
};

export function FeedCard({ post, canEdit = false, categories = [] }: FeedCardProps) {
    const gradoId = post.user?.gradoId ?? 1;
    const gradoNombre = post.user?.grado?.nombre ?? '';

    return (
        <article className="group rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[20px] transition-all hover:bg-[rgba(255,255,255,0.07)]">
            {/* Header: Avatar + Name + Grade + Time */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[rgba(90,103,216,0.6)] to-[rgba(76,214,251,0.6)] p-[2px]">
                        <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#17182a]">
                            <Avatar className="h-full w-full">
                                <AvatarImage
                                    src={
                                        post.user?.image
                                            ? getCloudinaryImageUrl(post.user.image)
                                            : undefined
                                    }
                                />
                                <AvatarFallback className="text-cg-primary-tonal bg-[rgba(90,103,216,0.3)] text-sm font-bold">
                                    {post.user?.name?.[0]}
                                    {post.user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-cg-on-surface flex items-center gap-2 font-bold">
                            {post.user?.name} {post.user?.lastName}
                            {gradoNombre && (
                                <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${gradoColors[gradoId] ?? gradoColors[1]}`}
                                >
                                    {gradoNombre}
                                </span>
                            )}
                        </h3>
                        <p className="text-cg-on-surface-variant flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                </div>
                <Badge className="bg-cg-primary/20 text-cg-primary-tonal border-none text-[10px]">
                    {post.category?.nombre}
                </Badge>
            </div>

            {/* Content */}
            <Link href={`/feed/${post.slug}`}>
                <p className="text-cg-on-surface-variant mb-4 leading-relaxed">{post.contenido}</p>
            </Link>

            {/* Image */}
            {post.fileName && (
                <Link href={`/feed/${post.slug}`}>
                    <div className="mb-4 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)]">
                        <img
                            src={getCloudinaryRawImageUrl(post.fileName) ?? ''}
                            alt={post.titulo}
                            className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </Link>
            )}

            {/* Title */}
            <Link href={`/feed/${post.slug}`}>
                <h4 className="text-cg-on-surface group-hover:text-cg-primary-tonal mb-4 text-lg font-bold transition-colors">
                    {post.titulo}
                </h4>
            </Link>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-4">
                <div className="flex gap-6">
                    <span className="text-cg-on-surface-variant flex items-center gap-2 text-xs font-medium">
                        <Heart className="h-4 w-4" />
                    </span>
                    <Link
                        href={`/feed/${post.slug}`}
                        className="text-cg-on-surface-variant hover:text-cg-primary-tonal flex items-center gap-2 text-xs font-medium transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        {post._count?.comments > 0 && post._count.comments}
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Tooltip content="Ver publicación">
                        <Link
                            href={`/feed/${post.slug}`}
                            className="text-cg-on-surface-variant hover:text-cg-primary-tonal flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors hover:bg-[rgba(158,167,255,0.15)]"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Ver
                        </Link>
                    </Tooltip>

                    {canEdit && categories.length > 0 && (
                        <EditFeedModal
                            post={{
                                id: post.id,
                                titulo: post.titulo,
                                categoryId: post.categoryId,
                                contenido: post.contenido,
                                fileName: post.fileName,
                            }}
                            categories={categories}
                            trigger={
                                <Tooltip content="Editar publicación">
                                    <button
                                        type="button"
                                        className="text-cg-outline hover:text-cg-primary-tonal flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(158,167,255,0.15)]"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                </Tooltip>
                            }
                        />
                    )}
                </div>
            </div>
        </article>
    );
}

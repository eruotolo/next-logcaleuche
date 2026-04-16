'use client';

import { useTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';



import { Calendar, Eye, Heart, MessageSquare, Paperclip, Pencil, Trash2 } from 'lucide-react';



import { Badge } from '@/shared/components/ui/badge';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { getCloudinaryPdfUrl, getCloudinaryRawImageUrl, isImageFile } from '@/shared/lib/cloudinary';

import { formatDate, truncate } from '@/shared/lib/utils';



import type { getFeedPosts } from '../actions';
import { deleteFeedPost } from '../actions';
import { EditFeedModal } from './EditFeedModal';

type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];












































interface FeedCardProps {
    post: FeedPost;
    canEdit?: boolean;
    canDelete?: boolean;
    categories?: { id: number; nombre: string }[];
}

const gradoColors: Record<number, string> = {
    1: 'bg-[rgba(158,167,255,0.2)] text-cg-primary-tonal',
    2: 'bg-[rgba(76,214,251,0.2)] text-cg-secondary-tonal',
    3: 'bg-[rgba(155,255,206,0.2)] text-cg-tertiary-tonal',
};

export function FeedCard({ post, canEdit = false, canDelete = false, categories = [] }: FeedCardProps) {
    const gradoId = post.user?.gradoId ?? 1;
    const gradoNombre = post.user?.grado?.nombre ?? '';
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        if (!confirm(`¿Eliminar la publicación "${post.titulo}"?`)) return;
        startTransition(async () => {
            await deleteFeedPost(post.id);
        });
    }

    return (
        <article className="group rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[20px] transition-all hover:bg-[rgba(255,255,255,0.07)]">
            {/* Header: Avatar + Name + Grade + Time */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[rgba(90,103,216,0.6)] to-[rgba(76,214,251,0.6)] p-[2px]">
                        <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#17182a]">
                            {post.user?.image ? (
                                <Image src={getCloudinaryRawImageUrl(post.user.image) as string} alt={`${post.user?.name} ${post.user?.lastName}`} width={600} height={600} className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-cg-primary-tonal flex h-full w-full items-center justify-center bg-[rgba(90,103,216,0.3)] text-sm font-bold">{post.user?.name?.[0]}{post.user?.lastName?.[0]}</div>
                            )}
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
                <p className="text-cg-on-surface-variant mb-4 leading-relaxed">
                    {truncate(post.contenido ?? '', 280)}
                </p>
            </Link>

            {/* Image / Attachment */}
            {post.fileName && (
                isImageFile(post.fileName) ? (
                    <Link href={`/feed/${post.slug}`}>
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)]">
                            <Image
                                src={getCloudinaryRawImageUrl(post.fileName) ?? ''}
                                alt={post.titulo ?? ''}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </Link>
                ) : (
                    <a
                        href={getCloudinaryPdfUrl(post.fileName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cg-on-surface-variant hover:text-cg-primary-tonal mb-4 flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm transition-colors hover:bg-[rgba(158,167,255,0.1)]"
                    >
                        <Paperclip className="h-4 w-4 shrink-0" />
                        <span className="truncate">{post.fileName}</span>
                    </a>
                )
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
                                titulo: post.titulo ?? '',
                                categoryId: post.categoryId ?? 0,
                                contenido: post.contenido ?? '',
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

                    {canDelete && (
                        <Tooltip content="Eliminar publicación">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="text-cg-outline hover:text-cg-error flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,100,132,0.1)] disabled:opacity-50"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>
        </article>
    );
}

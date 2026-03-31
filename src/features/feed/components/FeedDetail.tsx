'use client';

import { useActionState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Calendar, MessageSquare, Send, Tag, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { getCloudinaryImageUrl, getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';
import { formatDate } from '@/shared/lib/utils';

import { addComment, deleteFeedPost } from '../actions';

interface FeedDetailProps {
    post: any;
    others: any[];
    currentUser: any;
}

export function FeedDetail({ post, others, currentUser }: FeedDetailProps) {
    const router = useRouter();
    const [state, action, isPending] = useActionState(addComment, null);

    const isAdmin = currentUser.categoryId <= 2;
    const isOwner = currentUser.id === String(post.userId);

    useEffect(() => {
        if (state?.success) {
            toast.success('Comentario agregado');
            // El revalidatePath en la acción debería actualizar los datos
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar esta publicación?')) return;
        const res = await deleteFeedPost(post.id);
        if (res.success) {
            toast.success('Publicación eliminada');
            router.push('/feed');
        } else {
            toast.error(res.error);
        }
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-12">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Tooltip content="Volver al feed">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/feed">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    </Tooltip>
                    <h1 className="text-cg-on-surface line-clamp-1 text-2xl leading-tight font-bold">
                        {post.titulo}
                    </h1>
                </div>

                {(isAdmin || isOwner) && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={handleDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-8 lg:col-span-2">
                    <Card className="overflow-hidden border-none shadow-sm">
                        {post.fileName && (
                            <div className="h-[400px] w-full overflow-hidden">
                                <img
                                    src={getCloudinaryRawImageUrl(post.fileName) ?? ''}
                                    alt={post.titulo}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <CardContent className="p-8">
                            <div className="mb-6 flex items-center gap-4 border-b border-[rgba(70,70,88,0.2)] pb-6">
                                <Avatar className="h-12 w-12 ring-2 ring-[rgba(70,70,88,0.2)]">
                                    <AvatarImage src={getCloudinaryImageUrl(post.user?.image)} />
                                    <AvatarFallback className="text-cg-primary-tonal bg-[rgba(90,103,216,0.15)] font-bold">
                                        {post.user?.name?.[0]}
                                        {post.user?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-cg-on-surface font-bold">
                                        {post.user?.name} {post.user?.lastName}
                                    </p>
                                    <div className="text-cg-on-surface-variant mt-0.5 flex items-center gap-3 text-xs">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(post.createdAt)}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-cg-primary-tonal border-none bg-[rgba(90,103,216,0.15)] py-0 text-[10px]"
                                        >
                                            {post.category?.nombre}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="text-cg-on-surface text-lg leading-relaxed whitespace-pre-wrap">
                                {post.contenido}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <div className="space-y-6">
                        <h3 className="text-cg-on-surface flex items-center gap-2 px-2 text-xl font-bold">
                            <MessageSquare className="text-cg-primary-tonal h-5 w-5" />
                            Comentarios ({post.comments?.length || 0})
                        </h3>

                        <Card>
                            <CardContent className="p-6">
                                <form action={action} className="space-y-4">
                                    <input type="hidden" name="feedId" value={post.id} />
                                    <textarea
                                        name="message"
                                        placeholder="Escribe un comentario..."
                                        className="form-textarea min-h-[100px]"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isPending}>
                                            <Send className="mr-2 h-4 w-4" />
                                            {isPending ? 'Enviando...' : 'Comentar'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {post.comments?.map((comment: any) => (
                                <div
                                    key={comment.id}
                                    className="flex gap-4 rounded-xl border border-[rgba(70,70,88,0.2)] bg-[rgba(255,255,255,0.03)] p-4 shadow-sm"
                                >
                                    <Avatar className="h-10 w-10 shrink-0">
                                        <AvatarImage
                                            src={getCloudinaryImageUrl(comment.user?.image)}
                                        />
                                        <AvatarFallback className="text-cg-on-surface-variant bg-[rgba(255,255,255,0.06)] text-xs font-medium">
                                            {comment.user?.name?.[0]}
                                            {comment.user?.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-cg-on-surface text-sm font-bold">
                                                {comment.user?.name} {comment.user?.lastName}
                                            </span>
                                            <span className="text-cg-outline text-[10px]">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-cg-on-surface-variant text-sm leading-relaxed">
                                            {comment.message}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {(!post.comments || post.comments.length === 0) && (
                                <p className="cg-empty-state text-cg-outline py-8 text-center text-sm italic">
                                    No hay comentarios aún. ¡Sé el primero en comentar!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Other Posts */}
                <div className="space-y-6">
                    <h3 className="text-cg-on-surface px-2 text-lg font-bold">
                        Publicaciones Recientes
                    </h3>
                    <div className="space-y-4">
                        {others.map((other) => (
                            <Link key={other.id} href={`/feed/${other.slug}`} className="block">
                                <Card className="group overflow-hidden border-[rgba(70,70,88,0.2)] transition-shadow hover:shadow-md">
                                    <div className="flex gap-3 p-3">
                                        {other.fileName ? (
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded">
                                                <img
                                                    src={
                                                        getCloudinaryRawImageUrl(other.fileName) ??
                                                        ''
                                                    }
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-[rgba(90,103,216,0.15)]">
                                                <Tag className="text-cg-primary-tonal h-6 w-6" />
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-center overflow-hidden">
                                            <Badge
                                                variant="outline"
                                                className="text-cg-primary-tonal mb-1 w-fit border-[rgba(90,103,216,0.2)] bg-[rgba(90,103,216,0.1)] px-1.5 py-0 text-[9px]"
                                            >
                                                {other.category?.nombre}
                                            </Badge>
                                            <h4 className="text-cg-on-surface group-hover:text-cg-primary-tonal line-clamp-2 text-xs font-bold transition-colors">
                                                {other.titulo}
                                            </h4>
                                            <span className="text-cg-outline mt-1 text-[9px]">
                                                {formatDate(other.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

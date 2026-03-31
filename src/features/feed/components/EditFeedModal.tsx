'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';

import { updateFeedPost } from '../actions';

interface EditFeedModalProps {
    post: {
        id: number;
        titulo: string;
        categoryId: number;
        contenido: string;
        fileName: string | null;
    };
    categories: { id: number; nombre: string }[];
    trigger: React.ReactNode;
}

export function EditFeedModal({ post, categories, trigger }: EditFeedModalProps) {
    const { isOpen, open, close } = useModal();
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        post.fileName ? (getCloudinaryRawImageUrl(post.fileName) ?? null) : null,
    );
    // Bindear la acción con el id del post
    const boundAction = updateFeedPost.bind(null, post.id);
    const [state, action, isPending] = useActionState(boundAction, null);
    // Ref para resetear el input de archivo al cerrar
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state?.success) {
            toast.success('Publicación actualizada');
            close();
            router.refresh();
        } else if (state && !state.success) {
            toast.error(typeof state.error === 'string' ? state.error : 'Error al actualizar.');
        }
    }, [state, close, router]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 5MB');
            e.target.value = '';
            return;
        }
        if (!file.type.startsWith('image/')) {
            toast.error('El archivo debe ser una imagen');
            e.target.value = '';
            return;
        }
        setPreviewUrl(URL.createObjectURL(file));
    }

    function handleClose() {
        // Resetear preview al original si se cierra sin guardar
        setPreviewUrl(post.fileName ? (getCloudinaryRawImageUrl(post.fileName) ?? null) : null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        close();
    }

    return (
        <>
            <span onClick={() => open()} className="cursor-pointer">
                {trigger}
            </span>

            <Modal open={isOpen} onClose={handleClose} title="Editar Publicación" size="lg">
                <form action={action} className="space-y-5">
                    {/* Título */}
                    <div className="space-y-2">
                        <label htmlFor="edit-feed-titulo" className="form-label">
                            Título
                        </label>
                        <Input
                            id="edit-feed-titulo"
                            name="titulo"
                            defaultValue={post.titulo}
                            placeholder="Título de la publicación"
                            required
                        />
                    </div>

                    {/* Categoría + Imagen */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="edit-feed-category" className="form-label">
                                Categoría
                            </label>
                            <select
                                id="edit-feed-category"
                                name="category"
                                className="form-select"
                                defaultValue={post.categoryId}
                                required
                            >
                                <option value="" disabled>
                                    Selecciona una categoría
                                </option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="form-label">Imagen de Portada</label>
                            <div className="flex flex-col gap-2">
                                {previewUrl && (
                                    <div className="relative h-24 w-full overflow-hidden rounded-lg border border-[rgba(70,70,88,0.3)]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={previewUrl}
                                            alt="Preview portada"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <label className="text-cg-on-surface-variant flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)]">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>
                                        {previewUrl ? 'Cambiar Portada' : 'Adjuntar Portada'}
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="space-y-2">
                        <label htmlFor="edit-feed-contenido" className="form-label">
                            Contenido
                        </label>
                        <textarea
                            id="edit-feed-contenido"
                            name="contenido"
                            rows={6}
                            className="form-textarea"
                            defaultValue={post.contenido}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[rgba(70,70,88,0.2)] pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

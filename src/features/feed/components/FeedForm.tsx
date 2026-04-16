'use client';

import { useActionState, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, ImageIcon, Send } from 'lucide-react';
import { toast } from 'sonner';

import { AutosaveIndicator } from '@/shared/components/ui/autosave-indicator';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useAutosave } from '@/shared/hooks/useAutosave';

import { createFeedPost } from '../actions';

interface FeedFormProps {
    categories: any[];
    onSuccess?: () => void;
}

interface FeedDraft {
    titulo: string;
    category: string;
    contenido: string;
}

export function FeedForm({ categories, onSuccess }: FeedFormProps) {
    const router = useRouter();
    const [state, action, isPending] = useActionState(createFeedPost, null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Controlled state for autosave — tracks textarea/input values without RHF
    const [draftValues, setDraftValues] = useState<FeedDraft>({
        titulo: '',
        category: '',
        contenido: '',
    });

    const { status: autosaveStatus, restore, clear } = useAutosave<FeedDraft>(
        'draft-feed',
        draftValues,
    );

    // Restore draft on mount (one-time effect)
    // biome-ignore lint/correctness/useExhaustiveDependencies: restore is stable across renders
    useEffect(() => {
        const draft = restore();
        if (draft) {
            setDraftValues(draft);
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    useEffect(() => {
        if (state?.success) {
            clear();
            toast.success('Publicación creada exitosamente');
            if (onSuccess) onSuccess();
            else router.push('/feed');
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess, clear]);

    const formContent = (
        <form action={action} className="space-y-6">
            <div className="space-y-2">
                <label className="form-label">Título</label>
                <Input
                    name="titulo"
                    placeholder="Ej: Resumen de la última Tenida"
                    required
                    value={draftValues.titulo}
                    onChange={(e) =>
                        setDraftValues((prev) => ({ ...prev, titulo: e.target.value }))
                    }
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="form-label">Categoría</label>
                    <select
                        name="category"
                        className="form-select"
                        required
                        value={draftValues.category}
                        onChange={(e) =>
                            setDraftValues((prev) => ({ ...prev, category: e.target.value }))
                        }
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

                <div className="space-y-3">
                    <label className="form-label">Imagen de Portada (Opcional)</label>
                    <div className="flex flex-col gap-3">
                        {previewUrl && (
                            <div className="relative h-28 w-full overflow-hidden rounded-lg border border-[rgba(70,70,88,0.3)] shadow-sm md:w-48">
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
                            <span>{previewUrl ? 'Cambiar Portada' : 'Adjuntar Portada'}</span>
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        <p className="text-cg-outline text-[10px]">
                            JPG, PNG. Recomendado ratio 16:9.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="form-label">Contenido</label>
                <textarea
                    name="contenido"
                    rows={onSuccess ? 6 : 8}
                    className="form-textarea"
                    placeholder="Escribe aquí el contenido de tu publicación..."
                    required
                    value={draftValues.contenido}
                    onChange={(e) =>
                        setDraftValues((prev) => ({ ...prev, contenido: e.target.value }))
                    }
                />
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(70,70,88,0.2)] pt-4">
                <AutosaveIndicator status={autosaveStatus} />
                <div className="flex gap-3">
                    {!onSuccess && (
                        <Button variant="outline" type="button" asChild disabled={isPending}>
                            <Link href="/feed">Cancelar</Link>
                        </Button>
                    )}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Publicando...' : 'Publicar ahora'}
                    </Button>
                </div>
            </div>
        </form>
    );

    if (onSuccess) return formContent;

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/feed">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-cg-on-surface text-2xl font-bold">Nueva Publicación</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Send className="text-cg-primary-tonal h-5 w-5" />
                        ¿Qué quieres compartir hoy?
                    </CardTitle>
                </CardHeader>
                <CardContent>{formContent}</CardContent>
            </Card>
        </div>
    );
}

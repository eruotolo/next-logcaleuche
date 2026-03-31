'use client';

import { useActionState, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, ImageIcon, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

import { createUser } from '../actions';

interface UserFormProps {
    grados: any[];
    categories: any[];
    onSuccess?: () => void;
}

export function UserForm({ grados, categories, onSuccess }: UserFormProps) {
    const router = useRouter();
    const [state, action, isPending] = useActionState(createUser, null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('La imagen no debe superar los 2MB');
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
            toast.success('Usuario creado exitosamente');
            if (onSuccess) onSuccess();
            else router.push('/usuarios');
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router, onSuccess]);

    const formContent = (
        <form action={action} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="form-label">Nombre</label>
                    <Input name="name" placeholder="Ej: Juan" required />
                </div>
                <div className="space-y-2">
                    <label className="form-label">Apellido</label>
                    <Input name="lastName" placeholder="Ej: Pérez" required />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="form-label">Email</label>
                    <Input name="email" type="email" placeholder="juan@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                    <label className="form-label">RUT (Usuario)</label>
                    <Input name="username" placeholder="12345678" required />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="form-label">Contraseña Inicial</label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </div>
                <div className="space-y-3">
                    <label className="form-label">Foto de Perfil (Opcional)</label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-[rgba(70,70,88,0.3)] shadow-sm">
                            <AvatarImage src={previewUrl || ''} />
                            <AvatarFallback className="bg-[rgba(255,255,255,0.03)] text-xl text-[#747487]">
                                <UserPlus className="h-6 w-6 opacity-30" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-1">
                            <label className="text-cg-on-surface-variant flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)]">
                                <ImageIcon className="h-4 w-4" />
                                <span>{previewUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                                <input
                                    type="file"
                                    name="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <p className="text-cg-outline text-[10px]">
                                Formatos: JPG, PNG. Máx 2MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="form-label">Grado</label>
                    <select name="gradoId" className="form-select" required>
                        {grados.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="form-label">Categoría</label>
                    <select name="categoryId" className="form-select" required defaultValue={3}>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {!onSuccess && (
                    <Button variant="outline" type="button" asChild disabled={isPending}>
                        <Link href="/usuarios">Cancelar</Link>
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Registrando...' : 'Registrar Miembro'}
                </Button>
            </div>
        </form>
    );

    if (onSuccess) return formContent;

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/usuarios">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-cg-on-surface text-2xl font-bold">Registrar Nuevo Miembro</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <UserPlus className="text-cg-primary-tonal h-5 w-5" />
                        Información del Miembro
                    </CardTitle>
                </CardHeader>
                <CardContent>{formContent}</CardContent>
            </Card>
        </div>
    );
}

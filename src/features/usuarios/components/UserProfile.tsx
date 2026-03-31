'use client';

import { useActionState, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
    Cake,
    Calendar,
    GraduationCap,
    Image as ImageIcon,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
    Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { getCloudinaryImageUrl } from '@/shared/lib/cloudinary';
import { cn, formatCLP, formatDate } from '@/shared/lib/utils';

import { assignTarifa, updateProfile } from '../actions';

interface TarifaOption {
    id: number;
    nombre: string;
    monto: number;
}

interface UserProfileProps {
    user: any;
    currentUser: any;
    grados: any[];
    oficiales: any[];
    categories: any[];
    tarifas: TarifaOption[];
}

export function UserProfile({
    user,
    currentUser,
    grados: _grados,
    oficiales: _oficiales,
    categories: _categories,
    tarifas,
}: UserProfileProps) {
    const editModal = useModal();
    const router = useRouter();
    const [state, action, isPending] = useActionState(updateProfile, null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedCuotaId, setSelectedCuotaId] = useState<number | ''>(user.cuotaId ?? '');
    const [isSavingCuota, setIsSavingCuota] = useState(false);

    const canEdit = currentUser.id === String(user.id) || currentUser.categoryId <= 2;
    const isAdmin = currentUser.categoryId <= 2;

    async function handleAssignTarifa() {
        setIsSavingCuota(true);
        const res = await assignTarifa(
            user.id,
            selectedCuotaId === '' ? null : Number(selectedCuotaId),
        );
        if (res.success) {
            toast.success('Cuota mensual actualizada');
            router.refresh();
        } else {
            toast.error(typeof res.error === 'string' ? res.error : 'Error al actualizar');
        }
        setIsSavingCuota(false);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    useEffect(() => {
        if (state?.success) {
            toast.success('Perfil actualizado');
            setPreviewUrl(null);
            editModal.close();
            router.refresh();
        } else if (state?.error) {
            toast.error(state.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return (
        <>
            <Modal
                open={editModal.isOpen}
                onClose={() => {
                    setPreviewUrl(null);
                    editModal.close();
                }}
                title={`Editar Perfil: ${user.name} ${user.lastName}`}
                size="xl"
            >
                <form action={action} className="space-y-6">
                    <input type="hidden" name="userId" value={user.id} />
                    <div className="mb-6 flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 border-2 border-[rgba(70,70,88,0.3)] shadow-sm">
                            <AvatarImage src={previewUrl || getCloudinaryImageUrl(user.image)} />
                            <AvatarFallback className="text-xl">
                                {user.name?.[0]}
                                {user.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-cg-on-surface-variant flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(70,70,88,0.35)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)]">
                                <ImageIcon className="h-4 w-4" />
                                <span>Cambiar Foto</span>
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="form-label">Nombre</label>
                            <Input name="name" defaultValue={user.name} required />
                        </div>
                        <div className="space-y-2">
                            <label className="form-label">Apellido</label>
                            <Input name="lastName" defaultValue={user.lastName} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="form-label">Email</label>
                            <Input name="email" type="email" defaultValue={user.email} required />
                        </div>
                        <div className="space-y-2">
                            <label className="form-label">Teléfono</label>
                            <Input name="phone" defaultValue={user.phone} placeholder="+56 9 ..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="form-label">Ciudad</label>
                            <Input name="city" defaultValue={user.city} />
                        </div>
                        <div className="space-y-2">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <Input
                                name="dateBirthday"
                                type="date"
                                defaultValue={
                                    user.dateBirthday
                                        ? user.dateBirthday.toISOString().split('T')[0]
                                        : ''
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="form-label">Dirección</label>
                        <Input name="address" defaultValue={user.address} />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[rgba(70,70,88,0.2)] pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <div className="mx-auto max-w-4xl space-y-6 pb-12">
                {/* Header Profile */}
                <Card className="overflow-hidden border-none bg-transparent shadow-none">
                    <div className="h-32 rounded-t-xl bg-gradient-to-r from-[rgba(90,103,216,0.3)] to-[rgba(44,194,230,0.2)]" />
                    <CardContent className="-mt-12 px-6">
                        <div className="flex flex-col items-end gap-6 md:flex-row">
                            <Avatar className="h-32 w-32 border-4 border-[rgba(70,70,88,0.3)] shadow-lg ring-1 ring-white/5">
                                <AvatarImage src={getCloudinaryImageUrl(user.image)} />
                                <AvatarFallback className="text-cg-primary-tonal bg-[rgba(90,103,216,0.15)] text-4xl font-bold">
                                    {user.name?.[0]}
                                    {user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 pb-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-cg-on-surface text-3xl font-bold">
                                        {user.name} {user.lastName}
                                    </h1>
                                    <Badge className="text-cg-primary-tonal border-[rgba(158,167,255,0.2)] bg-[rgba(158,167,255,0.12)]">
                                        {user.grado?.nombre}
                                    </Badge>
                                    {user.oficialidadId > 1 && (
                                        <Badge
                                            variant="outline"
                                            className="border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] text-orange-400"
                                        >
                                            {user.oficialidad?.nombre}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-cg-on-surface-variant mt-1 text-xs font-medium tracking-widest uppercase">
                                    {user.category?.nombre}
                                </p>
                            </div>
                            {canEdit && (
                                <Button onClick={() => editModal.open()} className="mb-2">
                                    Editar Perfil
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                    <User className="text-cg-primary-tonal h-4 w-4" />
                                    Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="text-cg-outline mt-0.5 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                            Email
                                        </span>
                                        <span className="text-cg-on-surface text-sm font-medium break-all">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="text-cg-outline mt-0.5 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                            Teléfono
                                        </span>
                                        <span className="text-cg-on-surface text-sm font-medium">
                                            {user.phone || 'No registrado'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-cg-outline mt-0.5 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                            Ubicación
                                        </span>
                                        <span className="text-cg-on-surface text-sm font-medium">
                                            {user.address
                                                ? `${user.address}, ${user.city}`
                                                : user.city || 'No registrado'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Cake className="text-cg-outline mt-0.5 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                            Cumpleaños
                                        </span>
                                        <span className="text-cg-on-surface text-sm font-medium">
                                            {user.dateBirthday
                                                ? formatDate(user.dateBirthday)
                                                : 'No registrado'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                    <Shield className="text-cg-tertiary-tonal h-4 w-4" />
                                    Sistema
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                            RUT (Usuario)
                                        </span>
                                        <span className="text-cg-on-surface font-mono text-sm font-medium">
                                            {user.username}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                            Fecha Registro
                                        </span>
                                        <span className="text-cg-on-surface text-sm font-medium">
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Info */}
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                    <GraduationCap className="text-cg-primary-tonal h-4 w-4" />
                                    Hitos Masónicos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative space-y-8 pl-8 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-[rgba(70,70,88,0.2)]">
                                    <div className="relative">
                                        <div className="border-cg-primary bg-cg-surface absolute top-1 -left-8 h-3 w-3 rounded-full border-2" />
                                        <div className="flex flex-col">
                                            <span className="text-cg-on-surface text-sm font-bold">
                                                Iniciación (Aprendiz)
                                            </span>
                                            <span className="text-cg-on-surface-variant mt-1 flex items-center gap-1 text-xs">
                                                <Calendar className="h-3 w-3" />
                                                {user.dateInitiation
                                                    ? formatDate(user.dateInitiation)
                                                    : 'Pendiente / No registrada'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div
                                            className={cn(
                                                'absolute top-1 -left-8 h-3 w-3 rounded-full border-2 bg-white',
                                                user.gradoId >= 2
                                                    ? 'border-blue-600'
                                                    : 'border-[rgba(70,70,88,0.3)]',
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span
                                                className={cn(
                                                    'text-sm font-bold',
                                                    user.gradoId >= 2
                                                        ? 'text-cg-on-surface'
                                                        : 'text-cg-outline',
                                                )}
                                            >
                                                Aumento de Salario (Compañero)
                                            </span>
                                            <span className="text-cg-outline mt-1 flex items-center gap-1 text-xs">
                                                <Calendar className="h-3 w-3" />
                                                {user.dateSalary
                                                    ? formatDate(user.dateSalary)
                                                    : 'Pendiente / No registrada'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div
                                            className={cn(
                                                'absolute top-1 -left-8 h-3 w-3 rounded-full border-2 bg-white',
                                                user.gradoId >= 3
                                                    ? 'border-blue-600'
                                                    : 'border-[rgba(70,70,88,0.3)]',
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span
                                                className={cn(
                                                    'text-sm font-bold',
                                                    user.gradoId >= 3
                                                        ? 'text-cg-on-surface'
                                                        : 'text-cg-outline',
                                                )}
                                            >
                                                Exaltación (Maestro)
                                            </span>
                                            <span className="text-cg-outline mt-1 flex items-center gap-1 text-xs">
                                                <Calendar className="h-3 w-3" />
                                                {user.dateExalted
                                                    ? formatDate(user.dateExalted)
                                                    : 'Pendiente / No registrada'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Aquí podrían ir las pestañas de Tesorería, Publicaciones, etc. en el futuro */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {isAdmin && (
                                <Card>
                                    <CardHeader className="border-b pb-3">
                                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                            <Wallet className="h-4 w-4 text-[#41a65a]" />
                                            Cuota Mensual
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                                Tarifa actual
                                            </span>
                                            <span className="text-cg-on-surface text-sm font-semibold">
                                                {user.tarifa
                                                    ? `${user.tarifa.nombre} — ${formatCLP(user.tarifa.monto)}`
                                                    : `Tarifa Estándar — ${formatCLP(45000)}`}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase">
                                                Cambiar tarifa
                                            </span>
                                            <select
                                                value={selectedCuotaId}
                                                onChange={(e) =>
                                                    setSelectedCuotaId(
                                                        e.target.value === ''
                                                            ? ''
                                                            : Number(e.target.value),
                                                    )
                                                }
                                                className="text-cg-on-surface focus:ring-cg-primary h-9 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:outline-none"
                                            >
                                                <option value="">
                                                    Tarifa Estándar ({formatCLP(45000)})
                                                </option>
                                                {tarifas
                                                    .filter((t) => t.monto !== 45000)
                                                    .map((t) => (
                                                        <option key={t.id} value={t.id}>
                                                            {t.nombre} ({formatCLP(t.monto)})
                                                        </option>
                                                    ))}
                                            </select>
                                            <Button
                                                onClick={handleAssignTarifa}
                                                disabled={isSavingCuota}
                                                className="w-full"
                                            >
                                                {isSavingCuota ? 'Guardando...' : 'Guardar Tarifa'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            <Card className="flex items-center justify-center border-2 border-dashed border-[rgba(70,70,88,0.2)] bg-[rgba(255,255,255,0.02)] py-10">
                                <p className="text-cg-outline text-xs font-medium italic">
                                    Sección Publicaciones próximamente
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

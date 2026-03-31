'use client';

import { useEffect, useState } from 'react';

import { Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { useModal } from '@/shared/hooks/useModal';
import { getCloudinaryImageUrl } from '@/shared/lib/cloudinary';
import { cn, formatDate } from '@/shared/lib/utils';

import { getUsuarioById } from '../actions';

type UsuarioDetalle = Awaited<ReturnType<typeof getUsuarioById>>;

interface UserViewModalProps {
    userId: number;
    userName: string;
}

export function UserViewModal({ userId, userName }: UserViewModalProps) {
    const { isOpen, open, close } = useModal();
    const [usuario, setUsuario] = useState<UsuarioDetalle>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        getUsuarioById(userId)
            .then(setUsuario)
            .catch(() => toast.error('No se pudo cargar el perfil'))
            .finally(() => setIsLoading(false));
    }, [isOpen, userId]);

    return (
        <>
            <Tooltip content="Ver perfil">
                <Button variant="outline" size="icon" onClick={() => open()}>
                    <Eye className="text-cg-primary-tonal h-4 w-4" />
                </Button>
            </Tooltip>

            <Modal open={isOpen} onClose={close} title={`Perfil — ${userName}`} size="md">
                {isLoading && (
                    <div className="text-cg-on-surface-variant flex h-40 items-center justify-center text-sm">
                        Cargando…
                    </div>
                )}

                {!isLoading && usuario && (
                    <div className="space-y-5">
                        {/* Avatar + nombre */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 text-lg">
                                <AvatarImage src={getCloudinaryImageUrl(usuario.image)} />
                                <AvatarFallback className="text-cg-primary-tonal bg-[rgba(90,103,216,0.15)] font-semibold">
                                    {usuario.name?.charAt(0)}
                                    {usuario.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-cg-on-surface text-lg font-bold">
                                    {usuario.name} {usuario.lastName}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                    {/* Badge de grado */}
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'px-2 py-0 text-xs',
                                            usuario.gradoId === 3
                                                ? 'text-cg-tertiary-tonal border-[rgba(155,255,206,0.2)] bg-[rgba(155,255,206,0.12)]'
                                                : usuario.gradoId === 2
                                                  ? 'text-cg-secondary-tonal border-[rgba(76,214,251,0.2)] bg-[rgba(76,214,251,0.12)]'
                                                  : 'text-cg-primary-tonal border-[rgba(158,167,255,0.2)] bg-[rgba(158,167,255,0.12)]',
                                        )}
                                    >
                                        {usuario.grado?.nombre ?? 'Sin grado'}
                                    </Badge>
                                    {/* Badge de oficialidad */}
                                    {usuario.oficialidadId && usuario.oficialidadId > 1 && (
                                        <span className="rounded border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] px-1.5 py-0.5 text-xs font-medium text-orange-400">
                                            {usuario.oficialidad?.nombre}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Datos de contacto */}
                        <div className="divide-y divide-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                            <InfoRow label="Email" value={usuario.email} />
                            <InfoRow label="RUT" value={usuario.username} mono />
                            {usuario.phone && <InfoRow label="Teléfono" value={usuario.phone} />}
                            {usuario.city && <InfoRow label="Ciudad" value={usuario.city} />}
                        </div>

                        {/* Fechas masónicas */}
                        {(usuario.dateInitiation || usuario.dateSalary || usuario.dateExalted) && (
                            <div className="divide-y divide-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                {usuario.dateInitiation && (
                                    <InfoRow
                                        label="Iniciación"
                                        value={formatDate(usuario.dateInitiation)}
                                    />
                                )}
                                {usuario.dateSalary && (
                                    <InfoRow
                                        label="Aumento de Salario"
                                        value={formatDate(usuario.dateSalary)}
                                    />
                                )}
                                {usuario.dateExalted && (
                                    <InfoRow
                                        label="Exaltación"
                                        value={formatDate(usuario.dateExalted)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!isLoading && !usuario && (
                    <p className="text-cg-on-surface-variant py-8 text-center text-sm italic">
                        No se encontró información para este miembro.
                    </p>
                )}
            </Modal>
        </>
    );
}

function InfoRow({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string | null | undefined;
    mono?: boolean;
}) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-cg-on-surface-variant text-xs">{label}</span>
            <span
                className={cn(
                    'text-cg-on-surface text-sm',
                    mono && 'text-cg-outline font-mono text-xs',
                )}
            >
                {value}
            </span>
        </div>
    );
}

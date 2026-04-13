'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import { Briefcase, ChevronDown, GraduationCap, Key, UserCog, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef, DataTable, type FilterDef } from '@/shared/components/ui/data-table';
import { Modal } from '@/shared/components/ui/modal';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { useModal } from '@/shared/hooks/useModal';
import { getCloudinaryImageUrl } from '@/shared/lib/cloudinary';
import { cn } from '@/shared/lib/utils';

import type { getUsuarios } from '../actions';
import {
    assignGrado,
    assignOficialidad,
    deactivateUsuario,
    resetPassword,
    updateUserCategory,
} from '../actions';
import { UserViewModal } from './UserViewModal';

type Usuario = Awaited<ReturnType<typeof getUsuarios>>[number];

interface UserListProps {
    usuarios: Usuario[];
    currentUserCategory: number;
    grados?: { id: number; nombre: string }[];
    oficiales?: { id: number; nombre: string }[];
    categories?: { id: number; nombre: string }[];
    /** ID de categoría del usuario autenticado (para mostrar botón Ver a categoryId=4) */
    categoryId?: number;
}

export function UserList({
    usuarios,
    currentUserCategory,
    grados = [],
    oficiales = [],
    categories = [],
    categoryId,
}: UserListProps) {
    const isAdmin = currentUserCategory <= 2;
    const isViewOnly = (categoryId ?? currentUserCategory) === 3;

    const [categoryDropdownUserId, setCategoryDropdownUserId] = useState<number | null>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(e.target as Node)
            ) {
                setCategoryDropdownUserId(null);
            }
        }
        if (categoryDropdownUserId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [categoryDropdownUserId]);

    const [selectedOficialidadId, setSelectedOficialidadId] = useState<number>(1);
    const [selectedGradoId, setSelectedGradoId] = useState<number>(1);

    const oficialidadModal = useModal<{ id: number; name: string }>();
    const gradoModal = useModal<{ id: number; name: string }>();

    // Opciones únicas de grado derivadas de los datos
    const gradoFilterOptions = useMemo(() => {
        const seen = new Set<number>();
        return usuarios
            .filter((u) => {
                if (!u.gradoId || seen.has(u.gradoId)) return false;
                seen.add(u.gradoId);
                return true;
            })
            .map((u) => ({ value: u.gradoId as number, label: u.grado?.nombre as string }))
            .sort((a, b) => a.value - b.value);
    }, [usuarios]);

    // Opciones únicas de oficialidad derivadas de los datos (excluye oficialidadId <= 1)
    const oficialidadFilterOptions = useMemo(() => {
        const seen = new Set<number>();
        return usuarios
            .filter((u) => {
                if (!u.oficialidadId || u.oficialidadId <= 1 || seen.has(u.oficialidadId))
                    return false;
                seen.add(u.oficialidadId);
                return true;
            })
            .map((u) => ({
                value: u.oficialidadId as number,
                label: u.oficialidad?.nombre as string,
            }))
            .sort((a, b) => a.value - b.value);
    }, [usuarios]);

    const filters: FilterDef<Usuario>[] = [
        {
            label: 'Todos los grados',
            options: gradoFilterOptions,
            filterFn: (u, val) => u.gradoId === val,
        },
        {
            label: 'Todas las oficialidades',
            options: oficialidadFilterOptions,
            filterFn: (u, val) => u.oficialidadId === val,
            // Solo mostrar si hay al menos 1 opción de oficialidad
            minOptions: 1,
        },
    ];

    async function handleDeactivate(id: number, name: string) {
        if (!confirm(`¿Estás seguro de inactivar a ${name}?`)) return;
        const res = await deactivateUsuario(id);
        if (res.success) toast.success('Usuario inactivado');
        else toast.error(res.error as string);
    }

    async function handleResetPassword(id: number, name: string) {
        if (!confirm(`¿Estás seguro de restablecer la contraseña de ${name} a la predeterminada?`))
            return;
        const res = await resetPassword(id);
        if (res.success) toast.success('Contraseña restablecida');
        else toast.error(res.error as string);
    }

    async function handleUpdateCategory(userId: number, newCategoryId: number) {
        setCategoryDropdownUserId(null);
        const res = await updateUserCategory(userId, newCategoryId);
        if (res.success) toast.success('Categoría actualizada');
        else toast.error(res.error as string);
    }

    async function handleAssignGrado() {
        if (!gradoModal.data) return;
        const res = await assignGrado(gradoModal.data.id, selectedGradoId);
        if (res.success) {
            toast.success('Grado actualizado');
            gradoModal.close();
        } else {
            toast.error(res.error as string);
        }
    }

    async function handleAssignOficialidad() {
        if (!oficialidadModal.data) return;
        const res = await assignOficialidad(oficialidadModal.data.id, selectedOficialidadId);
        if (res.success) {
            toast.success('Oficialidad asignada');
            oficialidadModal.close();
        } else {
            toast.error(res.error as string);
        }
    }

    const columns: ColumnDef<Usuario>[] = [
        {
            header: 'Foto',
            headerClassName: 'w-[80px]',
            cell: (u) => (
                <Avatar>
                    <AvatarImage src={getCloudinaryImageUrl(u.image)} />
                    <AvatarFallback className="text-cg-primary-tonal bg-[rgba(90,103,216,0.15)] font-medium">
                        {u.name?.charAt(0)}
                        {u.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            ),
        },
        {
            header: 'Nombre Completo',
            cell: (u) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-cg-on-surface font-semibold">
                            {u.name} {u.lastName}
                        </span>
                        {u.active === false && (
                            <span className="rounded border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400 uppercase tracking-wider">
                                Inactivo
                            </span>
                        )}
                    </div>
                    {isAdmin && categories.length > 0 ? (
                        <div
                            className="relative"
                            ref={categoryDropdownUserId === u.id ? categoryDropdownRef : undefined}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setCategoryDropdownUserId(
                                        categoryDropdownUserId === u.id ? null : u.id,
                                    )
                                }
                                className="text-cg-on-surface-variant flex items-center gap-1 text-xs tracking-wider uppercase transition-colors hover:text-cg-primary-tonal"
                            >
                                {u.category?.nombre}
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            {categoryDropdownUserId === u.id && (
                                <div className="absolute top-full left-0 z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.95)] py-1 shadow-xl backdrop-blur-xl">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            disabled={cat.id === u.categoryId}
                                            onClick={() => handleUpdateCategory(u.id, cat.id)}
                                            className={cn(
                                                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                                                cat.id === u.categoryId
                                                    ? 'text-cg-primary-tonal bg-[rgba(90,103,216,0.1)] cursor-default'
                                                    : 'text-cg-on-surface hover:bg-[rgba(255,255,255,0.06)]',
                                            )}
                                        >
                                            {cat.nombre}
                                            {cat.id === u.categoryId && (
                                                <span className="ml-auto text-xs text-cg-primary-tonal">
                                                    ●
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="text-cg-on-surface-variant text-xs tracking-wider uppercase">
                            {u.category?.nombre}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Email / RUT',
            cell: (u) => (
                <div className="flex flex-col text-sm">
                    <span className="text-cg-on-surface-variant">{u.email}</span>
                    <span className="text-cg-outline font-mono text-xs">{u.username}</span>
                </div>
            ),
        },
        {
            header: 'Grado / Oficialidad',
            cell: (u) => (
                <div className="flex flex-col items-start gap-1">
                    <Badge
                        variant="outline"
                        className={cn(
                            'px-2 py-0',
                            u.gradoId === 3
                                ? 'text-cg-tertiary-tonal border-[rgba(155,255,206,0.2)] bg-[rgba(155,255,206,0.12)]'
                                : u.gradoId === 2
                                  ? 'text-cg-secondary-tonal border-[rgba(76,214,251,0.2)] bg-[rgba(76,214,251,0.12)]'
                                  : 'text-cg-primary-tonal border-[rgba(158,167,255,0.2)] bg-[rgba(158,167,255,0.12)]',
                        )}
                    >
                        {u.grado?.nombre}
                    </Badge>
                    {(u.oficialidadId ?? 0) > 1 && (
                        <span className="rounded border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] px-1.5 py-0.5 text-xs font-medium text-orange-400">
                            {u.oficialidad?.nombre}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Acciones',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            cell: (u) => (
                <div className="flex justify-end gap-1">
                    {/* Botón Ver siempre visible */}
                    <UserViewModal userId={u.id} userName={`${u.name} ${u.lastName}`} />

                    {!isViewOnly && (
                        <>
                            <Tooltip content="Editar Perfil">
                                <Button variant="outline" size="icon" asChild>
                                    <Link href={`/usuarios/${u.id}`}>
                                        <UserCog className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </Tooltip>

                            {isAdmin && (
                                <>
                                    {grados.length > 0 && (
                                        <Tooltip content="Cambiar Grado">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedGradoId(u.gradoId ?? 1);
                                                    gradoModal.open({
                                                        id: u.id,
                                                        name: `${u.name} ${u.lastName}`,
                                                    });
                                                }}
                                            >
                                                <GraduationCap className="h-4 w-4 text-emerald-400" />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {oficiales.length > 0 && (
                                        <Tooltip content="Asignar Oficialidad">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedOficialidadId(u.oficialidadId ?? 1);
                                                    oficialidadModal.open({
                                                        id: u.id,
                                                        name: `${u.name} ${u.lastName}`,
                                                    });
                                                }}
                                            >
                                                <Briefcase className="h-4 w-4 text-blue-400" />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    <Tooltip content="Restablecer Password">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleResetPassword(u.id, u.name ?? '')}
                                        >
                                            <Key className="h-4 w-4 text-amber-600" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Inactivar">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeactivate(u.id, u.name ?? '')}
                                        >
                                            <UserMinus className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </Tooltip>
                                </>
                            )}

                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={usuarios}
                columns={columns}
                keyExtractor={(u) => u.id}
                searchPlaceholder="Buscar por nombre, email o RUT…"
                searchFn={(u, q) =>
                    `${u.name} ${u.lastName}`.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q) ||
                    u.username?.toLowerCase().includes(q)
                }
                filters={filters}
                emptyMessage="No se encontraron miembros activos."
                emptyFilteredMessage="Sin resultados para los filtros aplicados."
            />

            {/* Modal cambio de grado — fuera del DataTable */}
            {gradoModal.data && (
                <Modal
                    open={gradoModal.isOpen}
                    onClose={gradoModal.close}
                    title={`Cambiar Grado — ${gradoModal.data.name}`}
                    size="sm"
                >
                    <div className="space-y-4 p-1">
                        <select
                            value={selectedGradoId}
                            onChange={(e) => setSelectedGradoId(Number(e.target.value))}
                            className="text-cg-on-surface h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                        >
                            {grados.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={gradoModal.close}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAssignGrado}>Guardar</Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal asignación de oficialidad — fuera del DataTable */}
            {oficialidadModal.data && (
                <Modal
                    open={oficialidadModal.isOpen}
                    onClose={oficialidadModal.close}
                    title={`Asignar Oficialidad — ${oficialidadModal.data.name}`}
                    size="sm"
                >
                    <div className="space-y-4 p-1">
                        <select
                            value={selectedOficialidadId}
                            onChange={(e) => setSelectedOficialidadId(Number(e.target.value))}
                            className="text-cg-on-surface h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                        >
                            {oficiales.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={oficialidadModal.close}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAssignOficialidad}>Guardar</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

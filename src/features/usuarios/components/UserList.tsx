'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { Briefcase, ChevronDown, GraduationCap, Key, Search, UserCog, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef, DataTable } from '@/shared/components/ui/data-table';
import { Modal } from '@/shared/components/ui/modal';
import { TablePagination } from '@/shared/components/ui/table-pagination';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { useModal } from '@/shared/hooks/useModal';
import { getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';
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
    /** ID de categoría del usuario autenticado */
    categoryId?: number;
    // Paginación server-side
    total?: number;
    page?: number;
    totalPages?: number;
    initialSearch?: string;
    initialGrado?: string;
    initialOficialidad?: string;
    initialActive?: string;
}

export function UserList({
    usuarios,
    currentUserCategory,
    grados = [],
    oficiales = [],
    categories = [],
    categoryId,
    total = 0,
    page = 1,
    totalPages = 1,
    initialSearch = '',
    initialGrado = '',
    initialOficialidad = '',
    initialActive = '',
}: UserListProps) {
    const isAdmin = currentUserCategory <= 2;
    const isViewOnly = (categoryId ?? currentUserCategory) === 3;
    const isSuperAdmin = currentUserCategory === 1;

    const router = useRouter();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [searchValue, setSearchValue] = useState(initialSearch);
    const [gradoValue, setGradoValue] = useState(initialGrado);
    const [oficialidadValue, setOficialidadValue] = useState(initialOficialidad);
    const [activeValue, setActiveValue] = useState(initialActive);

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
    const [confirmDeactivate, setConfirmDeactivate] = useState<{ id: number; name: string } | null>(null);
    const [confirmResetPwd, setConfirmResetPwd] = useState<{ id: number; name: string } | null>(null);

    const oficialidadModal = useModal<{ id: number; name: string }>();
    const gradoModal = useModal<{ id: number; name: string }>();

    function pushParams(updates: Record<string, string | undefined>): void {
        const params = new URLSearchParams(window.location.search);
        for (const [k, v] of Object.entries(updates)) {
            if (v) params.set(k, v);
            else params.delete(k);
        }
        params.delete('page');
        router.push(`?${params.toString()}`);
    }

    function handleSearchChange(value: string): void {
        setSearchValue(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            pushParams({ search: value || undefined });
        }, 400);
    }

    function handleGradoChange(value: string): void {
        setGradoValue(value);
        pushParams({ gradoId: value || undefined });
    }

    function handleOficialidadChange(value: string): void {
        setOficialidadValue(value);
        pushParams({ oficialidadId: value || undefined });
    }

    function handleActiveChange(value: string): void {
        setActiveValue(value);
        pushParams({ active: value || undefined });
    }

    function navigateToPage(newPage: number): void {
        const params = new URLSearchParams(window.location.search);
        params.set('page', String(newPage));
        router.push(`?${params.toString()}`);
    }

    async function handleDeactivate(id: number) {
        const res = await deactivateUsuario(id);
        if (res.success) toast.success('Usuario inactivado');
        else toast.error(res.error as string);
    }

    async function handleResetPassword(id: number) {
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

    const hasActiveFilter = searchValue || gradoValue || oficialidadValue || activeValue;

    // Opciones de oficialidad del prop (excluye id <= 1)
    const oficialidadOptions = oficiales.filter((o) => o.id > 1);

    const columns: ColumnDef<Usuario>[] = [
        {
            header: 'Foto',
            headerClassName: 'w-[80px]',
            cell: (u) => (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    {u.image ? (
                        <Image src={getCloudinaryRawImageUrl(u.image) as string} alt={`${u.name} ${u.lastName}`} width={600} height={600} className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-cg-primary-tonal flex h-full w-full items-center justify-center bg-[rgba(90,103,216,0.15)] font-medium">{u.name?.charAt(0)}{u.lastName?.charAt(0)}</div>
                    )}
                </div>
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
                <div className="flex flex-wrap justify-end gap-1">
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
                                            onClick={() => setConfirmResetPwd({ id: u.id, name: u.name ?? '' })}
                                        >
                                            <Key className="h-4 w-4 text-amber-600" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Inactivar">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setConfirmDeactivate({ id: u.id, name: u.name ?? '' })}
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
            {/* Barra de búsqueda y filtros — server-side */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                    <Search className="text-cg-outline absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o RUT…"
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="text-cg-on-surface placeholder:text-cg-outline h-9 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pr-3 pl-9 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                    />
                </div>
                {grados.length > 0 && (
                    <select
                        value={gradoValue}
                        onChange={(e) => handleGradoChange(e.target.value)}
                        className="text-cg-on-surface-variant h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                    >
                        <option value="">Todos los grados</option>
                        {grados.map((g) => (
                            <option key={g.id} value={String(g.id)}>
                                {g.nombre}
                            </option>
                        ))}
                    </select>
                )}
                {oficialidadOptions.length > 0 && (
                    <select
                        value={oficialidadValue}
                        onChange={(e) => handleOficialidadChange(e.target.value)}
                        className="text-cg-on-surface-variant h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                    >
                        <option value="">Todas las oficialidades</option>
                        {oficialidadOptions.map((o) => (
                            <option key={o.id} value={String(o.id)}>
                                {o.nombre}
                            </option>
                        ))}
                    </select>
                )}
                {isSuperAdmin && (
                    <select
                        value={activeValue}
                        onChange={(e) => handleActiveChange(e.target.value)}
                        className="text-cg-on-surface-variant h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                    >
                        <option value="">Todos los estados</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                )}
                {hasActiveFilter && (
                    <span className="text-cg-outline text-xs">
                        {total.toLocaleString('es-CL')} resultado{total !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <DataTable
                data={usuarios}
                columns={columns}
                keyExtractor={(u) => u.id}
                emptyMessage="No se encontraron miembros activos."
                emptyFilteredMessage="Sin resultados para los filtros aplicados."
                mobileCard={(u) => (
                    <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            {u.image ? (
                                <Image src={getCloudinaryRawImageUrl(u.image) as string} alt={`${u.name} ${u.lastName}`} width={600} height={600} className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-cg-primary-tonal flex h-full w-full items-center justify-center bg-[rgba(90,103,216,0.15)] font-medium">{u.name?.charAt(0)}{u.lastName?.charAt(0)}</div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-cg-on-surface font-semibold">
                                        {u.name} {u.lastName}
                                    </p>
                                    <p className="text-cg-on-surface-variant truncate text-xs">
                                        {u.email}
                                    </p>
                                    <p className="text-cg-outline font-mono text-xs">{u.username}</p>
                                </div>
                                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                                    <UserViewModal
                                        userId={u.id}
                                        userName={`${u.name} ${u.lastName}`}
                                    />
                                    {!isViewOnly && (
                                        <Tooltip content="Editar Perfil">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/usuarios/${u.id}`}>
                                                    <UserCog className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
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
                                {u.active === false && (
                                    <span className="rounded border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400 uppercase tracking-wider">
                                        Inactivo
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            />

            {/* Paginación server-side */}
            {totalPages > 1 && (
                <div className="border-t border-white/[0.06] pt-4">
                    <TablePagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={navigateToPage}
                    />
                </div>
            )}

            {/* Modal cambio de grado */}
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

            {/* Modal asignación de oficialidad */}
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

            {/* Dialogs de confirmación */}
            <ConfirmDialog
                open={confirmDeactivate !== null}
                onOpenChange={(open) => { if (!open) setConfirmDeactivate(null); }}
                title="Inactivar hermano"
                description={`¿Estás seguro de inactivar a ${confirmDeactivate?.name ?? ''}? Se restablecerá su contraseña a la predeterminada.`}
                confirmLabel="Inactivar"
                variant="danger"
                onConfirm={() => handleDeactivate(confirmDeactivate?.id ?? 0)}
            />
            <ConfirmDialog
                open={confirmResetPwd !== null}
                onOpenChange={(open) => { if (!open) setConfirmResetPwd(null); }}
                title="Restablecer contraseña"
                description={`¿Estás seguro de restablecer la contraseña de ${confirmResetPwd?.name ?? ''} a la predeterminada?`}
                confirmLabel="Restablecer"
                variant="warning"
                onConfirm={() => handleResetPassword(confirmResetPwd?.id ?? 0)}
            />
        </>
    );
}

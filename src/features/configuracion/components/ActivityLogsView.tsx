'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, X } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { TablePagination } from '@/shared/components/ui/table-pagination';
import { ACTIVITY_ACTION, ACTIVITY_ACTION_LABEL, ACTIVITY_ENTITY } from '@/shared/constants/activity-log';
import { cn } from '@/shared/lib/utils';

import { ActivityLogBadge } from './ActivityLogBadge';

interface LogItem {
    id: number;
    action: string;
    entity: string | null;
    entityId: string | null;
    description: string;
    status: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    metadata: unknown;
    userEmail: string | null;
    userName: string | null;
    user: { id: number; name: string | null; lastName: string | null; email: string } | null;
}

interface Usuario {
    id: number;
    name: string | null;
    lastName: string | null;
    email: string;
}

interface ActivityLogsViewProps {
    items: LogItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    usuarios: Usuario[];
    currentFilters: Record<string, string | undefined>;
}

export function ActivityLogsView({
    items,
    total,
    page,
    totalPages,
    usuarios,
    currentFilters,
}: ActivityLogsViewProps): React.ReactElement {
    const router = useRouter();

    const buildUrl = useCallback(
        (overrides: Record<string, string | undefined>): string => {
            const params = new URLSearchParams();
            const merged = { ...currentFilters, ...overrides };
            for (const [k, v] of Object.entries(merged)) {
                if (v !== undefined && v !== '') params.set(k, v);
            }
            return `/configuracion/logs?${params.toString()}`;
        },
        [currentFilters],
    );

    function handleFilter(key: string, value: string): void {
        router.push(buildUrl({ [key]: value || undefined, page: '1' }));
    }

    function handleSearch(q: string): void {
        router.push(buildUrl({ q: q || undefined, page: '1' }));
    }

    function handlePageChange(newPage: number): void {
        router.push(buildUrl({ page: String(newPage) }));
    }

    function clearFilters(): void {
        router.push('/configuracion/logs');
    }

    const actionOptions = Object.values(ACTIVITY_ACTION);
    const entityOptions = Object.values(ACTIVITY_ENTITY);
    const hasActiveFilter = Object.entries(currentFilters).some(
        ([k, v]) => k !== 'page' && v !== undefined && v !== '',
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-[#e7e6fc]">Bitácora de Actividad</h1>
                    <p className="mt-0.5 text-sm text-[#747487]">
                        {total.toLocaleString('es-CL')} registro{total !== 1 ? 's' : ''} en total
                    </p>
                </div>
                {hasActiveFilter && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-xs text-[#aaa9be] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e7e6fc]"
                    >
                        <X className="h-3 w-3" />
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Búsqueda de texto */}
                <div className="relative min-w-[200px] flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#747487]" />
                    <input
                        type="text"
                        placeholder="Buscar en descripción…"
                        defaultValue={currentFilters.q ?? ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch((e.target as HTMLInputElement).value);
                            }
                        }}
                        onBlur={(e) => handleSearch(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pr-3 pl-9 text-sm text-[#e7e6fc] placeholder:text-[#747487] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                    />
                </div>

                {/* Acción */}
                <select
                    value={currentFilters.action ?? ''}
                    onChange={(e) => handleFilter('action', e.target.value)}
                    className="h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm text-[#aaa9be] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                >
                    <option value="">Todas las acciones</option>
                    {actionOptions.map((a) => (
                        <option key={a} value={a}>
                            {ACTIVITY_ACTION_LABEL[a as keyof typeof ACTIVITY_ACTION_LABEL] ?? a}
                        </option>
                    ))}
                </select>

                {/* Entidad */}
                <select
                    value={currentFilters.entity ?? ''}
                    onChange={(e) => handleFilter('entity', e.target.value)}
                    className="h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm text-[#aaa9be] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                >
                    <option value="">Todas las entidades</option>
                    {entityOptions.map((e) => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>

                {/* Usuario */}
                {usuarios.length > 0 && (
                    <select
                        value={currentFilters.userId ?? ''}
                        onChange={(e) => handleFilter('userId', e.target.value)}
                        className="h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm text-[#aaa9be] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                    >
                        <option value="">Todos los usuarios</option>
                        {usuarios.map((u) => (
                            <option key={u.id} value={String(u.id)}>
                                {u.name} {u.lastName}
                            </option>
                        ))}
                    </select>
                )}

                {/* Desde */}
                <input
                    type="date"
                    value={currentFilters.from ?? ''}
                    onChange={(e) => handleFilter('from', e.target.value)}
                    className="h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm text-[#aaa9be] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                />

                {/* Hasta */}
                <input
                    type="date"
                    value={currentFilters.to ?? ''}
                    onChange={(e) => handleFilter('to', e.target.value)}
                    className="h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm text-[#aaa9be] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                />
            </div>

            {/* Tabla */}
            <div className="cg-table-container">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[rgba(255,255,255,0.03)]">
                            <TableHead className="w-[140px]">Fecha</TableHead>
                            <TableHead className="w-[160px]">Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead className="w-[100px]">Entidad</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="w-[100px]">IP</TableHead>
                            <TableHead className="w-[80px]">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center italic text-[#747487]"
                                >
                                    No hay registros para los filtros aplicados.
                                </TableCell>
                            </TableRow>
                        )}
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                className={cn(
                                    'transition-colors hover:bg-[rgba(255,255,255,0.04)]',
                                    item.status === 'failure' && 'bg-red-500/5',
                                )}
                            >
                                <TableCell className="text-xs text-[#747487] tabular-nums">
                                    {format(new Date(item.createdAt), 'dd/MM/yy HH:mm', {
                                        locale: es,
                                    })}
                                </TableCell>
                                <TableCell>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs text-[#e7e6fc]">
                                            {item.userName ?? item.userEmail ?? '—'}
                                        </p>
                                        {item.userEmail && item.userName && (
                                            <p className="truncate text-[10px] text-[#747487]">
                                                {item.userEmail}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <ActivityLogBadge value={item.action} type="action" />
                                </TableCell>
                                <TableCell className="text-xs text-[#aaa9be]">
                                    {item.entity ?? '—'}
                                    {item.entityId && (
                                        <span className="ml-1 text-[#747487]">#{item.entityId}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-[300px] truncate text-xs text-[#aaa9be]">
                                        {item.description}
                                    </p>
                                    {item.metadata !== null && (
                                        <details className="mt-0.5">
                                            <summary className="cursor-pointer text-[10px] text-[#5a67d8] hover:underline">
                                                ver metadata
                                            </summary>
                                            <pre className="mt-1 max-w-[400px] overflow-x-auto rounded bg-[rgba(0,0,0,0.3)] p-2 text-[10px] text-[#aaa9be]">
                                                {JSON.stringify(item.metadata, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                    {item.userAgent && (
                                        <p className="mt-0.5 max-w-[300px] truncate text-[10px] text-[#464658]">
                                            {item.userAgent}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-[#747487]">
                                    {item.ipAddress ?? '—'}
                                </TableCell>
                                <TableCell>
                                    <ActivityLogBadge value={item.status} type="status" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

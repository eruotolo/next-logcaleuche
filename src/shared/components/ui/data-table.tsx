'use client';

import { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { TablePagination } from '@/shared/components/ui/table-pagination';

export interface ColumnDef<T> {
    header: string;
    headerClassName?: string;
    cell: (item: T) => React.ReactNode;
    cellClassName?: string;
}

export interface FilterOption {
    value: string | number;
    label: string;
}

export interface FilterDef<T> {
    /** Placeholder del select, e.g. "Todas las categorías" */
    label: string;
    options: FilterOption[];
    filterFn: (item: T, value: string | number) => boolean;
    /**
     * Si se indica, el select solo se renderiza cuando la cantidad de opciones
     * cumple esta condición. Por defecto siempre se muestra.
     * Útil para el filtro de año en tesorería que solo aparece si hay > 1 año.
     */
    minOptions?: number;
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    keyExtractor: (item: T) => string | number;
    searchPlaceholder?: string;
    searchFn?: (item: T, query: string) => boolean;
    filters?: FilterDef<T>[];
    emptyMessage?: string;
    emptyFilteredMessage?: string;
    /** Cuántos ítems por página. Por defecto 6. */
    pageSize?: number;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    searchPlaceholder = 'Buscar…',
    searchFn,
    filters = [],
    emptyMessage = 'No hay registros.',
    emptyFilteredMessage = 'Sin resultados para los filtros aplicados.',
    pageSize = 6,
}: DataTableProps<T>) {
    const [query, setQuery] = useState('');
    // Un estado de filtro por cada FilterDef ('' = sin filtrar)
    const [filterValues, setFilterValues] = useState<(string | number)[]>(() =>
        filters.map(() => ''),
    );
    const [page, setPage] = useState(1);

    // Aplica búsqueda y todos los filtros con useMemo
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return data.filter((item) => {
            const matchQuery = !q || !searchFn || searchFn(item, q);
            const matchFilters = filters.every((f, i) => {
                const val = filterValues[i];
                return val === '' || f.filterFn(item, val);
            });
            return matchQuery && matchFilters;
        });
    }, [data, query, filterValues, filters, searchFn]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const hasActiveFilter = query.length > 0 || filterValues.some((v) => v !== '');

    function handleQueryChange(value: string) {
        setQuery(value);
        setPage(1);
    }

    function handleFilterChange(index: number, value: string | number) {
        setFilterValues((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
        setPage(1);
    }

    return (
        <>
            {/* Barra de búsqueda y filtros */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                {searchFn && (
                    <div className="relative min-w-[200px] flex-1">
                        <Search className="text-cg-outline absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            className="text-cg-on-surface placeholder:text-cg-outline h-9 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pr-3 pl-9 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                        />
                    </div>
                )}

                {filters.map((f, i) => {
                    // Si minOptions está definido, solo renderizar cuando se cumple la condición
                    if (f.minOptions !== undefined && f.options.length < f.minOptions) {
                        return null;
                    }
                    const rawVal = filterValues[i];
                    // El select siempre trabaja con strings; el filterFn recibe lo que el usuario pasa
                    const selectVal = rawVal === '' ? '' : String(rawVal);
                    return (
                        <select
                            key={f.label}
                            value={selectVal}
                            onChange={(e) => {
                                const raw = e.target.value;
                                // Si la opción es '' no aplicamos conversión
                                if (raw === '') {
                                    handleFilterChange(i, '');
                                } else {
                                    // Intentamos mantener el tipo original de la primera opción
                                    const firstOptionType = typeof f.options[0]?.value;
                                    handleFilterChange(
                                        i,
                                        firstOptionType === 'number' ? Number(raw) : raw,
                                    );
                                }
                            }}
                            className="text-cg-on-surface-variant h-9 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,35,0.9)] px-3 text-sm focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                        >
                            <option value="">{f.label}</option>
                            {f.options.map((opt) => (
                                <option key={String(opt.value)} value={String(opt.value)}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    );
                })}

                {hasActiveFilter && (
                    <span className="text-cg-outline text-xs">
                        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="cg-table-container">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[rgba(255,255,255,0.03)]">
                            {columns.map((col) => (
                                <TableHead key={col.header} className={col.headerClassName}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.map((item) => (
                            <TableRow
                                key={keyExtractor(item)}
                                className="transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                            >
                                {columns.map((col) => (
                                    <TableCell key={col.header} className={col.cellClassName}>
                                        {col.cell(item)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-cg-on-surface-variant h-24 text-center italic"
                                >
                                    {hasActiveFilter ? emptyFilteredMessage : emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
}

'use client';

import { useMemo, useState } from 'react';

import { Download, Search } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { TablePagination } from '@/shared/components/ui/table-pagination';
import { cn } from '@/shared/lib/utils';

export interface ColumnDef<T> {
    header: string;
    headerClassName?: string;
    cell: (item: T) => React.ReactNode;
    cellClassName?: string;
}

interface FilterOption {
    value: string | number;
    label: string;
}

interface FilterDef<T> {
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

interface CsvColumnDef<T> {
    header: string;
    getValue: (item: T) => string | number;
}

interface DataTableProps<T> {
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
    /** Página actual (controlada externamente). Si se omite, se usa estado interno. */
    page?: number;
    /** Callback cuando la página cambia (requerido si se usa page controlada). */
    onPageChange?: (page: number) => void;
    /**
     * Render alternativo para mobile (<768px). Si se provee, las filas se renderizan
     * como cards apiladas en mobile. En desktop (md+) se muestra la tabla normal.
     */
    mobileCard?: (item: T) => React.ReactNode;
    /**
     * Si se provee, aparece un botón "Exportar CSV" que descarga los datos filtrados.
     * Cada entrada define el encabezado de columna y cómo extraer el valor del ítem.
     */
    csvColumns?: CsvColumnDef<T>[];
    /** Nombre del archivo CSV sin extensión. Por defecto "exportacion". */
    csvFilename?: string;
}

function exportToCsv<T>(data: T[], cols: CsvColumnDef<T>[], filename: string): void {
    const header = cols.map((c) => `"${c.header}"`).join(',');
    const rows = data.map((item) =>
        cols.map((c) => `"${String(c.getValue(item)).replace(/"/g, '""')}"`).join(','),
    );
    const csv = [header, ...rows].join('\r\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    page: externalPage,
    onPageChange: externalOnPageChange,
    mobileCard,
    csvColumns,
    csvFilename = 'exportacion',
}: DataTableProps<T>) {
    const [query, setQuery] = useState('');
    // Un estado de filtro por cada FilterDef ('' = sin filtrar)
    const [filterValues, setFilterValues] = useState<(string | number)[]>(() =>
        filters.map(() => ''),
    );
    const [internalPage, setInternalPage] = useState(1);

    // Soporte de página controlada: si el padre pasa `page`, se usa ese valor;
    // de lo contrario se gestiona internamente.
    const page = externalPage ?? internalPage;

    function setPage(newPage: number) {
        if (externalPage !== undefined) {
            externalOnPageChange?.(newPage);
        } else {
            setInternalPage(newPage);
        }
    }

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

                {csvColumns && (
                    <button
                        type="button"
                        onClick={() => exportToCsv(filtered, csvColumns, csvFilename)}
                        className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 text-xs text-[#aaa9be] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e7e6fc]"
                        aria-label="Exportar datos como CSV"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Exportar CSV
                    </button>
                )}
            </div>

            {/* Vista cards — solo mobile, si el consumidor provee mobileCard */}
            {mobileCard && (
                <div className="space-y-3 md:hidden">
                    {paged.map((item) => (
                        <div key={keyExtractor(item)}>{mobileCard(item)}</div>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-cg-on-surface-variant py-8 text-center text-sm italic">
                            {hasActiveFilter ? emptyFilteredMessage : emptyMessage}
                        </p>
                    )}
                    <TablePagination
                        currentPage={safePage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <div className={cn('cg-table-container', mobileCard && 'hidden md:block')}>
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

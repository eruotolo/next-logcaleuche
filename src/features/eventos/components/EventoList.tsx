'use client';

import { useMemo } from 'react';

import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef, DataTable, type FilterDef } from '@/shared/components/ui/data-table';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { formatDate } from '@/shared/lib/utils';

import { deleteEvento } from '../actions';

interface Evento {
    id: number;
    nombre: string;
    trabajo: string;
    fecha: Date | null;
    category: { id: number; nombre: string } | null;
}

interface EventoListProps {
    eventos: Evento[];
    isAdmin: boolean;
}

function categoryColor(id: number | undefined): string {
    if (id === 1)
        return 'bg-[rgba(158,167,255,0.12)] text-cg-primary-tonal border-[rgba(158,167,255,0.2)]';
    if (id === 2)
        return 'bg-[rgba(76,214,251,0.12)] text-cg-secondary-tonal border-[rgba(76,214,251,0.2)]';
    if (id === 3)
        return 'bg-[rgba(155,255,206,0.12)] text-cg-tertiary-tonal border-[rgba(155,255,206,0.2)]';
    return 'bg-[rgba(255,255,255,0.06)] text-cg-on-surface-variant border-[rgba(255,255,255,0.1)]';
}

async function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Cancelar el evento "${nombre}"?`)) return;
    const res = await deleteEvento(id);
    if (res.success) toast.success('Evento cancelado');
    else toast.error(res.error);
}

export function EventoList({ eventos, isAdmin }: EventoListProps) {
    // Opciones de categoría derivadas de los datos
    const categoriaOptions = useMemo(() => {
        const seen = new Set<number>();
        return eventos
            .filter((e) => {
                if (!e.category?.id || seen.has(e.category.id)) return false;
                seen.add(e.category.id);
                return true;
            })
            .map((e) => ({ value: e.category?.id ?? 0, label: e.category?.nombre ?? '' }))
            .sort((a, b) => a.value - b.value);
    }, [eventos]);

    const filters: FilterDef<Evento>[] = [
        {
            label: 'Todas las categorías',
            options: categoriaOptions,
            filterFn: (e, val) => e.category?.id === val,
        },
    ];

    // Columna de acciones solo si isAdmin
    const actionColumn: ColumnDef<Evento> = {
        header: 'Acciones',
        headerClassName: 'text-right',
        cellClassName: 'text-right',
        cell: (e) => (
            <Tooltip content="Cancelar evento">
                <Button variant="outline" size="icon" onClick={() => handleDelete(e.id, e.nombre)}>
                    <Trash className="text-cg-error h-4 w-4" />
                </Button>
            </Tooltip>
        ),
    };

    const columns: ColumnDef<Evento>[] = [
        {
            header: 'Evento',
            cellClassName: 'font-semibold text-cg-on-surface',
            cell: (e) => e.nombre,
        },
        {
            header: 'Tipo de Trabajo',
            cellClassName: 'text-sm text-cg-on-surface-variant',
            cell: (e) => e.trabajo,
        },
        {
            header: 'Fecha',
            cellClassName: 'text-sm text-cg-on-surface-variant',
            cell: (e) => (e.fecha ? formatDate(e.fecha) : '—'),
        },
        {
            header: 'Categoría',
            cell: (e) => (
                <Badge variant="outline" className={categoryColor(e.category?.id)}>
                    {e.category?.nombre ?? 'Sin categoría'}
                </Badge>
            ),
        },
        ...(isAdmin ? [actionColumn] : []),
    ];

    return (
        <DataTable
            data={eventos}
            columns={columns}
            keyExtractor={(e) => e.id}
            searchPlaceholder="Buscar por nombre de evento…"
            searchFn={(e, q) => e.nombre.toLowerCase().includes(q)}
            filters={filters}
            emptyMessage="No hay eventos próximos."
            emptyFilteredMessage="Sin resultados para los filtros aplicados."
        />
    );
}

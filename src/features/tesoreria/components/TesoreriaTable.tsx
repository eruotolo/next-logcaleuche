'use client';

import { useMemo, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Mail, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { type ColumnDef, DataTable, type FilterDef } from '@/shared/components/ui/data-table';
import { Modal } from '@/shared/components/ui/modal';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { useModal } from '@/shared/hooks/useModal';
import { formatDate } from '@/shared/lib/utils';

import { deleteEntrada, deleteSalida, sendBoletaManual } from '../actions';
import { EditEntradaForm } from './EditEntradaForm';
import { EditSalidaForm } from './EditSalidaForm';

const MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

interface EntradaRow {
    id: number;
    mes: string | null;
    ano: string | null;
    monto: unknown;
    fechaMov: Date;
    userId?: number | null;
    motivoId?: number | null;
    user: { name: string | null; lastName: string | null } | null;
    motivo: { id?: number; nombre: string } | null;
}

interface SalidaRow {
    id: number;
    mes: string | null;
    ano: string | null;
    monto: unknown;
    fechaMov: Date;
    motivoId?: number | null;
    user: { name: string | null; lastName: string | null } | null;
    motivo: { id?: number; nombre: string } | null;
}

type Row = EntradaRow | SalidaRow;

interface TesoreriaTableProps {
    rows: Row[];
    tipo: 'ingreso' | 'egreso';
    motivos?: { id: number; nombre: string }[];
    usuarios?: { id: number; name: string | null; lastName: string | null }[];
}

function formatClp(val: unknown): string {
    const num = Number(val ?? 0);
    return num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

function ActionsCell({
    row,
    tipo,
    onEdit,
}: {
    row: Row;
    tipo: 'ingreso' | 'egreso';
    onEdit: (row: Row) => void;
}) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        if (!confirm('¿Confirmas eliminar este registro?')) return;
        startTransition(async () => {
            const result =
                tipo === 'ingreso' ? await deleteEntrada(row.id) : await deleteSalida(row.id);
            if (result.success) {
                toast.success('Registro eliminado.');
            } else {
                toast.error(result.error);
            }
        });
    }

    function handleSendBoleta() {
        startTransition(async () => {
            const result = await sendBoletaManual(row.id);
            if (result.success) {
                toast.success('Boleta enviada por email.');
            } else {
                toast.error(result.error);
            }
        });
    }

    return (
        <div className="flex items-center justify-end gap-1">
            {tipo === 'ingreso' && (
                <Tooltip content="Reenviar boleta">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleSendBoleta}
                        className="text-cg-outline hover:text-cg-primary-tonal cursor-pointer rounded p-1.5 transition-colors hover:bg-[rgba(90,103,216,0.12)] disabled:opacity-50"
                    >
                        <Mail className="h-4 w-4" />
                    </button>
                </Tooltip>
            )}
            <Tooltip content="Editar">
                <button
                    type="button"
                    onClick={() => onEdit(row)}
                    className="text-cg-outline cursor-pointer rounded p-1.5 transition-colors hover:bg-[rgba(242,156,19,0.12)] hover:text-[var(--color-total)]"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </Tooltip>
            <Tooltip content="Eliminar">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={handleDelete}
                    className="text-cg-outline hover:text-cg-error cursor-pointer rounded p-1.5 transition-colors hover:bg-[rgba(255,110,132,0.12)] disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </Tooltip>
        </div>
    );
}

export function TesoreriaTable({ rows, tipo, motivos = [], usuarios = [] }: TesoreriaTableProps) {
    const editModal = useModal<Row>();
    const router = useRouter();
    // Estado de página elevado aquí para sobrevivir a router.refresh()
    const [page, setPage] = useState(1);

    // Años disponibles derivados de los datos (para filtro condicional)
    const anoOptions = useMemo(() => {
        const years = [...new Set(rows.map((r) => r.ano).filter(Boolean))].sort().reverse();
        return (years as string[]).map((a) => ({ value: a, label: a }));
    }, [rows]);

    const filters: FilterDef<Row>[] = [
        {
            label: 'Todos los meses',
            options: MESES.map((m) => ({ value: m, label: m })),
            filterFn: (r, val) => r.mes === val,
        },
        {
            label: 'Todos los años',
            options: anoOptions,
            filterFn: (r, val) => r.ano === val,
            // Solo mostrar el select de año cuando hay más de 1 año disponible
            minOptions: 2,
        },
    ];

    function handleEditSuccess() {
        editModal.close();
        router.refresh();
    }

    const columns: ColumnDef<Row>[] = [
        {
            header: 'Miembro',
            cellClassName: 'text-sm text-cg-on-surface',
            cell: (r) => (r.user ? `${r.user.name ?? ''} ${r.user.lastName ?? ''}`.trim() : '—'),
        },
        {
            header: 'Motivo',
            cellClassName: 'text-sm text-cg-on-surface-variant',
            cell: (r) => r.motivo?.nombre ?? '—',
        },
        {
            header: 'Mes / Año',
            cellClassName: 'text-sm text-cg-outline',
            cell: (r) => `${r.mes ?? ''} ${r.ano ?? ''}`.trim(),
        },
        {
            header: 'Fecha',
            cellClassName: 'text-sm text-cg-outline',
            cell: (r) => formatDate(r.fechaMov),
        },
        {
            header: 'Monto',
            headerClassName: 'text-right',
            cellClassName: 'text-right text-sm font-semibold',
            cell: (r) => (
                <span
                    className={
                        tipo === 'ingreso'
                            ? 'text-[var(--color-entrada)]'
                            : 'text-[var(--color-salida)]'
                    }
                >
                    {formatClp(r.monto)}
                </span>
            ),
        },
        {
            header: 'Acciones',
            headerClassName: 'w-[100px] text-right',
            cell: (r) => <ActionsCell row={r} tipo={tipo} onEdit={(row) => editModal.open(row)} />,
        },
    ];

    const editingRow = editModal.data;

    return (
        <>
            <DataTable
                data={rows}
                columns={columns}
                keyExtractor={(r) => r.id}
                page={page}
                onPageChange={setPage}
                searchPlaceholder="Buscar por miembro o motivo…"
                searchFn={(r, q) => {
                    const miembro = `${r.user?.name ?? ''} ${r.user?.lastName ?? ''}`.toLowerCase();
                    const motivo = r.motivo?.nombre?.toLowerCase() ?? '';
                    return miembro.includes(q) || motivo.includes(q);
                }}
                filters={filters}
                emptyMessage="No hay registros."
                emptyFilteredMessage="Sin resultados para los filtros aplicados."
            />

            {editingRow && tipo === 'ingreso' && (
                <Modal
                    open={editModal.isOpen}
                    onClose={editModal.close}
                    title={`Editar Ingreso #${editingRow.id}`}
                    size="md"
                >
                    <EditEntradaForm
                        id={editingRow.id}
                        entrada={{
                            userId: (editingRow as EntradaRow).userId ?? null,
                            mes: editingRow.mes,
                            ano: editingRow.ano,
                            motivoId: editingRow.motivoId ?? editingRow.motivo?.id ?? null,
                            monto: editingRow.monto,
                            fechaMov: editingRow.fechaMov,
                        }}
                        usuarios={usuarios}
                        motivos={motivos}
                        onSuccess={handleEditSuccess}
                    />
                </Modal>
            )}

            {editingRow && tipo === 'egreso' && (
                <Modal
                    open={editModal.isOpen}
                    onClose={editModal.close}
                    title={`Editar Egreso #${editingRow.id}`}
                    size="sm"
                >
                    <EditSalidaForm
                        id={editingRow.id}
                        salida={{
                            mes: editingRow.mes,
                            ano: editingRow.ano,
                            motivoId: editingRow.motivoId ?? editingRow.motivo?.id ?? null,
                            monto: editingRow.monto,
                            fechaMov: editingRow.fechaMov,
                        }}
                        motivos={motivos}
                        onSuccess={handleEditSuccess}
                    />
                </Modal>
            )}
        </>
    );
}

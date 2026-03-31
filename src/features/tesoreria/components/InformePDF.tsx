import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import type { getInforme } from '../actions';

// ── Colores del sistema ──────────────────────────────────────────────────────
const COLORS = {
    primary: '#2980b9',
    entrada: '#41a65a',
    salida: '#e74c3c',
    total: '#f29c13',
    hospital: '#41729D',
    headerBg: '#1a1a2e',
    headerText: '#ffffff',
    rowAlt: '#f7f9fc',
    rowEven: '#ffffff',
    border: '#dde3ea',
    labelText: '#6b7280',
    bodyText: '#1f2937',
    deuda: '#e74c3c',
    pagado: '#41a65a',
};

// Registrar Helvetica (built-in, no requiere fuente externa)
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        paddingTop: 32,
        paddingBottom: 48,
        paddingHorizontal: 32,
        color: COLORS.bodyText,
        backgroundColor: '#ffffff',
    },
    // ── Header ────────────────────────────────────────────────────────────────
    header: {
        backgroundColor: COLORS.headerBg,
        borderRadius: 6,
        padding: 16,
        marginBottom: 16,
    },
    headerTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 16,
        color: COLORS.headerText,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#a0aec0',
        marginBottom: 2,
    },
    headerMeta: {
        fontSize: 8,
        color: '#718096',
    },
    // ── Sección ───────────────────────────────────────────────────────────────
    section: {
        marginBottom: 14,
    },
    sectionTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
        color: COLORS.primary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        paddingBottom: 3,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    // ── Cards resumen ─────────────────────────────────────────────────────────
    cardsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },
    card: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        borderWidth: 1,
    },
    cardLabel: {
        fontSize: 7,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
        fontFamily: 'Helvetica-Bold',
    },
    cardValue: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 13,
    },
    // ── Tabla ─────────────────────────────────────────────────────────────────
    table: {
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: COLORS.headerBg,
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    tableHeaderCell: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: '#a0aec0',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    tableRowAlt: {
        backgroundColor: COLORS.rowAlt,
    },
    tableCell: {
        fontSize: 8,
        color: COLORS.bodyText,
    },
    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 24,
        left: 32,
        right: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 6,
    },
    footerText: {
        fontSize: 7,
        color: '#9ca3af',
    },
    pageNumber: {
        fontSize: 7,
        color: '#9ca3af',
    },
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatClp(val: number): string {
    // Intl no disponible en react-pdf — formato manual
    const abs = Math.abs(Math.round(val));
    const str = abs.toLocaleString('es-CL');
    return `${val < 0 ? '-' : ''}$${str}`;
}

function formatDatePdf(date: Date | string | null): string {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

type InformeData = Awaited<ReturnType<typeof getInforme>>;

interface Props {
    data: InformeData;
    tipo: string;
    periodoLabel: string;
}

// ── Componente principal ──────────────────────────────────────────────────────
export function InformePDF({ data, tipo, periodoLabel }: Props) {
    const generadoEl = formatDatePdf(new Date());

    return (
        <Document
            title={`Informe Tesorería — ${periodoLabel}`}
            author="Logia Caleuche N° 250"
            subject="Informe de Tesorería"
        >
            {/* ── Página 1: Resumen + Movimientos por Mes + Detalle ── */}
            <Page size="A4" style={styles.page} wrap>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>LOGIA CALEUCHE N° 250</Text>
                    <Text style={styles.headerSubtitle}>Informe de Tesorería — {periodoLabel}</Text>
                    <Text style={styles.headerMeta}>
                        Generado: {generadoEl} · Tipo: {tipo}
                    </Text>
                </View>

                {/* ── Resumen General ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen del Período</Text>
                    <View style={styles.cardsRow}>
                        <View
                            style={[
                                styles.card,
                                { borderColor: COLORS.entrada, backgroundColor: '#f0faf3' },
                            ]}
                        >
                            <Text style={[styles.cardLabel, { color: COLORS.entrada }]}>
                                Ingresos
                            </Text>
                            <Text style={[styles.cardValue, { color: COLORS.entrada }]}>
                                {formatClp(data.totalIngresos)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.card,
                                { borderColor: COLORS.deuda, backgroundColor: '#fff5f5' },
                            ]}
                        >
                            <Text style={[styles.cardLabel, { color: COLORS.deuda }]}>Egresos</Text>
                            <Text style={[styles.cardValue, { color: COLORS.deuda }]}>
                                {formatClp(data.totalEgresos)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.card,
                                { borderColor: COLORS.total, backgroundColor: '#fffbf0' },
                            ]}
                        >
                            <Text style={[styles.cardLabel, { color: COLORS.total }]}>
                                Saldo Período
                            </Text>
                            <Text style={[styles.cardValue, { color: COLORS.total }]}>
                                {formatClp(data.saldo)}
                            </Text>
                        </View>
                    </View>
                    {/* Segunda fila: histórico global */}
                    <View style={styles.cardsRow}>
                        <View
                            style={[
                                styles.card,
                                { borderColor: COLORS.primary, backgroundColor: '#eef6fd' },
                            ]}
                        >
                            <Text style={[styles.cardLabel, { color: COLORS.primary }]}>
                                Total en Caja (histórico)
                            </Text>
                            <Text style={[styles.cardValue, { color: COLORS.primary }]}>
                                {formatClp(data.historico.saldo)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.card,
                                { borderColor: COLORS.hospital, backgroundColor: '#eef2f7' },
                            ]}
                        >
                            <Text style={[styles.cardLabel, { color: COLORS.hospital }]}>
                                Caja Hospitalaria
                            </Text>
                            <Text style={[styles.cardValue, { color: COLORS.hospital }]}>
                                {formatClp(data.historico.hospitalaria)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── Estadísticas por Mes (solo informe anual) ── */}
                {data.movimientosPorMes.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Estadísticas por Mes — {data.anoReporte}
                        </Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { width: '28%' }]}>Mes</Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '24%', textAlign: 'right' },
                                    ]}
                                >
                                    Ingresos
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '24%', textAlign: 'right' },
                                    ]}
                                >
                                    Egresos
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '24%', textAlign: 'right' },
                                    ]}
                                >
                                    Saldo
                                </Text>
                            </View>
                            {data.movimientosPorMes.map((m, i) => (
                                <View
                                    key={m.mes}
                                    style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
                                >
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: '28%', fontFamily: 'Helvetica-Bold' },
                                        ]}
                                    >
                                        {m.mes}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                width: '24%',
                                                textAlign: 'right',
                                                color: COLORS.entrada,
                                            },
                                        ]}
                                    >
                                        {formatClp(m.ingresos)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                width: '24%',
                                                textAlign: 'right',
                                                color: COLORS.deuda,
                                            },
                                        ]}
                                    >
                                        {formatClp(m.egresos)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            {
                                                width: '24%',
                                                textAlign: 'right',
                                                fontFamily: 'Helvetica-Bold',
                                            },
                                        ]}
                                    >
                                        {formatClp(m.saldo)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Logia Caleuche N° 250 — Informe de Tesorería
                    </Text>
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `Página ${pageNumber} de ${totalPages}`
                        }
                    />
                </View>
            </Page>

            {/* ── Página 2: Estado de Cuotas ── */}
            <Page size="A4" style={styles.page} wrap>
                {/* Header reducido */}
                <View style={[styles.header, { marginBottom: 12 }]}>
                    <Text style={[styles.headerTitle, { fontSize: 13 }]}>
                        LOGIA CALEUCHE N° 250
                    </Text>
                    <Text style={styles.headerSubtitle}>Estado de Cuotas — {data.anoReporte}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estado de Cuotas por Miembro</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: '28%' }]}>Miembro</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    { width: '14%', textAlign: 'right' },
                                ]}
                            >
                                Cuota/mes
                            </Text>
                            <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
                                Meses pagados
                            </Text>
                            <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
                                Pendientes
                            </Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    { width: '14%', textAlign: 'right' },
                                ]}
                            >
                                Deuda
                            </Text>
                        </View>
                        {data.estadoCuotas.map((u, i) => (
                            <View
                                key={u.username}
                                style={[
                                    styles.tableRow,
                                    i % 2 === 1 ? styles.tableRowAlt : {},
                                    u.deudaTotal > 0 ? { backgroundColor: '#fff5f5' } : {},
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { width: '28%', fontFamily: 'Helvetica-Bold' },
                                    ]}
                                >
                                    {u.nombre}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: '14%',
                                            textAlign: 'right',
                                            color: COLORS.labelText,
                                        },
                                    ]}
                                >
                                    {formatClp(u.cuotaMensual)}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { width: '22%', color: COLORS.pagado, fontSize: 7 },
                                    ]}
                                >
                                    {u.mesesPagados.length > 0
                                        ? u.mesesPagados.join(', ')
                                        : 'Ninguno'}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: '22%',
                                            color:
                                                u.mesesPendientes.length > 0
                                                    ? COLORS.deuda
                                                    : COLORS.pagado,
                                            fontSize: 7,
                                        },
                                    ]}
                                >
                                    {u.mesesPendientes.length > 0
                                        ? u.mesesPendientes.join(', ')
                                        : 'Todos pagados'}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: '14%',
                                            textAlign: 'right',
                                            fontFamily: 'Helvetica-Bold',
                                            color: u.deudaTotal > 0 ? COLORS.deuda : COLORS.pagado,
                                        },
                                    ]}
                                >
                                    {u.deudaTotal > 0 ? formatClp(u.deudaTotal) : 'Sin deuda'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Top Motivos ── */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Top Motivos — Ingresos</Text>
                        {data.topIngresos.map((t, i) => (
                            <View
                                key={t.nombre}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 3,
                                    borderBottomWidth: i < data.topIngresos.length - 1 ? 1 : 0,
                                    borderBottomColor: COLORS.border,
                                }}
                            >
                                <Text
                                    style={[styles.tableCell, { flex: 1, color: COLORS.bodyText }]}
                                >
                                    {t.nombre}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { color: COLORS.entrada, fontFamily: 'Helvetica-Bold' },
                                    ]}
                                >
                                    {formatClp(t.total)}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Top Motivos — Egresos</Text>
                        {data.topEgresos.map((t, i) => (
                            <View
                                key={t.nombre}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 3,
                                    borderBottomWidth: i < data.topEgresos.length - 1 ? 1 : 0,
                                    borderBottomColor: COLORS.border,
                                }}
                            >
                                <Text
                                    style={[styles.tableCell, { flex: 1, color: COLORS.bodyText }]}
                                >
                                    {t.nombre}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { color: COLORS.deuda, fontFamily: 'Helvetica-Bold' },
                                    ]}
                                >
                                    {formatClp(t.total)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Logia Caleuche N° 250 — Informe de Tesorería
                    </Text>
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `Página ${pageNumber} de ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}

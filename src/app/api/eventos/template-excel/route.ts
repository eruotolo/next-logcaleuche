import { NextResponse } from 'next/server';

import ExcelJS from 'exceljs';

import { auth } from '@/shared/lib/auth';

export async function GET() {
    const session = await auth();
    if (!session || session.user.categoryId > 2) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const workbook = new ExcelJS.Workbook();

    // ── Hoja principal: Eventos ───────────────────────────────────────────────
    const ws = workbook.addWorksheet('Eventos');

    ws.columns = [
        { header: 'Nombre', key: 'nombre', width: 35 },
        { header: 'Tipo de Trabajo', key: 'trabajo', width: 25 },
        { header: 'Autor / Responsable', key: 'autor', width: 30 },
        { header: 'Fecha (dd/mm/yyyy)', key: 'fecha', width: 18 },
        { header: 'Hora (HH:mm)', key: 'hora', width: 14 },
        { header: 'Lugar', key: 'lugar', width: 25 },
        { header: 'Grado (1-3)', key: 'grado', width: 14 },
    ];

    // Estilo de headers
    const headerRow = ws.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F2937' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    headerRow.height = 24;

    // Fila de ejemplo
    ws.addRow({
        nombre: 'La Búsqueda de la Verdad',
        trabajo: 'Trazado',
        autor: 'Q.H. Pedro Bravo',
        fecha: new Date(2026, 3, 15),
        hora: '20:00',
        lugar: 'Casa Masónica de Castro',
        grado: 1,
    });

    // Formato fecha en columna D
    ws.getColumn('fecha').numFmt = 'dd/mm/yyyy';

    // Validación de datos en columna Grado (filas 2 a 201)
    for (let row = 2; row <= 201; row++) {
        ws.getCell(`G${row}`).dataValidation = {
            type: 'whole',
            operator: 'between',
            formulae: [1, 3],
            showErrorMessage: true,
            errorTitle: 'Grado inválido',
            error: 'Ingresa 1 (Aprendiz), 2 (Compañero) o 3 (Maestro)',
        };
    }

    // ── Hoja de referencia ────────────────────────────────────────────────────
    const ref = workbook.addWorksheet('Referencia Grados');
    ref.columns = [
        { header: 'Grado', key: 'grado', width: 10 },
        { header: 'Nombre', key: 'nombre', width: 20 },
    ];

    const refHeader = ref.getRow(1);
    refHeader.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F2937' },
        };
    });

    ref.addRow({ grado: 1, nombre: 'Aprendiz' });
    ref.addRow({ grado: 2, nombre: 'Compañero' });
    ref.addRow({ grado: 3, nombre: 'Maestro' });

    // ── Generar buffer y retornar ─────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer as ArrayBuffer, {
        status: 200,
        headers: {
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="plantilla-eventos.xlsx"',
            'Cache-Control': 'no-store',
        },
    });
}

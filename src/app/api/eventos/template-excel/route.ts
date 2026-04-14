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
        { header: 'Tipo de Actividad (ID 1-17)', key: 'tipoActividadId', width: 25 },
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
        tipoActividadId: 15,
        autor: 'Q.H. Pedro Bravo',
        fecha: new Date(2026, 3, 15),
        hora: '20:00',
        lugar: 'Casa Masónica de Castro',
        grado: 1,
    });

    // Validación de datos en columna Tipo de Actividad (filas 2 a 201)
    for (let row = 2; row <= 201; row++) {
        ws.getCell(`B${row}`).dataValidation = {
            type: 'whole',
            operator: 'between',
            formulae: [1, 17],
            showErrorMessage: true,
            errorTitle: 'Tipo de Actividad inválido',
            error: 'Ingresa un ID entre 1 y 17. Ver hoja "Referencia Tipos".',
        };
    }

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

    // ── Hoja de referencia: Tipos de Actividad ───────────────────────────────
    const refTipos = workbook.addWorksheet('Referencia Tipos');
    refTipos.columns = [
        { header: 'ID', key: 'id', width: 8 },
        { header: 'Tipo de Actividad', key: 'nombre', width: 30 },
    ];

    const refTiposHeader = refTipos.getRow(1);
    refTiposHeader.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
    });

    const tiposActividad = [
        { id: 1, nombre: 'Tenida' },
        { id: 2, nombre: 'Cámara' },
        { id: 3, nombre: 'Tenida Administrativa' },
        { id: 4, nombre: 'Tenida Iniciación' },
        { id: 5, nombre: 'Tenida Aumento de Salario' },
        { id: 6, nombre: 'Tenida Jurisdiccional' },
        { id: 7, nombre: 'Tenida Aniversario' },
        { id: 8, nombre: 'Tenida Conjunta' },
        { id: 9, nombre: 'Cámara Conjunta' },
        { id: 10, nombre: 'Reunión Blanca' },
        { id: 11, nombre: 'Tenida Exaltación' },
        { id: 12, nombre: 'Fiesta del Aprendiz' },
        { id: 13, nombre: 'Fiesta del Compañero' },
        { id: 14, nombre: 'Fiesta del Maestro' },
        { id: 15, nombre: 'Trazado' },
        { id: 16, nombre: 'Ceremonia' },
        { id: 17, nombre: 'Tenida Solsticial' },
    ];
    for (const t of tiposActividad) {
        refTipos.addRow(t);
    }

    // ── Hoja de referencia: Grados ────────────────────────────────────────────
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

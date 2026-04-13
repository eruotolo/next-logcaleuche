import React, { type JSXElementConstructor, type ReactElement } from 'react';

import { type NextRequest, NextResponse } from 'next/server';

import { type DocumentProps, renderToBuffer } from '@react-pdf/renderer';

import { getInforme } from '@/features/tesoreria/actions';
import { InformePDF } from '@/features/tesoreria/components/InformePDF';

import { CATEGORIA, OFICIALIDAD } from '@/shared/constants/domain';
import { auth } from '@/shared/lib/auth';

function isTesorero(session: { user: { oficialidad: number; categoryId: number } }) {
    return (
        session.user.oficialidad === OFICIALIDAD.TESORERO ||
        session.user.categoryId <= CATEGORIA.ADMIN
    );
}

function buildPeriodoLabel(
    tipo: string,
    mes?: string,
    ano?: string,
    desde?: string,
    hasta?: string,
): string {
    if (tipo === 'mensual' && mes && ano) return `${mes} ${ano}`;
    if (tipo === 'anual' && ano) return `Año ${ano}`;
    if (tipo === 'personalizado' && desde && hasta) return `${desde} al ${hasta}`;
    return 'Período personalizado';
}

export async function GET(request: NextRequest) {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const session = await auth();
    if (!session || !isTesorero(session)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // ── Parámetros ────────────────────────────────────────────────────────────
    const { searchParams } = request.nextUrl;
    const tipo = (searchParams.get('tipo') ?? 'mensual') as 'mensual' | 'anual' | 'personalizado';
    const mes = searchParams.get('mes') ?? undefined;
    const ano = searchParams.get('ano') ?? undefined;
    const desde = searchParams.get('desde') ?? undefined;
    const hasta = searchParams.get('hasta') ?? undefined;

    // ── Datos ─────────────────────────────────────────────────────────────────
    const data = await getInforme(tipo, { mes, ano, desde, hasta });

    const periodoLabel = buildPeriodoLabel(tipo, mes, ano, desde, hasta);
    const fileName = `informe-tesoreria-${periodoLabel.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase()}.pdf`;

    // ── Generar PDF en el servidor con renderToBuffer ────────────────────────
    // renderToBuffer corre en Node.js — no en el navegador — 100% server-side.
    // Cast vía unknown requerido: renderToBuffer espera ReactElement<DocumentProps>
    // pero nuestro componente extiende esa interfaz con props adicionales.
    const element = React.createElement(InformePDF, {
        data,
        tipo,
        periodoLabel,
    }) as unknown as ReactElement<DocumentProps, JSXElementConstructor<DocumentProps>>;
    const nodeBuffer = await renderToBuffer(element);
    // Convertir Buffer de Node.js a Uint8Array — compatible con la web Response API
    const buffer = new Uint8Array(nodeBuffer);

    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Cache-Control': 'no-store',
        },
    });
}

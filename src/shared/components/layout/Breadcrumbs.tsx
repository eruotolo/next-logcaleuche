'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight, Home } from 'lucide-react';

const SEGMENT_LABELS: Record<string, string> = {
    dashboard: 'Dashboard',
    feed: 'Feed',
    nuevo: 'Nuevo',
    nueva: 'Nueva',
    noticias: 'Noticias',
    usuarios: 'Hermanos',
    eventos: 'Eventos',
    tesoreria: 'Tesorería',
    ingresos: 'Ingresos',
    egresos: 'Egresos',
    informe: 'Informe',
    documentos: 'Documentos',
    aprendiz: 'Aprendiz',
    companero: 'Compañero',
    maestro: 'Maestro',
    actas: 'Actas',
    biblioteca: 'Biblioteca',
    boletin: 'Boletín',
    trazados: 'Trazados',
    mensajes: 'Mensajes',
    perfil: 'Mi Perfil',
    logs: 'Logs',
    editar: 'Editar',
};

function labelForSegment(segment: string): string {
    return SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Breadcrumbs(): React.ReactElement | null {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    // No mostrar breadcrumbs en el dashboard (es home)
    if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
        return null;
    }

    const crumbs = segments.map((seg, i) => {
        const href = `/${segments.slice(0, i + 1).join('/')}`;
        const isLast = i === segments.length - 1;
        // Si el segmento parece un ID numérico o slug, lo etiquetamos de forma genérica
        const isId = /^\d+$/.test(seg);
        const label = isId ? 'Detalle' : labelForSegment(seg);
        return { href, label, isLast };
    });

    return (
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs">
            <Link
                href="/dashboard"
                className="flex items-center gap-1 text-[#747487] transition-colors hover:text-[#aaa9be]"
                aria-label="Inicio"
            >
                <Home className="h-3 w-3" />
            </Link>
            {crumbs.map((crumb) => (
                <span key={crumb.href} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 text-[#464658]" aria-hidden="true" />
                    {crumb.isLast ? (
                        <span className="text-[#aaa9be]" aria-current="page">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            href={crumb.href}
                            className="text-[#747487] transition-colors hover:text-[#aaa9be]"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}

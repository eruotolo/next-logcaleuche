import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ['/login', '/recovery'];

// Rutas de API interna que se gestionan por sus propios guards
const API_PATHS = ['/api/auth', '/api/cron'];

export function proxy(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;

    // Permitir rutas públicas, API interna y assets de Next.js
    if (
        PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
        API_PATHS.some((p) => pathname.startsWith(p)) ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Verificar cookie de sesión de NextAuth v5
    // En desarrollo: authjs.session-token / En producción: __Secure-authjs.session-token
    const hasSession =
        request.cookies.has('authjs.session-token') ||
        request.cookies.has('__Secure-authjs.session-token');

    if (!hasSession) {
        const loginUrl = new URL('/login', request.url);
        // Guardar la ruta original para redirigir tras el login
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Ejecutar proxy en todas las rutas EXCEPTO:
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico
         * - archivos de imagen/media directos
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};

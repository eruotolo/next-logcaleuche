'use client';

import { useState } from 'react';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminShellProps {
    children: React.ReactNode;
    userName: string;
    userImage: string | null;
    userId: string;
    grado: number;
    gradoNombre: string;
    oficialidad: number;
    categoryId: number;
}

export function AdminShell({
    children,
    userName,
    userImage,
    userId,
    grado,
    gradoNombre,
    oficialidad,
    categoryId,
}: AdminShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0c0d1c]">
            {/* Skip-to-content para usuarios de teclado y lectores de pantalla */}
            <a
                href="#main-content"
                className="focus:bg-cg-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
            >
                Ir al contenido principal
            </a>
            {/* Aurora — blobs decorativos de fondo fijos */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div
                    className="absolute -top-64 -left-32 h-[700px] w-[700px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, hsla(235,68%,60%,0.12) 0%, transparent 65%)',
                    }}
                />
                <div
                    className="absolute -right-32 -bottom-40 h-[600px] w-[600px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, hsla(193,80%,52%,0.09) 0%, transparent 65%)',
                    }}
                />
            </div>

            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                grado={grado}
                oficialidad={oficialidad}
                categoryId={categoryId}
            />

            {/* Contenido principal */}
            <div className="relative flex min-w-0 flex-1 flex-col transition-all duration-300">
                <Topbar
                    onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
                    userName={userName}
                    userImage={userImage}
                    userId={userId}
                    gradoNombre={gradoNombre}
                />

                <main id="main-content" className="flex-1 p-5 lg:p-7">
                    <div className="mx-auto max-w-[1600px]">{children}</div>
                </main>

                <footer className="shrink-0 border-t border-white/[0.06] px-6 py-4">
                    <div className="flex flex-col items-center justify-between gap-1 text-xs text-[#464658] sm:flex-row">
                        <span>{new Date().getFullYear()} © Respetable Logia Caleuche 250</span>
                        <span className="hidden sm:block">
                            Desarrollado por{' '}
                            <a
                                href="https://crowadvance.com"
                                className="text-[#747487] transition-colors hover:text-[#9ea7ff]"
                            >
                                Crow Advance
                            </a>
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

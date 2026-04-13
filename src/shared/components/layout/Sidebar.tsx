'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    BookOpen,
    Calendar,
    ChevronRight,
    Compass,
    DollarSign,
    FileText,
    FolderOpen,
    Home,
    Sun,
    Users,
} from 'lucide-react';

import { CATEGORIA, OFICIALIDAD } from '@/shared/constants/domain';
import { cn } from '@/shared/lib/utils';

interface SidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onMobileClose: () => void;
    grado: number;
    oficialidad: number;
    categoryId: number;
}

interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
    onlyIf?: boolean;
}

export function Sidebar({ collapsed, mobileOpen, onMobileClose, grado, oficialidad, categoryId }: SidebarProps) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Cerrar drawer mobile al cambiar de ruta (pathname es trigger intencional)
    // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is used as route-change trigger
    useEffect(() => {
        onMobileClose();
    }, [pathname, onMobileClose]);

    const _isAdmin = categoryId <= 2;
    const isTesorero = oficialidad === OFICIALIDAD.TESORERO || categoryId === CATEGORIA.SUPER_ADMIN;

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const mainItems: NavItem[] = [
        {
            label: 'Escritorio',
            href: '/dashboard',
            icon: <Home className="h-4 w-4 shrink-0" />,
        },
        {
            label: 'Documentos Generales',
            href: '/documentos',
            icon: <FolderOpen className="h-4 w-4 shrink-0" />,
        },
        {
            label: 'Tesorería',
            icon: <DollarSign className="h-4 w-4 shrink-0" />,
            onlyIf: isTesorero,
            children: [
                { label: 'Ingresos', href: '/tesoreria/ingresos' },
                { label: 'Egresos', href: '/tesoreria/egresos' },
                { label: 'Informe', href: '/tesoreria/informe' },
            ],
        },
        {
            label: 'Noticias',
            href: '/feed',
            icon: <FileText className="h-4 w-4 shrink-0" />,
        },
        {
            label: 'Calendario',
            href: '/eventos',
            icon: <Calendar className="h-4 w-4 shrink-0" />,
        },
        {
            label: 'Usuarios',
            href: '/usuarios',
            icon: <Users className="h-4 w-4 shrink-0" />,
        },
    ];

    const degreeItems: NavItem[] = [
        {
            label: 'Aprendiz',
            icon: <Compass className="h-4 w-4 shrink-0" />,
            children: [
                { label: 'Trazados', href: '/aprendiz/trazados' },
                { label: 'Biblioteca', href: '/aprendiz/biblioteca' },
            ],
        },
        {
            label: 'Compañeros',
            icon: <BookOpen className="h-4 w-4 shrink-0" />,
            onlyIf: grado >= 2 || categoryId === 1,
            children: [
                { label: 'Trazados', href: '/companero/trazados' },
                { label: 'Biblioteca', href: '/companero/biblioteca' },
            ],
        },
        {
            label: 'Maestros',
            icon: <Sun className="h-4 w-4 shrink-0" />,
            onlyIf: grado >= 3 || categoryId === 1,
            children: [
                { label: 'Trazados', href: '/maestro/trazados' },
                { label: 'Biblioteca', href: '/maestro/biblioteca' },
            ],
        },
    ];

    const renderItem = (item: NavItem) => {
        if (item.onlyIf === false) return null;

        /* ── Link simple ── */
        if (!item.children) {
            const active = isActive(item.href!);
            return (
                <li key={item.label}>
                    <Link
                        href={item.href!}
                        className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                            active
                                ? 'border-l-2 border-[#5a67d8] bg-[rgba(90,103,216,0.18)] pl-[10px] text-[#9ea7ff]'
                                : 'text-[#aaa9be] hover:bg-white/5 hover:text-[#e7e6fc]',
                        )}
                    >
                        <span
                            className={cn(
                                active
                                    ? 'text-[#9ea7ff]'
                                    : 'text-[#747487] group-hover:text-[#aaa9be]',
                            )}
                        >
                            {item.icon}
                        </span>
                        <span
                            className={cn(
                                'truncate transition-[opacity,width] duration-300',
                                collapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100',
                            )}
                        >
                            {item.label}
                        </span>
                    </Link>
                </li>
            );
        }

        /* ── Menú con hijos ── */
        const isOpen = openMenus[item.label] ?? false;
        const hasActiveChild = item.children.some((c) => isActive(c.href));

        return (
            <li key={item.label}>
                <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                        'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        hasActiveChild || isOpen
                            ? 'text-[#e7e6fc]'
                            : 'text-[#aaa9be] hover:bg-white/5 hover:text-[#e7e6fc]',
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={cn(
                                hasActiveChild || isOpen
                                    ? 'text-[#9ea7ff]'
                                    : 'text-[#747487] group-hover:text-[#aaa9be]',
                            )}
                        >
                            {item.icon}
                        </span>
                        <span
                            className={cn(
                                'truncate transition-[opacity,width] duration-300',
                                collapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100',
                            )}
                        >
                            {item.label}
                        </span>
                    </div>
                    {!collapsed && (
                        <ChevronRight
                            className={cn(
                                'h-3 w-3 shrink-0 text-[#747487] transition-transform duration-200',
                                isOpen && 'rotate-90 text-[#9ea7ff]',
                            )}
                        />
                    )}
                </button>

                {/* Submenú */}
                {!collapsed && (
                    <ul
                        className={cn(
                            'overflow-hidden transition-all duration-200',
                            isOpen ? 'mt-1 max-h-96 opacity-100' : 'max-h-0 opacity-0',
                        )}
                    >
                        {item.children.map((child) => (
                            <li key={child.href}>
                                <Link
                                    href={child.href}
                                    className={cn(
                                        'flex items-center gap-2 rounded-lg py-2 pr-4 pl-10 text-[13px] transition-colors duration-150',
                                        isActive(child.href)
                                            ? 'font-semibold text-[#9ea7ff]'
                                            : 'text-[#aaa9be]/70 hover:text-[#e7e6fc]',
                                    )}
                                >
                                    {/* dot indicador */}
                                    <span
                                        className={cn(
                                            'h-1 w-1 shrink-0 rounded-full transition-colors',
                                            isActive(child.href) ? 'bg-[#4cd6fb]' : 'bg-[#464658]',
                                        )}
                                    />
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <>
            {/* Overlay backdrop — solo en mobile cuando el drawer está abierto */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onMobileClose}
                    aria-hidden="true"
                />
            )}

        <aside
            className={cn(
                'flex flex-col overflow-y-auto',
                // Frosted glass
                'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl',
                'border-r border-white/[0.06]',
                // Mobile: drawer fijo (slide desde la izquierda)
                'fixed inset-y-0 left-0 z-50 w-[260px] transition-[width,transform] duration-300',
                mobileOpen ? 'translate-x-0' : '-translate-x-full',
                // Desktop: sidebar sticky (override mobile fixed)
                'md:static md:inset-auto md:z-40 md:min-h-screen md:translate-x-0',
                collapsed ? 'md:w-[70px]' : 'md:w-[250px]',
            )}
        >
            {/* Logo */}
            <div
                className={cn(
                    'flex h-16 shrink-0 items-center border-b border-white/[0.06] px-4',
                    collapsed ? 'justify-center' : 'gap-3',
                )}
            >
                <Link href="/dashboard" className="flex items-center gap-3">
                    <Image
                        src="/logo-vectorizado-blanco.svg"
                        alt="Respetable Logia Caleuche 250"
                        width={640}
                        height={640}
                        className="h-8 w-8 shrink-0 object-contain"
                    />
                    {!collapsed && (
                        <div className="min-w-0">
                            <p
                                className="truncate text-sm leading-tight font-semibold text-[#e7e6fc]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Caleuche 250
                            </p>
                            <p className="text-[10px] font-medium tracking-widest text-[#747487] uppercase">
                                Intranet
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-3 py-4">
                {!collapsed && (
                    <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.08em] text-[#747487] uppercase">
                        Menú
                    </p>
                )}
                <ul className="space-y-0.5">{mainItems.map(renderItem)}</ul>

                <div className={cn('my-4 border-t border-white/[0.06]')} />

                {!collapsed && (
                    <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.08em] text-[#747487] uppercase">
                        Elementos
                    </p>
                )}
                <ul className="space-y-0.5">{degreeItems.map(renderItem)}</ul>
            </nav>

            {/* Footer del sidebar */}
            {!collapsed && (
                <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
                    <p className="text-[10px] text-[#464658]">
                        © {new Date().getFullYear()} Logia Caleuche 250
                    </p>
                </div>
            )}
        </aside>
        </>
    );
}

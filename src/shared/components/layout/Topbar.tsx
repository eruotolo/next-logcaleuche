'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
    ChevronDown,
    Eye,
    EyeOff,
    KeyRound,
    LogOut,
    Menu,
    Search,
    User as UserIcon,
    X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

import { CommandPalette } from '@/features/search/components/CommandPalette';
import { updatePassword } from '@/features/usuarios/actions';
import { Tooltip } from '@/shared/components/ui/tooltip';
import { getCloudinaryRawImageUrl } from '@/shared/lib/cloudinary';
import { cn } from '@/shared/lib/utils';

interface TopbarProps {
    onToggleSidebar: () => void;
    onToggleMobileSidebar: () => void;
    userName: string;
    userImage: string | null;
    userId: string;
    gradoNombre: string;
    notificationSlot?: React.ReactNode;
}

export function Topbar({ onToggleSidebar, onToggleMobileSidebar, userName, userImage, userId, gradoNombre, notificationSlot }: TopbarProps) {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(updatePassword, null);

    /* Shortcut Cmd+K / Ctrl+K para abrir la búsqueda */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen((v) => !v);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const initials = userName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    /* Cerrar dropdown al hacer clic fuera */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* Reaccionar al resultado de la action de contraseña */
    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success('Contraseña actualizada. Cerrando sesión en 3 segundos...');
            formRef.current?.reset();
            setPasswordModalOpen(false);
            setTimeout(() => signOut({ callbackUrl: '/login' }), 3000);
        } else {
            toast.error(typeof state.error === 'string' ? state.error : 'Verifica los datos.');
        }
    }, [state]);

    function openPasswordModal() {
        setUserDropdownOpen(false);
        setPasswordModalOpen(true);
    }

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between px-4 lg:px-6',
                    'bg-[rgba(255,255,255,0.03)] backdrop-blur-xl',
                    'border-b border-white/[0.06]',
                )}
            >
                {/* Izquierda: toggle sidebar */}
                <div className="flex items-center gap-3">
                    {/* Mobile: abre drawer */}
                    <Tooltip content="Menú">
                        <button
                            type="button"
                            onClick={onToggleMobileSidebar}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaa9be] transition-colors hover:bg-white/5 hover:text-[#e7e6fc] md:hidden"
                            aria-label="Abrir menú"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </Tooltip>
                    {/* Desktop: colapsa sidebar */}
                    <Tooltip content="Menú lateral">
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#aaa9be] transition-colors hover:bg-white/5 hover:text-[#e7e6fc] md:flex"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </Tooltip>
                </div>

                {/* Derecha: acciones */}
                <div className="flex items-center gap-1">
                    {/* Búsqueda global */}
                    <Tooltip content="Buscar (⌘K)">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="flex h-9 items-center gap-2 rounded-lg px-2 text-[#aaa9be] transition-colors hover:bg-white/5 hover:text-[#e7e6fc]"
                            aria-label="Abrir búsqueda global"
                        >
                            <Search className="h-4 w-4" />
                            <kbd className="hidden rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#9a9ab0] lg:block">
                                ⌘K
                            </kbd>
                        </button>
                    </Tooltip>

                    {/* Campana de notificaciones (RSC slot) */}
                    {notificationSlot}

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setUserDropdownOpen((v) => !v)}
                            className={cn(
                                'flex h-9 items-center gap-2 rounded-lg px-2 transition-colors',
                                'text-[#aaa9be] hover:bg-white/5 hover:text-[#e7e6fc]',
                                userDropdownOpen && 'bg-white/5 text-[#e7e6fc]',
                            )}
                        >
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-[#5a67d8]/40">
                                {userImage ? (
                                    <Image
                                        src={getCloudinaryRawImageUrl(userImage) as string}
                                        alt={userName}
                                        width={600}
                                        height={600}
                                        className="h-full w-full object-cover"
                                        priority
                                        sizes="28px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[rgba(90,103,216,0.55)] text-[10px] font-semibold text-white">
                                        {initials}
                                    </div>
                                )}
                            </div>

                            <span className="hidden max-w-[120px] truncate text-sm font-medium xl:block">
                                Q∴H∴ {userName}
                            </span>

                            <ChevronDown
                                className={cn(
                                    'hidden h-3.5 w-3.5 transition-transform duration-200 xl:block',
                                    userDropdownOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {/* Dropdown glassmorphism */}
                        {userDropdownOpen && (
                            <div
                                className={cn(
                                    'absolute top-[calc(100%+8px)] right-0 z-50 w-52 overflow-hidden rounded-xl',
                                    'bg-[rgba(23,24,42,0.95)] backdrop-blur-2xl',
                                    'border border-white/[0.08]',
                                    'shadow-[0_12px_48px_-10px_rgba(0,0,0,0.6)]',
                                )}
                            >
                                {/* Header del dropdown */}
                                <div className="border-b border-white/[0.06] px-4 py-3">
                                    <p className="text-sm font-semibold text-[#e7e6fc]">
                                        Q∴H∴ {userName}
                                    </p>
                                    <p className="text-xs text-[#9a9ab0]">{gradoNombre}</p>
                                </div>

                                <div className="py-1.5">
                                    {/* Mi Perfil: usa el ID del usuario de la sesión */}
                                    <Link
                                        href={`/usuarios/${userId}`}
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#aaa9be] transition-colors hover:bg-white/5 hover:text-[#e7e6fc]"
                                    >
                                        <UserIcon className="h-4 w-4 text-[#9a9ab0]" />
                                        Mi Perfil
                                    </Link>

                                    {/* Cambiar Contraseña: abre modal inline */}
                                    <button
                                        type="button"
                                        onClick={openPasswordModal}
                                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#aaa9be] transition-colors hover:bg-white/5 hover:text-[#e7e6fc]"
                                    >
                                        <KeyRound className="h-4 w-4 text-[#9a9ab0]" />
                                        Cambiar Contraseña
                                    </button>
                                </div>

                                <div className="border-t border-white/[0.06] py-1.5">
                                    <button
                                        type="button"
                                        onClick={() => signOut()}
                                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#ff6e84] transition-colors hover:bg-[rgba(215,51,87,0.08)]"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Command Palette ──────────────────────────────── */}
            <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* ── Modal Cambiar Contraseña ─────────────────────── */}
            {passwordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setPasswordModalOpen(false)}
                        aria-label="Cerrar modal"
                    />

                    {/* Panel modal */}
                    <div
                        className={cn(
                            'relative z-10 w-full max-w-sm rounded-2xl',
                            'bg-[rgba(18,19,36,0.97)] backdrop-blur-2xl',
                            'border border-white/[0.08]',
                            'shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)]',
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(90,103,216,0.15)]">
                                    <KeyRound className="text-cg-primary-tonal h-4 w-4" />
                                </div>
                                <h2 className="text-sm font-semibold text-[#e7e6fc]">
                                    Cambiar Contraseña
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPasswordModalOpen(false)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9a9ab0] transition-colors hover:bg-white/5 hover:text-[#e7e6fc]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form ref={formRef} action={formAction} className="space-y-4 p-6">
                            {/* Contraseña actual */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="pwd-current"
                                    className="text-xs font-medium text-[#aaa9be]"
                                >
                                    Contraseña actual
                                </label>
                                <div className="relative">
                                    <input
                                        id="pwd-current"
                                        type={showCurrent ? 'text' : 'password'}
                                        name="current"
                                        required
                                        minLength={8}
                                        placeholder="Tu contraseña actual"
                                        className="h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pr-10 pl-3 text-sm text-[#e7e6fc] placeholder:text-[#9a9ab0] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent((v) => !v)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9a9ab0] hover:text-[#aaa9be]"
                                    >
                                        {showCurrent ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Nueva contraseña */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="pwd-new"
                                    className="text-xs font-medium text-[#aaa9be]"
                                >
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="pwd-new"
                                        type={showNew ? 'text' : 'password'}
                                        name="password"
                                        required
                                        minLength={8}
                                        placeholder="Mínimo 8 caracteres"
                                        className="h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pr-10 pl-3 text-sm text-[#e7e6fc] placeholder:text-[#9a9ab0] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew((v) => !v)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9a9ab0] hover:text-[#aaa9be]"
                                    >
                                        {showNew ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="pwd-confirm"
                                    className="text-xs font-medium text-[#aaa9be]"
                                >
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="pwd-confirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        name="confirm"
                                        required
                                        minLength={8}
                                        placeholder="Repite la nueva contraseña"
                                        className="h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pr-10 pl-3 text-sm text-[#e7e6fc] placeholder:text-[#9a9ab0] focus:ring-1 focus:ring-[rgba(90,103,216,0.5)] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9a9ab0] hover:text-[#aaa9be]"
                                    >
                                        {showConfirm ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPasswordModalOpen(false)}
                                    className="h-10 flex-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent text-sm text-[#aaa9be] transition-colors hover:bg-white/5"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-10 flex-1 rounded-lg bg-[rgba(90,103,216,0.85)] text-sm font-semibold text-white transition-colors hover:bg-[rgba(90,103,216,1)] disabled:opacity-50"
                                >
                                    {isPending ? 'Guardando...' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

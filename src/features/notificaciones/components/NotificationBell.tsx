'use client';

import { useEffect, useRef, useState, useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Bell } from 'lucide-react';

import { markAllAsRead, markAsRead } from '@/features/notificaciones/actions';
import { cn } from '@/shared/lib/utils';

import type { NotificationItem } from '../actions';

interface NotificationBellProps {
    initialCount: number;
    initialNotifications: NotificationItem[];
}

const TYPE_COLORS: Record<string, string> = {
    feed: 'bg-[rgba(90,103,216,0.6)]',
    comment: 'bg-[rgba(65,166,90,0.6)]',
    evento: 'bg-[rgba(242,156,19,0.6)]',
};

export function NotificationBell({ initialCount, initialNotifications }: NotificationBellProps) {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isPending, startTransition] = useTransition();
    const panelRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    /* Cerrar al clicar fuera */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    function handleMarkAll() {
        startTransition(async () => {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setCount(0);
            router.refresh();
        });
    }

    function handleMarkOne(id: number) {
        startTransition(async () => {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            );
            setCount((c) => Math.max(0, c - 1));
        });
    }

    const displayNotifications = notifications.slice(0, 5);

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    'text-[#aaa9be] hover:bg-white/5 hover:text-[#e7e6fc]',
                    open && 'bg-white/5 text-[#e7e6fc]',
                )}
                aria-label="Notificaciones"
            >
                <Bell className="h-4.5 w-4.5" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={cn(
                        'absolute top-[calc(100%+8px)] right-0 z-50 w-80 overflow-hidden rounded-xl',
                        'bg-[rgba(23,24,42,0.97)] backdrop-blur-2xl',
                        'border border-white/[0.08]',
                        'shadow-[0_12px_48px_-10px_rgba(0,0,0,0.6)]',
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                        <span className="text-sm font-semibold text-[#e7e6fc]">
                            Notificaciones
                            {count > 0 && (
                                <span className="ml-2 rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                                    {count}
                                </span>
                            )}
                        </span>
                        {count > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAll}
                                disabled={isPending}
                                className="text-xs text-[#9a9ab0] transition-colors hover:text-[#e7e6fc] disabled:opacity-50"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {/* Lista */}
                    <div className="max-h-[340px] overflow-y-auto">
                        {displayNotifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-[#9a9ab0]">
                                Sin notificaciones
                            </p>
                        ) : (
                            displayNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        'flex gap-3 border-b border-white/[0.04] px-4 py-3 transition-colors',
                                        !n.read && 'bg-white/[0.03]',
                                    )}
                                >
                                    {/* Dot de tipo */}
                                    <span
                                        className={cn(
                                            'mt-1 h-2 w-2 shrink-0 rounded-full',
                                            TYPE_COLORS[n.type] ?? 'bg-white/20',
                                        )}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={cn(
                                                'truncate text-xs font-semibold',
                                                n.read ? 'text-[#9a9ab0]' : 'text-[#e7e6fc]',
                                            )}
                                        >
                                            {n.title}
                                        </p>
                                        {n.message && (
                                            <p className="mt-0.5 line-clamp-2 text-xs text-[#747487]">
                                                {n.message}
                                            </p>
                                        )}
                                        <div className="mt-1 flex items-center gap-2">
                                            {n.href && (
                                                <Link
                                                    href={n.href}
                                                    onClick={() => {
                                                        setOpen(false);
                                                        if (!n.read) handleMarkOne(n.id);
                                                    }}
                                                    className="text-[10px] text-[#5a67d8] hover:underline"
                                                >
                                                    Ver
                                                </Link>
                                            )}
                                            {!n.read && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleMarkOne(n.id)}
                                                    disabled={isPending}
                                                    className="text-[10px] text-[#9a9ab0] hover:text-[#e7e6fc] disabled:opacity-50"
                                                >
                                                    Marcar como leída
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 5 && (
                        <div className="border-t border-white/[0.06] px-4 py-2.5 text-center">
                            <span className="text-xs text-[#747487]">
                                Mostrando 5 de {notifications.length} notificaciones
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

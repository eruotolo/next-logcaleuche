'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Calendar, FileText, FolderOpen, Loader2, Search, Users, X } from 'lucide-react';

import { globalSearch, type SearchResult } from '@/features/search/actions';
import { cn } from '@/shared/lib/utils';

const TYPE_CONFIG: Record<
    SearchResult['type'],
    { label: string; icon: React.ReactNode; color: string }
> = {
    usuario: {
        label: 'Usuarios',
        icon: <Users className="h-3.5 w-3.5" />,
        color: 'text-[#9ea7ff]',
    },
    feed: {
        label: 'Feed',
        icon: <FileText className="h-3.5 w-3.5" />,
        color: 'text-[#4cd6fb]',
    },
    documento: {
        label: 'Documentos',
        icon: <FolderOpen className="h-3.5 w-3.5" />,
        color: 'text-[#9bffce]',
    },
    evento: {
        label: 'Eventos',
        icon: <Calendar className="h-3.5 w-3.5" />,
        color: 'text-[#f29c13]',
    },
};

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    // Limpiar estado al abrir/cerrar
    useEffect(() => {
        if (open) {
            setQuery('');
            setResults([]);
            setActiveIndex(0);
            // Pequeño delay para que el dialog esté en el DOM
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Búsqueda con debounce de 300ms
    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
        setActiveIndex(0);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length < 2) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(() => {
            startTransition(async () => {
                const found = await globalSearch(value);
                setResults(found);
            });
        }, 300);
    }, []);

    // Limpiar debounce al desmontar
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const handleSelect = useCallback(
        (result: SearchResult) => {
            router.push(result.href);
            onClose();
        },
        [router, onClose],
    );

    // Navegación por teclado
    useEffect(() => {
        if (!open) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && results[activeIndex]) {
                handleSelect(results[activeIndex]);
            }
        };

        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, results, activeIndex, onClose, handleSelect]);

    // Agrupar resultados por tipo
    const grouped = results.reduce<Partial<Record<SearchResult['type'], SearchResult[]>>>(
        (acc, result) => {
            if (!acc[result.type]) acc[result.type] = [];
            acc[result.type]?.push(result);
            return acc;
        },
        {},
    );

    const typeOrder: SearchResult['type'][] = ['usuario', 'feed', 'documento', 'evento'];
    // Índice flat para navegación con teclado
    let flatIndex = 0;

    if (!open) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda global"
        >
            {/* Click fuera cierra */}
            <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Cerrar búsqueda"
            />

            {/* Panel */}
            <div
                className={cn(
                    'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl',
                    'bg-[rgba(18,19,36,0.97)] backdrop-blur-2xl',
                    'border border-white/[0.08]',
                    'shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)]',
                    'animate-[cg-dialog-in_0.2s_ease-out]',
                )}
            >
                {/* Input */}
                <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
                    {isPending ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#9a9ab0]" />
                    ) : (
                        <Search className="h-4 w-4 shrink-0 text-[#9a9ab0]" />
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        placeholder="Buscar usuarios, feed, documentos, eventos..."
                        className="flex-1 bg-transparent text-sm text-[#e7e6fc] placeholder:text-[#9a9ab0] focus:outline-none"
                        aria-label="Campo de búsqueda global"
                        autoComplete="off"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => handleQueryChange('')}
                            className="text-[#9a9ab0] transition-colors hover:text-[#e7e6fc]"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <kbd className="hidden rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#9a9ab0] sm:block">
                        ESC
                    </kbd>
                </div>

                {/* Resultados */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {query.trim().length < 2 ? (
                        /* Estado vacío — hint */
                        <p className="px-4 py-6 text-center text-sm text-[#9a9ab0]">
                            Escribe al menos 2 caracteres para buscar
                        </p>
                    ) : results.length === 0 && !isPending ? (
                        /* Sin resultados */
                        <p className="px-4 py-6 text-center text-sm text-[#9a9ab0]">
                            Sin resultados para{' '}
                            <span className="font-medium text-[#e7e6fc]">"{query}"</span>
                        </p>
                    ) : (
                        typeOrder.map((type) => {
                            const items = grouped[type];
                            if (!items?.length) return null;

                            return (
                                <div key={type} className="mb-1">
                                    {/* Cabecera de grupo */}
                                    <div className="flex items-center gap-2 px-4 py-1.5">
                                        <span className={cn('flex items-center', TYPE_CONFIG[type].color)}>
                                            {TYPE_CONFIG[type].icon}
                                        </span>
                                        <span className="text-[10px] font-semibold tracking-[0.08em] text-[#9a9ab0] uppercase">
                                            {TYPE_CONFIG[type].label}
                                        </span>
                                    </div>

                                    {/* Items */}
                                    {items.map((result) => {
                                        const currentIndex = flatIndex++;
                                        const isActive = currentIndex === activeIndex;

                                        return (
                                            <button
                                                key={`${result.type}-${result.href}-${result.label}`}
                                                type="button"
                                                onClick={() => handleSelect(result)}
                                                onMouseEnter={() => setActiveIndex(currentIndex)}
                                                className={cn(
                                                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                                    isActive
                                                        ? 'bg-white/[0.06]'
                                                        : 'hover:bg-white/[0.04]',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                                                        isActive
                                                            ? 'bg-[rgba(90,103,216,0.25)]'
                                                            : 'bg-white/[0.04]',
                                                        TYPE_CONFIG[type].color,
                                                    )}
                                                >
                                                    {TYPE_CONFIG[type].icon}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm text-[#e7e6fc]">
                                                        {result.label}
                                                    </span>
                                                    {result.sublabel && (
                                                        <span className="block truncate text-[11px] text-[#9a9ab0]">
                                                            {result.sublabel}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer con hint de teclado */}
                {results.length > 0 && (
                    <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2">
                        <span className="flex items-center gap-1 text-[10px] text-[#9a9ab0]">
                            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5">↑↓</kbd>
                            navegar
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[#9a9ab0]">
                            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5">↵</kbd>
                            abrir
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

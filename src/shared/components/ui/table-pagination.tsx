'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function TablePagination({ currentPage, totalPages, onPageChange }: TablePaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="mt-4 flex flex-col gap-2 px-1 pt-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-cg-outline text-center text-xs sm:text-left">
                Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center justify-center gap-1">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="text-cg-on-surface-variant flex h-8 w-8 items-center justify-center rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-colors hover:bg-[rgba(255,255,255,0.06)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Números de página — ocultos en mobile para evitar desbordamiento */}
                {pages.map((p, i) => {
                    const prevPage = pages[i - 1];
                    const ellipsisKey = `ellipsis-after-${typeof prevPage === 'number' ? prevPage : i}`;
                    return p === '...' ? (
                        <span
                            key={ellipsisKey}
                            className="text-cg-outline hidden h-8 w-8 items-center justify-center text-xs sm:flex"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPageChange(p as number)}
                            className={`hidden h-8 w-8 items-center justify-center rounded border text-sm transition-colors sm:flex ${
                                p === currentPage
                                    ? 'text-cg-primary-tonal border-[rgba(90,103,216,0.5)] bg-[rgba(90,103,216,0.15)]'
                                    : 'text-cg-on-surface-variant border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]'
                            }`}
                        >
                            {p}
                        </button>
                    );
                })}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="text-cg-on-surface-variant flex h-8 w-8 items-center justify-center rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-colors hover:bg-[rgba(255,255,255,0.06)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

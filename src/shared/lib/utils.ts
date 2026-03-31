import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Trunca un texto y agrega "..." si supera la longitud máxima.
 * Equivalente a custom_echo() del PHP original.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
}

/**
 * Formatea un monto en pesos chilenos (CLP).
 */
export function formatCLP(amount: number | string): string {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
    }).format(num);
}

/**
 * Formatea una fecha en formato dd/mm/yyyy (estilo PHP del sistema original).
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/** Nombre del mes en español a partir de número (1-12). */
export const MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
] as const;

export function getMesNombre(mes: number): string {
    return MESES[mes - 1] ?? '';
}

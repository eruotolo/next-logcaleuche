'use client';

import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    loading?: boolean;
    fullWidth?: boolean;
    asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 border border-transparent',
    secondary:
        'bg-[rgba(255,255,255,0.06)] text-cg-on-surface-variant hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(70,70,88,0.35)]',
    ghost: 'bg-transparent text-cg-on-surface-variant hover:bg-[rgba(255,255,255,0.06)] border border-transparent',
    danger: 'bg-cg-error text-white hover:opacity-90 border border-transparent',
    outline:
        'bg-transparent text-cg-on-surface hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(70,70,88,0.35)]',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-8 w-8 p-0',
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    className,
    children,
    asChild = false,
    ...props
}: ButtonProps) {
    const classes = cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
    );

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            ...props,
            className: cn(classes, (children.props as { className?: string }).className),
        });
    }

    return (
        <button disabled={disabled || loading} className={classes} {...props}>
            {loading && (
                <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}

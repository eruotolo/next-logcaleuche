import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'outline';
    size?: 'md' | 'icon';
    className?: string;
}

const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 border border-transparent',
    outline:
        'bg-transparent text-cg-on-surface hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(70,70,88,0.35)]',
};

const sizeClasses = {
    md: 'h-9 px-4 text-sm',
    icon: 'h-8 w-8 p-0',
};

export function LinkButton({
    href,
    children,
    variant = 'primary',
    size = 'md',
    className,
}: LinkButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1 focus:outline-none',
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
        >
            {children}
        </Link>
    );
}

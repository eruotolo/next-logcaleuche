import type { InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="form-field">
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn('form-input', error && 'form-input-error', className)}
                {...props}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

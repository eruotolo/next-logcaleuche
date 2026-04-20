'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { Search } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface SearchDocumentosFormProps {
    initialQuery: string;
}

export function SearchDocumentosForm({ initialQuery }: SearchDocumentosFormProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const q = inputRef.current?.value.trim() ?? '';
        if (q) router.push(`/documentos/buscar?q=${encodeURIComponent(q)}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
                <Search className="text-cg-outline absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                    ref={inputRef}
                    name="q"
                    defaultValue={initialQuery}
                    placeholder="Buscar en biblioteca, trazados y documentos..."
                    className="form-input pl-9"
                />
            </div>
            <Button type="submit">Buscar</Button>
        </form>
    );
}

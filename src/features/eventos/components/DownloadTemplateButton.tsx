'use client';

import { Download } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

export function DownloadTemplateButton() {
    return (
        <Button variant="outline" asChild>
            <a href="/api/eventos/template-excel" download="plantilla-eventos.xlsx">
                <Download className="mr-2 h-4 w-4" />
                Descargar Plantilla
            </a>
        </Button>
    );
}

import { Inter, Space_Grotesk } from 'next/font/google';

import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/shared/components/ui/tooltip';

import './globals.css';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
    title: 'Logia Caleuche 250',
    description: 'Intranet — Respetable Logia Caleuche 250',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
            <body className="bg-background text-foreground flex min-h-full flex-col">
                <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}

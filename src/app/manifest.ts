import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Logia Caleuche 250',
        short_name: 'Caleuche 250',
        description: 'Intranet privada de la Logia Caleuche 250',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#0c0d1c',
        theme_color: '#2980b9',
        icons: [
            {
                src: '/logo-vectorizado-blanco.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/logo.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
            },
        ],
    };
}

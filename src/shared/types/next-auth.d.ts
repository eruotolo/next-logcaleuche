import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            rut: string;
            grado: number; // 1=Aprendiz, 2=Compañero, 3=Maestro
            gradoNombre: string;
            oficialidad: number; // 1-15, ver tabla oficiales
            oficialidadNombre: string;
            categoryId: number; // 1=SuperAdmin, 2=Admin, 3=Usuario
            categoryNombre: string;
            active: boolean;
        } & DefaultSession['user'];
    }

    interface User {
        rut: string;
        grado: number;
        gradoNombre: string;
        oficialidad: number;
        oficialidadNombre: string;
        categoryId: number;
        categoryNombre: string;
        active: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        rut: string;
        grado: number;
        gradoNombre: string;
        oficialidad: number;
        oficialidadNombre: string;
        categoryId: number;
        categoryNombre: string;
        active: boolean;
    }
}

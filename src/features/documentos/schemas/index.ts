import { z } from 'zod';

export const LibroSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    autor: z.string().min(1, 'El autor es requerido'),
    grado: z.coerce.number().int().min(1).max(3),
});

export const TrazadoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    autor: z.coerce.number().int().positive('Selecciona un autor'),
    grado: z.coerce.number().int().min(1).max(3),
    fecha: z.string().min(1),
});

export const DocumentoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    fecha: z.string().min(1),
});

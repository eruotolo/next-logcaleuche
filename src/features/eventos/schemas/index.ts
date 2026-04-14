import { z } from 'zod';

export const EventoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    tipoActividadId: z.coerce.number().int().positive('Selecciona un tipo de actividad'),
    autor: z.string().optional(),
    fecha: z.string().min(1, 'La fecha es requerida'),
    hora: z.string().optional(),
    lugar: z.string().optional(),
    grado: z.coerce.number().int().positive('Selecciona un grado'),
});

export type EventoInput = z.infer<typeof EventoSchema>;

export const EventoImportRowSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    tipoActividadId: z.coerce.number().int().min(1, 'Tipo de actividad requerido').max(17, 'ID de tipo de actividad inválido'),
    autor: z.string().optional().default(''),
    fecha: z
        .string()
        .min(1, 'La fecha es requerida')
        .refine((val) => !Number.isNaN(Date.parse(val)), 'Fecha inválida'),
    hora: z.string().optional().default(''),
    lugar: z.string().optional().default(''),
    grado: z.coerce.number().int().min(1, 'Grado mínimo es 1').max(3, 'Grado máximo es 3'),
});

export type EventoImportRow = z.infer<typeof EventoImportRowSchema>;

export type ImportResult = {
    imported: number;
    errors: Array<{ row: number; messages: string[] }>;
};

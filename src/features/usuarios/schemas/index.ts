import { z } from 'zod';

export const UsuariosQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(5).max(100).default(20),
    search: z.string().optional(),
    gradoId: z.coerce.number().int().positive().optional(),
    oficialidadId: z.coerce.number().int().positive().optional(),
    active: z.enum(['activo', 'inactivo']).optional(),
});

export type UsuariosQuery = z.infer<typeof UsuariosQuerySchema>;

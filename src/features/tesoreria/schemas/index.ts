import { z } from 'zod';

export const TesoreriaQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(5).max(100).default(20),
    search: z.string().optional(),
    mes: z.string().optional(),
    ano: z.string().optional(),
});

export type TesoreriaQuery = z.infer<typeof TesoreriaQuerySchema>;

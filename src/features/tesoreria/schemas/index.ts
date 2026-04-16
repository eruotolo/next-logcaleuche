import { z } from 'zod';

export const TesoreriaQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(5).max(50).default(7),
});

export type TesoreriaQuery = z.infer<typeof TesoreriaQuerySchema>;

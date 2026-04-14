import { z } from 'zod';

export const ActivityLogsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    action: z.string().optional(),
    entity: z.string().optional(),
    userId: z.coerce.number().int().positive().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    q: z.string().trim().max(200).optional(),
});

export type ActivityLogsQuery = z.infer<typeof ActivityLogsQuerySchema>;

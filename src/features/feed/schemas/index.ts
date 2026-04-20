import { z } from 'zod';

export const FeedPostSchema = z.object({
    titulo: z.string().min(1, 'El título es requerido').max(150),
    category: z.coerce.number().int().positive('Selecciona una categoría'),
    contenido: z.string().min(1, 'El contenido es requerido').max(3000),
});

export const CommentSchema = z.object({
    feedId: z.coerce.number().int().positive(),
    message: z.string().min(1).max(300),
});


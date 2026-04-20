import { z } from 'zod';

// Schema genérico para cuando identifier puede ser email o RUT
export const LoginByIdentifierSchema = z.object({
    identifier: z.string().min(1, 'Campo requerido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const RecoverySchema = z.object({
    email: z.string().email('Email inválido'),
});

// Para recuperación de contraseña vía token
export const ResetPasswordSchema = z
    .object({
        password: z.string().min(8, 'Mínimo 8 caracteres'),
        confirm: z.string().min(6),
    })
    .refine((data) => data.password === data.confirm, {
        message: 'Las contraseñas no coinciden',
        path: ['confirm'],
    });


import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

// RUT chileno: acepta 12.345.678-9 o 12345678-9
const rutRegex = /^\d{1,2}(\.\d{3}){0,2}-[\dkK]$/;
export const LoginByRutSchema = z.object({
    identifier: z.string().regex(rutRegex, 'RUT inválido. Usa el formato 12.345.678-9'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

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

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginByRutInput = z.infer<typeof LoginByRutSchema>;
export type RecoveryInput = z.infer<typeof RecoverySchema>;

-- AlterTable: agrega token_expiry para expiración de tokens de recuperación de contraseña
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "token_expiry" TIMESTAMP(3);

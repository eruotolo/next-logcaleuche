-- AlterTable
ALTER TABLE "users" ADD COLUMN     "backup_codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_secret" TEXT,
ADD COLUMN     "two_factor_temp_expiry" TIMESTAMP(3),
ADD COLUMN     "two_factor_temp_token" TEXT;

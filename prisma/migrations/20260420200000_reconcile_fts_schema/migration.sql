-- Reconciliation: search_vector columns are managed via custom SQL in the previous migration.
-- Prisma schema intentionally does not declare these columns (tsvector is Unsupported).
-- This migration exists solely to clear schema drift detection.
SELECT 1;

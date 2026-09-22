-- has_role is a PostgreSQL/Supabase RPC function used by the frontend's
-- server-side Supabase client. It does not apply to the MySQL backend.
-- Authorization in NestJS is handled by JwtAuthGuard + RolesGuard.
-- This migration is intentionally a no-op for MySQL/MariaDB compatibility.
SELECT 1;

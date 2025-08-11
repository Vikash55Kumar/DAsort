/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add password column with a temporary default, then update existing users, then remove default
ALTER TABLE "public"."users" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temp_password_needs_reset';

-- Update existing users with a hashed temporary password (users will need to reset)
-- This is a temporary password hash for 'temp_password_123' - users must reset their password
UPDATE "public"."users" SET "password" = '$2b$12$LQv3c1yqBwlVHpPn5sq8lOOzrXBh9GAYQrXqnF6o5MCFcaQ69KfqW';

-- Remove the default value
ALTER TABLE "public"."users" ALTER COLUMN "password" DROP DEFAULT;

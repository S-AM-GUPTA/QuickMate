-- DropIndex
DROP INDEX "tasks_coords_idx";

-- DropIndex
DROP INDEX "users_coords_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otp_code" TEXT,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3),
ADD COLUMN     "password" TEXT;

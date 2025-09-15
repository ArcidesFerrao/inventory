/*
  Warnings:

  - The `details` column on the `ActivityLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "details",
ADD COLUMN     "details" JSONB,
ALTER COLUMN "device" SET DATA TYPE TEXT;

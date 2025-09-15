/*
  Warnings:

  - You are about to drop the column `idAddress` on the `ActivityLog` table. All the data in the column will be lost.
  - The `device` column on the `ActivityLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "idAddress",
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "severity" TEXT NOT NULL DEFAULT 'INFO',
DROP COLUMN "device",
ADD COLUMN     "device" JSONB;

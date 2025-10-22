/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sourceId",
DROP COLUMN "sourceType";

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'DIRECT';

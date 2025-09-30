/*
  Warnings:

  - You are about to drop the column `supplierCustomerId` on the `Purchase` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_supplierCustomerId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "supplierCustomerId";

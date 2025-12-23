/*
  Warnings:

  - The values [MINIMARKET,SUPERMARKET,RETAIL,RESELLER] on the enum `BusinessType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BusinessType_new" AS ENUM ('RESTAURANT', 'SHOP', 'STORE');
ALTER TABLE "Service" ALTER COLUMN "businessType" TYPE "BusinessType_new" USING ("businessType"::text::"BusinessType_new");
ALTER TYPE "BusinessType" RENAME TO "BusinessType_old";
ALTER TYPE "BusinessType_new" RENAME TO "BusinessType";
DROP TYPE "public"."BusinessType_old";
COMMIT;

-- DropIndex
DROP INDEX "Expense_serviceId_idx";

-- CreateIndex
CREATE INDEX "Expense_serviceId_timestamp_idx" ON "Expense"("serviceId", "timestamp");

-- CreateIndex
CREATE INDEX "Purchase_serviceId_timestamp_idx" ON "Purchase"("serviceId", "timestamp");

-- CreateIndex
CREATE INDEX "Sale_serviceId_timestamp_idx" ON "Sale"("serviceId", "timestamp");

-- CreateIndex
CREATE INDEX "SaleItem_itemId_idx" ON "SaleItem"("itemId");

/*
  Warnings:

  - The `severity` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NotificationSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "severity",
ADD COLUMN     "severity" "NotificationSeverity" NOT NULL DEFAULT 'INFO';

-- CreateTable
CREATE TABLE "StockSnapshot" (
    "id" TEXT NOT NULL,
    "serviceStockItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockSnapshot_serviceStockItemId_recordedAt_idx" ON "StockSnapshot"("serviceStockItemId", "recordedAt");

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");

-- AddForeignKey
ALTER TABLE "StockSnapshot" ADD CONSTRAINT "StockSnapshot_serviceStockItemId_fkey" FOREIGN KEY ("serviceStockItemId") REFERENCES "ServiceStockItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

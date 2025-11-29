/*
  Warnings:

  - Added the required column `serviceStockItemId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "serviceStockItemId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_serviceStockItemId_fkey" FOREIGN KEY ("serviceStockItemId") REFERENCES "ServiceStockItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

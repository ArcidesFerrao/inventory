-- AlterTable
ALTER TABLE "PurchaseItem" ADD COLUMN     "serviceStockItemId" TEXT;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_serviceStockItemId_fkey" FOREIGN KEY ("serviceStockItemId") REFERENCES "ServiceStockItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

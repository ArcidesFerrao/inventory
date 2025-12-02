-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "serviceStockItemId" TEXT;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_serviceStockItemId_fkey" FOREIGN KEY ("serviceStockItemId") REFERENCES "ServiceStockItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "SaleItem" ADD COLUMN     "serviceStockItemId" TEXT;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_serviceStockItemId_fkey" FOREIGN KEY ("serviceStockItemId") REFERENCES "ServiceStockItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

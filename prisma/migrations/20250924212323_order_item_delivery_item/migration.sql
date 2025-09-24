-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "supplierCustomerId" TEXT;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_supplierCustomerId_fkey" FOREIGN KEY ("supplierCustomerId") REFERENCES "SupplierCustomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_supplierProductId_fkey";

-- AlterTable
ALTER TABLE "SupplierProduct" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

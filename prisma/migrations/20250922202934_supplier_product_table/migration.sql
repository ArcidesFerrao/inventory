/*
  Warnings:

  - Added the required column `unitQty` to the `SupplierProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierProduct" ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "unitQty" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "SupplierProduct_supplierId_idx" ON "SupplierProduct"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierProduct_status_idx" ON "SupplierProduct"("status");

-- CreateIndex
CREATE INDEX "SupplierProduct_name_idx" ON "SupplierProduct"("name");

-- CreateIndex
CREATE INDEX "SupplierProduct_unitId_idx" ON "SupplierProduct"("unitId");

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

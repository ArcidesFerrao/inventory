/*
  Warnings:

  - The `paymentType` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sourceType` column on the `Purchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentType` column on the `Purchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentType` column on the `Sale` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('DIRECT', 'ORDER');

-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "severity" TEXT NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stockProcessed" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "sourceType",
ADD COLUMN     "sourceType" "SourceType" NOT NULL DEFAULT 'DIRECT',
DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "afterQty" INTEGER,
ADD COLUMN     "beforeQty" INTEGER,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "ServiceSettings" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "enableSales" BOOLEAN NOT NULL DEFAULT true,
    "enableOrders" BOOLEAN NOT NULL DEFAULT true,
    "enableDeliveries" BOOLEAN NOT NULL DEFAULT true,
    "autoConfirmOrders" BOOLEAN NOT NULL DEFAULT false,
    "autoCompleteDelivery" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierSettings" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "defaultPaymentType" "PaymentType" NOT NULL DEFAULT 'CASH',
    "allowPartialOrders" BOOLEAN NOT NULL DEFAULT false,
    "autoConfirmOrders" BOOLEAN NOT NULL DEFAULT false,
    "leadTimeDays" INTEGER,
    "minimumOrderValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSettings_serviceId_key" ON "ServiceSettings"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierSettings_supplierId_key" ON "SupplierSettings"("supplierId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSettings" ADD CONSTRAINT "ServiceSettings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierSettings" ADD CONSTRAINT "SupplierSettings_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

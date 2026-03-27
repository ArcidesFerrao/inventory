/*
  Warnings:

  - You are about to drop the column `critical` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "critical";

-- AlterTable
ALTER TABLE "ServiceStockItem" ADD COLUMN     "critical" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "StockItem" ADD COLUMN     "critical" INTEGER DEFAULT 0;

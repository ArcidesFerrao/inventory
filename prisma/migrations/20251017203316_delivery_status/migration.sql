/*
  Warnings:

  - The `status` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "status",
ADD COLUMN     "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Delivery_status_idx" ON "Delivery"("status");

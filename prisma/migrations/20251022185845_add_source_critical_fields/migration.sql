-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "critical" INTEGER DEFAULT 0,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'DIRECT';

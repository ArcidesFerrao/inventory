-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('UNIT', 'QUANTITY');

-- AlterTable
ALTER TABLE "RecipeItem" ADD COLUMN     "usageType" "UsageType" NOT NULL DEFAULT 'UNIT';

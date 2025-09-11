-- DropForeignKey
ALTER TABLE "RecipeItem" DROP CONSTRAINT "RecipeItem_stockId_fkey";

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

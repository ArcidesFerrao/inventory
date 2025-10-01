/*
  Warnings:

  - The `establishedYear` column on the `Supplier` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "establishedYear",
ADD COLUMN     "establishedYear" INTEGER;

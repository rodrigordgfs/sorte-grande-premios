/*
  Warnings:

  - You are about to alter the column `quantity` on the `quota` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[quantity]` on the table `quota` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "quota" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "quota_quantity_key" ON "quota"("quantity");

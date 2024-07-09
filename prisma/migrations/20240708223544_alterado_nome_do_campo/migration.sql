/*
  Warnings:

  - You are about to drop the column `titlePrice` on the `campaign` table. All the data in the column will be lost.
  - Added the required column `quotaPrice` to the `campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaign" DROP COLUMN "titlePrice",
ADD COLUMN     "quotaPrice" DECIMAL(65,30) NOT NULL;

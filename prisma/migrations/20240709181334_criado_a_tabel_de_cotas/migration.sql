/*
  Warnings:

  - Added the required column `quotaId` to the `campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "quotaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Quota" (
    "id" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "Quota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

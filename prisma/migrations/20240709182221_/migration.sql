/*
  Warnings:

  - You are about to drop the `Quota` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campaign" DROP CONSTRAINT "campaign_quotaId_fkey";

-- DropTable
DROP TABLE "Quota";

-- CreateTable
CREATE TABLE "quota" (
    "id" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,

    CONSTRAINT "quota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "quota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

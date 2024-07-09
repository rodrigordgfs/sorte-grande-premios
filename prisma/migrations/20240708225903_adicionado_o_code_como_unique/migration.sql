/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "campaign_code_key" ON "campaign"("code");

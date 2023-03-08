/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `CoverLetter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CoverLetter_userId_key" ON "CoverLetter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_userId_key" ON "Job"("userId");

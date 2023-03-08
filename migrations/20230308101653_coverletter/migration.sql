/*
  Warnings:

  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jobId]` on the table `CoverLetter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Skill";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "CoverLetter_jobId_key" ON "CoverLetter"("jobId");

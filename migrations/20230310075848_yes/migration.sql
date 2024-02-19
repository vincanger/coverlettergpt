/*
  Warnings:

  - You are about to drop the column `shareableURL` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `shares` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobId]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobId` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoverLetter" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "shareableURL",
DROP COLUMN "shares",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_jobId_key" ON "Resume"("jobId");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

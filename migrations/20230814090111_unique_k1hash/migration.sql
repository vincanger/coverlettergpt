/*
  Warnings:

  - A unique constraint covering the columns `[loginUrl]` on the table `LnData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[k1Hash]` on the table `LnData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LnData" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "LnData_loginUrl_key" ON "LnData"("loginUrl");

-- CreateIndex
CREATE UNIQUE INDEX "LnData_k1Hash_key" ON "LnData"("k1Hash");

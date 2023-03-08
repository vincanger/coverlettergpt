-- AlterTable
ALTER TABLE "CoverLetter" ADD COLUMN "updatedAt" DATETIME;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN "shareableURL" TEXT;
ALTER TABLE "Job" ADD COLUMN "shares" INTEGER;

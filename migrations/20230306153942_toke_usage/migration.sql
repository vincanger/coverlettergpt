/*
  Warnings:

  - Added the required column `tokenUsage` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CoverLetter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenUsage" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "CoverLetter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoverLetter" ("content", "createdAt", "id", "jobId", "title", "updatedAt", "userId") SELECT "content", "createdAt", "id", "jobId", "title", "updatedAt", "userId" FROM "CoverLetter";
DROP TABLE "CoverLetter";
ALTER TABLE "new_CoverLetter" RENAME TO "CoverLetter";
CREATE UNIQUE INDEX "CoverLetter_userId_key" ON "CoverLetter"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

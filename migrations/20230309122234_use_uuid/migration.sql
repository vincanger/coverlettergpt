/*
  Warnings:

  - The primary key for the `Job` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CoverLetter` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "shareableURL" TEXT
);
INSERT INTO "new_Job" ("company", "createdAt", "description", "id", "isCompleted", "location", "shareableURL", "shares", "title", "updatedAt") SELECT "company", "createdAt", "description", "id", "isCompleted", "location", "shareableURL", "shares", "title", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_Resume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Resume" ("content", "createdAt", "id", "updatedAt") SELECT "content", "createdAt", "id", "updatedAt" FROM "Resume";
DROP TABLE "Resume";
ALTER TABLE "new_Resume" RENAME TO "Resume";
CREATE TABLE "new_CoverLetter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenUsage" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "CoverLetter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoverLetter" ("content", "createdAt", "id", "jobId", "title", "tokenUsage", "updatedAt") SELECT "content", "createdAt", "id", "jobId", "title", "tokenUsage", "updatedAt" FROM "CoverLetter";
DROP TABLE "CoverLetter";
ALTER TABLE "new_CoverLetter" RENAME TO "CoverLetter";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

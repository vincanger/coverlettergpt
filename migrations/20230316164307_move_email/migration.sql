/*
  Warnings:

  - You are about to drop the column `email` on the `SocialLogin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialLogin" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT;

/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateOfBirth",
ADD COLUMN     "storageLimit" BIGINT NOT NULL DEFAULT 2147483648;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

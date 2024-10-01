/*
  Warnings:

  - You are about to drop the `FavoriteVideos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoriteVideos" DROP CONSTRAINT "FavoriteVideos_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteVideos" DROP CONSTRAINT "FavoriteVideos_videoId_fkey";

-- DropTable
DROP TABLE "FavoriteVideos";

-- CreateTable
CREATE TABLE "favoriteVideos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "favoriteVideos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favoriteVideos" ADD CONSTRAINT "favoriteVideos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoriteVideos" ADD CONSTRAINT "favoriteVideos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

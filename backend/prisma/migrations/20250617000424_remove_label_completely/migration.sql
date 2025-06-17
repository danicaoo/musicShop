/*
  Warnings:

  - You are about to drop the column `labelId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_labelId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "labelId",
ADD COLUMN     "musicianId" INTEGER;

-- DropTable
DROP TABLE "Label";

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "Musician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

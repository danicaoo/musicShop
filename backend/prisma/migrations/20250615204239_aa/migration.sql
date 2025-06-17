-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VOCALIST', 'GUITARIST', 'BASSIST', 'DRUMMER', 'KEYBOARDIST', 'COMPOSER', 'CONDUCTOR', 'PRODUCER');

-- CreateTable
CREATE TABLE "Musician" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "country" TEXT,
    "bio" TEXT,
    "roles" "Role"[],

    CONSTRAINT "Musician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ensemble" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formationDate" TIMESTAMP(3) NOT NULL,
    "dissolutionDate" TIMESTAMP(3),
    "type" TEXT NOT NULL,

    CONSTRAINT "Ensemble_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnsembleMember" (
    "id" SERIAL NOT NULL,
    "ensembleId" INTEGER NOT NULL,
    "musicianId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "EnsembleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Composition" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "creationYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,

    CONSTRAINT "Composition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" SERIAL NOT NULL,
    "compositionId" INTEGER NOT NULL,
    "recordingDate" TIMESTAMP(3) NOT NULL,
    "studio" TEXT,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isDistributor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "catalogNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "labelId" INTEGER NOT NULL,
    "ensembleId" INTEGER,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "albumId" INTEGER NOT NULL,
    "recordingId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "albumId" INTEGER NOT NULL,
    "wholesalePrice" DOUBLE PRECISION NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "lastYearSales" INTEGER NOT NULL DEFAULT 0,
    "currentYearSales" INTEGER NOT NULL DEFAULT 0,
    "unsold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Musician_name_key" ON "Musician"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ensemble_name_key" ON "Ensemble"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Album_catalogNumber_key" ON "Album"("catalogNumber");

-- AddForeignKey
ALTER TABLE "EnsembleMember" ADD CONSTRAINT "EnsembleMember_ensembleId_fkey" FOREIGN KEY ("ensembleId") REFERENCES "Ensemble"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnsembleMember" ADD CONSTRAINT "EnsembleMember_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "Musician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_compositionId_fkey" FOREIGN KEY ("compositionId") REFERENCES "Composition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_ensembleId_fkey" FOREIGN KEY ("ensembleId") REFERENCES "Ensemble"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

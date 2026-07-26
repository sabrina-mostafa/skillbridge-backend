-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shortDesc" TEXT,
ADD COLUMN     "thumbnail" TEXT;

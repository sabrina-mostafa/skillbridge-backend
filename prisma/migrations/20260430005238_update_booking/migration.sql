-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'DECLINED';

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_parentId_fkey";

-- DropIndex
DROP INDEX "Booking_tutorId_startTime_key";

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

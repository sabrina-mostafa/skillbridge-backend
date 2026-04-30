/*
  Warnings:

  - You are about to drop the `BookingSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tutorId,startTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingSlot" DROP CONSTRAINT "BookingSlot_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingSlot" DROP CONSTRAINT "BookingSlot_slotId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_availabilityId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_tutorId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "BookingSlot";

-- DropTable
DROP TABLE "TimeSlot";

-- CreateIndex
CREATE INDEX "Booking_tutorId_date_idx" ON "Booking"("tutorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tutorId_startTime_key" ON "Booking"("tutorId", "startTime");

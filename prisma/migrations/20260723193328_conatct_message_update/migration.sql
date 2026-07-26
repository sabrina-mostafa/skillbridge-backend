/*
  Warnings:

  - You are about to drop the column `subjects` on the `ContactMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactMessage" DROP COLUMN "subjects",
ADD COLUMN     "inquiryType" TEXT[];

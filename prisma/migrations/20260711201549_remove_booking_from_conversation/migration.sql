/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_bookingId_fkey";

-- DropIndex
DROP INDEX "Conversation_bookingId_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "bookingId";

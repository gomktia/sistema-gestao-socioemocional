/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "accessCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "students_accessCode_key" ON "students"("accessCode");

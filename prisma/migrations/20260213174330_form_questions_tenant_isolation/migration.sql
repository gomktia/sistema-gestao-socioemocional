/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,type,number]` on the table `form_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "form_questions_type_number_key";

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "ip" TEXT;

-- AlterTable
ALTER TABLE "form_questions" ADD COLUMN     "tenantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "form_questions_tenantId_type_number_key" ON "form_questions"("tenantId", "type", "number");

-- AddForeignKey
ALTER TABLE "form_questions" ADD CONSTRAINT "form_questions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

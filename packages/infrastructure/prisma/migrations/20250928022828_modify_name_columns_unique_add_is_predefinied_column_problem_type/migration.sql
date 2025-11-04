/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Faculties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Project_Types` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Problem_Types" ADD COLUMN     "is_predefined" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Faculties_name_key" ON "Faculties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_Types_name_key" ON "Project_Types"("name");

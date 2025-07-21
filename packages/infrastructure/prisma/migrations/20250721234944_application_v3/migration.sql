/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Problem_Types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Problem_Types_name_key" ON "Problem_Types"("name");

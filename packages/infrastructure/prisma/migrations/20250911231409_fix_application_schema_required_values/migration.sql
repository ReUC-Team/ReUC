/*
  Warnings:

  - Made the column `description` on table `Applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `short_description` on table `Applications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Applications" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "short_description" SET NOT NULL;

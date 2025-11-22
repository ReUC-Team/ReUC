/*
  Warnings:

  - You are about to drop the column `slug` on the `Project_Types` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Project_Types_slug_key";

-- AlterTable
ALTER TABLE "public"."Project_Types" DROP COLUMN "slug";

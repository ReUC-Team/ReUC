/*
  Warnings:

  - You are about to drop the column `project_type_id` on the `Projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Projects" DROP CONSTRAINT "Projects_project_type_id_fkey";

-- AlterTable
ALTER TABLE "public"."Projects" DROP COLUMN "project_type_id";

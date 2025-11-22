/*
  Warnings:

  - You are about to drop the column `description` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_date` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_effort_hours` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `short_description` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the `Project_Faculties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project_Problem_Types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Project_Faculties" DROP CONSTRAINT "Project_Faculties_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project_Faculties" DROP CONSTRAINT "Project_Faculties_uuid_project_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project_Problem_Types" DROP CONSTRAINT "Project_Problem_Types_problem_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project_Problem_Types" DROP CONSTRAINT "Project_Problem_Types_uuid_project_fkey";

-- AlterTable
ALTER TABLE "public"."Projects" DROP COLUMN "description",
DROP COLUMN "estimated_date",
DROP COLUMN "estimated_effort_hours",
DROP COLUMN "short_description",
DROP COLUMN "title";

-- DropTable
DROP TABLE "public"."Project_Faculties";

-- DropTable
DROP TABLE "public"."Project_Problem_Types";

/*
  Warnings:

  - You are about to drop the column `visibility` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_time` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `project_type_id` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `topic_interest` on the `Projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid_application]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_date` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_effort_hours` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_description` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Projects" DROP CONSTRAINT "Projects_project_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Projects" DROP CONSTRAINT "Projects_status_fkey";

-- DropIndex
DROP INDEX "public"."Projects_project_type_id_idx";

-- DropIndex
DROP INDEX "public"."Projects_status_idx";

-- AlterTable
ALTER TABLE "public"."Applications" DROP COLUMN "visibility";

-- AlterTable
ALTER TABLE "public"."Professor_Roles" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Project_Statuses" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Projects" DROP COLUMN "estimated_time",
DROP COLUMN "project_type_id",
DROP COLUMN "status",
DROP COLUMN "topic_interest",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "estimated_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimated_effort_hours" INTEGER NOT NULL,
ADD COLUMN     "short_description" TEXT NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student_Statuses" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."User_Statuses" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "public"."Project_Project_Types" (
    "uuid_project" TEXT NOT NULL,
    "project_type_id" INTEGER NOT NULL,

    CONSTRAINT "Project_Project_Types_pkey" PRIMARY KEY ("uuid_project","project_type_id")
);

-- CreateTable
CREATE TABLE "public"."Project_Faculties" (
    "uuid_project" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,

    CONSTRAINT "Project_Faculties_pkey" PRIMARY KEY ("uuid_project","faculty_id")
);

-- CreateTable
CREATE TABLE "public"."Project_Problem_Types" (
    "uuid_project" TEXT NOT NULL,
    "problem_type_id" INTEGER NOT NULL,

    CONSTRAINT "Project_Problem_Types_pkey" PRIMARY KEY ("uuid_project","problem_type_id")
);

-- CreateIndex
CREATE INDEX "Application_Faculties_faculty_id_idx" ON "public"."Application_Faculties"("faculty_id");

-- CreateIndex
CREATE INDEX "Application_Problem_Types_problem_type_id_idx" ON "public"."Application_Problem_Types"("problem_type_id");

-- CreateIndex
CREATE INDEX "Application_Project_Types_project_type_id_idx" ON "public"."Application_Project_Types"("project_type_id");

-- CreateIndex
CREATE INDEX "Applications_deadline_idx" ON "public"."Applications"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_uuid_application_key" ON "public"."Projects"("uuid_application");

-- CreateIndex
CREATE INDEX "Projects_statusId_idx" ON "public"."Projects"("statusId");

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Project_Statuses"("project_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Project_Types" ADD CONSTRAINT "Project_Project_Types_uuid_project_fkey" FOREIGN KEY ("uuid_project") REFERENCES "public"."Projects"("uuid_project") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Project_Types" ADD CONSTRAINT "Project_Project_Types_project_type_id_fkey" FOREIGN KEY ("project_type_id") REFERENCES "public"."Project_Types"("project_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Faculties" ADD CONSTRAINT "Project_Faculties_uuid_project_fkey" FOREIGN KEY ("uuid_project") REFERENCES "public"."Projects"("uuid_project") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Faculties" ADD CONSTRAINT "Project_Faculties_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."Faculties"("faculty_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Problem_Types" ADD CONSTRAINT "Project_Problem_Types_uuid_project_fkey" FOREIGN KEY ("uuid_project") REFERENCES "public"."Projects"("uuid_project") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Problem_Types" ADD CONSTRAINT "Project_Problem_Types_problem_type_id_fkey" FOREIGN KEY ("problem_type_id") REFERENCES "public"."Problem_Types"("problem_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

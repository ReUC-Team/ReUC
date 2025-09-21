/*
  Warnings:

  - You are about to drop the column `email` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_time` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `extended_description` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `outsider_name` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `project_TypeProject_type_id` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `project_type` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `topic_interest` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `uuid_user` on the `Applications` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `Applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid_outsider` to the `Applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Applications" DROP CONSTRAINT "Applications_project_TypeProject_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Applications" DROP CONSTRAINT "Applications_uuid_user_fkey";

-- DropIndex
DROP INDEX "Applications_topic_interest_idx";

-- DropIndex
DROP INDEX "Applications_uuid_user_idx";

-- AlterTable
ALTER TABLE "Applications" DROP COLUMN "email",
DROP COLUMN "estimated_time",
DROP COLUMN "extended_description",
DROP COLUMN "name",
DROP COLUMN "outsider_name",
DROP COLUMN "phone",
DROP COLUMN "project_TypeProject_type_id",
DROP COLUMN "project_type",
DROP COLUMN "topic_interest",
DROP COLUMN "uuid_user",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "uuid_outsider" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Application_Project_Types" (
    "uuid_application" TEXT NOT NULL,
    "project_type_id" INTEGER NOT NULL,

    CONSTRAINT "Application_Project_Types_pkey" PRIMARY KEY ("uuid_application","project_type_id")
);

-- CreateTable
CREATE TABLE "Application_Faculties" (
    "uuid_application" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,

    CONSTRAINT "Application_Faculties_pkey" PRIMARY KEY ("uuid_application","faculty_id")
);

-- CreateTable
CREATE TABLE "Application_Problem_Types" (
    "uuid_application" TEXT NOT NULL,
    "problem_type_id" INTEGER NOT NULL,

    CONSTRAINT "Application_Problem_Types_pkey" PRIMARY KEY ("uuid_application","problem_type_id")
);

-- CreateTable
CREATE TABLE "Faculties" (
    "faculty_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculties_pkey" PRIMARY KEY ("faculty_id")
);

-- CreateTable
CREATE TABLE "Problem_Types" (
    "problem_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_Types_pkey" PRIMARY KEY ("problem_type_id")
);

-- CreateIndex
CREATE INDEX "Applications_uuid_outsider_idx" ON "Applications"("uuid_outsider");

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_uuid_outsider_fkey" FOREIGN KEY ("uuid_outsider") REFERENCES "Outsiders"("uuid_outsider") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Project_Types" ADD CONSTRAINT "Application_Project_Types_uuid_application_fkey" FOREIGN KEY ("uuid_application") REFERENCES "Applications"("uuid_application") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Project_Types" ADD CONSTRAINT "Application_Project_Types_project_type_id_fkey" FOREIGN KEY ("project_type_id") REFERENCES "Project_Types"("project_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Faculties" ADD CONSTRAINT "Application_Faculties_uuid_application_fkey" FOREIGN KEY ("uuid_application") REFERENCES "Applications"("uuid_application") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Faculties" ADD CONSTRAINT "Application_Faculties_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculties"("faculty_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Problem_Types" ADD CONSTRAINT "Application_Problem_Types_uuid_application_fkey" FOREIGN KEY ("uuid_application") REFERENCES "Applications"("uuid_application") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application_Problem_Types" ADD CONSTRAINT "Application_Problem_Types_problem_type_id_fkey" FOREIGN KEY ("problem_type_id") REFERENCES "Problem_Types"("problem_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

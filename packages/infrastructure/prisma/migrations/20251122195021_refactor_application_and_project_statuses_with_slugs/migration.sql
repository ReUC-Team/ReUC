/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Project_Statuses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Project_Statuses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status_id` to the `Applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project_Statuses` table without a default value. This is not possible if the table is not empty.
  - Made the column `statusId` on table `Projects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Projects" DROP CONSTRAINT "Projects_statusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Team_Members" DROP CONSTRAINT "Team_Members_uuid_project_fkey";

-- AlterTable
ALTER TABLE "public"."Applications" ADD COLUMN     "status_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Project_Statuses" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Projects" ALTER COLUMN "statusId" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."Application_Statuses" (
    "application_status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_Statuses_pkey" PRIMARY KEY ("application_status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_Statuses_name_key" ON "public"."Application_Statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Application_Statuses_slug_key" ON "public"."Application_Statuses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_Statuses_name_key" ON "public"."Project_Statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_Statuses_slug_key" ON "public"."Project_Statuses"("slug");

-- AddForeignKey
ALTER TABLE "public"."Applications" ADD CONSTRAINT "Applications_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."Application_Statuses"("application_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Project_Statuses"("project_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team_Members" ADD CONSTRAINT "Team_Members_uuid_project_fkey" FOREIGN KEY ("uuid_project") REFERENCES "public"."Projects"("uuid_project") ON DELETE CASCADE ON UPDATE CASCADE;

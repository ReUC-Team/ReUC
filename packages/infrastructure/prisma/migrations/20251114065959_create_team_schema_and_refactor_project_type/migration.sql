/*
  Warnings:

  - You are about to drop the column `estimated_time` on the `Project_Types` table. All the data in the column will be lost.
  - You are about to drop the column `max_team_advisors_size` on the `Project_Types` table. All the data in the column will be lost.
  - You are about to drop the column `max_team_members_size` on the `Project_Types` table. All the data in the column will be lost.
  - You are about to drop the column `min_team_advisors_size` on the `Project_Types` table. All the data in the column will be lost.
  - You are about to drop the column `min_team_members_size` on the `Project_Types` table. All the data in the column will be lost.
  - You are about to drop the `Project_Project_Types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_type_id` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Project_Project_Types" DROP CONSTRAINT "Project_Project_Types_project_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project_Project_Types" DROP CONSTRAINT "Project_Project_Types_uuid_project_fkey";

-- AlterTable
ALTER TABLE "public"."Project_Types" DROP COLUMN "estimated_time",
DROP COLUMN "max_team_advisors_size",
DROP COLUMN "max_team_members_size",
DROP COLUMN "min_team_advisors_size",
DROP COLUMN "min_team_members_size",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "max_estimated_months" INTEGER,
ADD COLUMN     "min_estimated_months" INTEGER,
ADD COLUMN     "required_hours" INTEGER;

-- AlterTable
ALTER TABLE "public"."Projects" ADD COLUMN     "project_type_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Project_Project_Types";

-- CreateTable
CREATE TABLE "public"."Project_Type_Role_Constraints" (
    "constraint_id" SERIAL NOT NULL,
    "project_type_id" INTEGER NOT NULL,
    "team_role_id" INTEGER NOT NULL,
    "min_count" INTEGER NOT NULL,
    "max_count" INTEGER,

    CONSTRAINT "Project_Type_Role_Constraints_pkey" PRIMARY KEY ("constraint_id")
);

-- CreateTable
CREATE TABLE "public"."Team_Roles" (
    "team_role_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_Roles_pkey" PRIMARY KEY ("team_role_id")
);

-- CreateTable
CREATE TABLE "public"."Team_Members" (
    "uuid_team_member" TEXT NOT NULL,
    "uuid_project" TEXT NOT NULL,
    "uuid_user" TEXT NOT NULL,
    "team_role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_Members_pkey" PRIMARY KEY ("uuid_team_member")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_Type_Role_Constraints_project_type_id_team_role_id_key" ON "public"."Project_Type_Role_Constraints"("project_type_id", "team_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Roles_name_key" ON "public"."Team_Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Members_uuid_project_uuid_user_key" ON "public"."Team_Members"("uuid_project", "uuid_user");

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_project_type_id_fkey" FOREIGN KEY ("project_type_id") REFERENCES "public"."Project_Types"("project_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Type_Role_Constraints" ADD CONSTRAINT "Project_Type_Role_Constraints_project_type_id_fkey" FOREIGN KEY ("project_type_id") REFERENCES "public"."Project_Types"("project_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Type_Role_Constraints" ADD CONSTRAINT "Project_Type_Role_Constraints_team_role_id_fkey" FOREIGN KEY ("team_role_id") REFERENCES "public"."Team_Roles"("team_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team_Members" ADD CONSTRAINT "Team_Members_uuid_project_fkey" FOREIGN KEY ("uuid_project") REFERENCES "public"."Projects"("uuid_project") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team_Members" ADD CONSTRAINT "Team_Members_uuid_user_fkey" FOREIGN KEY ("uuid_user") REFERENCES "public"."Users"("uuid_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team_Members" ADD CONSTRAINT "Team_Members_team_role_id_fkey" FOREIGN KEY ("team_role_id") REFERENCES "public"."Team_Roles"("team_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

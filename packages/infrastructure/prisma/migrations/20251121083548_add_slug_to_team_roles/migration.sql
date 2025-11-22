/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Team_Roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Team_Roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Team_Roles" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_Roles_slug_key" ON "public"."Team_Roles"("slug");

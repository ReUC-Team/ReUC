/*
  Warnings:

  - Added the required column `uuid_creator` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Projects" ADD COLUMN     "uuid_creator" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_uuid_creator_fkey" FOREIGN KEY ("uuid_creator") REFERENCES "public"."Users"("uuid_user") ON DELETE RESTRICT ON UPDATE CASCADE;

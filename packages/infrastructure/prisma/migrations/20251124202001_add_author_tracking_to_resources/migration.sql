/*
  Warnings:

  - Added the required column `uuid_created_by` to the `External_Links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."External_Links" ADD COLUMN     "uuid_created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."File_Links" ADD COLUMN     "uuid_created_by" TEXT;

-- AddForeignKey
ALTER TABLE "public"."File_Links" ADD CONSTRAINT "File_Links_uuid_created_by_fkey" FOREIGN KEY ("uuid_created_by") REFERENCES "public"."Users"("uuid_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."External_Links" ADD CONSTRAINT "External_Links_uuid_created_by_fkey" FOREIGN KEY ("uuid_created_by") REFERENCES "public"."Users"("uuid_user") ON DELETE RESTRICT ON UPDATE CASCADE;

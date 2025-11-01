/*
  Warnings:

  - A unique constraint covering the columns `[model_target,uuid_target,uuid_file,purpose]` on the table `File_Links` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."File_Links_model_target_uuid_target_purpose_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_Links_model_target_uuid_target_uuid_file_purpose_key" ON "public"."File_Links"("model_target", "uuid_target", "uuid_file", "purpose");

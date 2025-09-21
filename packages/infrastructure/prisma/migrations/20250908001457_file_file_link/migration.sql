/*
  Warnings:

  - Changed the type of `status` on the `Projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Project_Statuses" (
    "project_status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_Statuses_pkey" PRIMARY KEY ("project_status_id")
);

-- CreateTable
CREATE TABLE "Files" (
    "uuid_file" TEXT NOT NULL,
    "stored_path" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_kind" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("uuid_file")
);

-- CreateTable
CREATE TABLE "File_Links" (
    "file_link_id" SERIAL NOT NULL,
    "model_target" TEXT NOT NULL,
    "uuid_target" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uuid_file" TEXT NOT NULL,

    CONSTRAINT "File_Links_pkey" PRIMARY KEY ("file_link_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_Links_model_target_uuid_target_purpose_key" ON "File_Links"("model_target", "uuid_target", "purpose");

-- CreateIndex
CREATE INDEX "Projects_status_idx" ON "Projects"("status");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_status_fkey" FOREIGN KEY ("status") REFERENCES "Project_Statuses"("project_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File_Links" ADD CONSTRAINT "File_Links_uuid_file_fkey" FOREIGN KEY ("uuid_file") REFERENCES "Files"("uuid_file") ON DELETE RESTRICT ON UPDATE CASCADE;

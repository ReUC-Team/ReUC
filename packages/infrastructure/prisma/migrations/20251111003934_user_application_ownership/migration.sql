/*
  Warnings:

  - You are about to drop the column `uuid_outsider` on the `Applications` table. All the data in the column will be lost.
  - Added the required column `uuid_author` to the `Applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Applications" DROP CONSTRAINT "Applications_uuid_outsider_fkey";

-- DropIndex
DROP INDEX "public"."Applications_uuid_outsider_idx";

-- AlterTable
ALTER TABLE "public"."Applications" DROP COLUMN "uuid_outsider",
ADD COLUMN     "uuid_author" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Applications_uuid_author_idx" ON "public"."Applications"("uuid_author");

-- AddForeignKey
ALTER TABLE "public"."Applications" ADD CONSTRAINT "Applications_uuid_author_fkey" FOREIGN KEY ("uuid_author") REFERENCES "public"."Users"("uuid_user") ON DELETE RESTRICT ON UPDATE CASCADE;

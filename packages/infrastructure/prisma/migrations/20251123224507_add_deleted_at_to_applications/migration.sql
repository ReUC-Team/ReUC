-- AlterTable
ALTER TABLE "public"."Applications" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Applications_deleted_at_idx" ON "public"."Applications"("deleted_at");

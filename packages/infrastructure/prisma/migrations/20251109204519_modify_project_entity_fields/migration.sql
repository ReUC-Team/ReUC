-- DropForeignKey
ALTER TABLE "public"."Projects" DROP CONSTRAINT "Projects_statusId_fkey";

-- AlterTable
ALTER TABLE "public"."Projects" ALTER COLUMN "statusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Project_Statuses"("project_status_id") ON DELETE SET NULL ON UPDATE CASCADE;

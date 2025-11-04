/*
  Warnings:

  - You are about to drop the column `mime_type` on the `Files` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "mime_type",
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "original_name" TEXT,
ADD COLUMN     "stored_name" TEXT;

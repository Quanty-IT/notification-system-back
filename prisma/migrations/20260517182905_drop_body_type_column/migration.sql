/*
  Warnings:

  - You are about to drop the column `body_type` on the `communications` table. All the data in the column will be lost.
  - You are about to drop the column `body_type` on the `template_versions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "communications" DROP COLUMN "body_type";

-- AlterTable
ALTER TABLE "template_versions" DROP COLUMN "body_type";

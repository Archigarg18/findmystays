/*
  Warnings:

  - You are about to drop the `owner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `owner` DROP FOREIGN KEY `Owner_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `city` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `owner`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `paymentScreenshot` VARCHAR(191) NULL,
    ADD COLUMN `txRef` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;

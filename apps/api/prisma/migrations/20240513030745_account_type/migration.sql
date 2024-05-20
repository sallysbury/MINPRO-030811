-- AlterTable
ALTER TABLE `Promotor` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'promotors';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'psers';

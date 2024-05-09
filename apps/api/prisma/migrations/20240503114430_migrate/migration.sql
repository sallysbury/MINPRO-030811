/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `iamge` on the `Promotor` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Promotor` table. All the data in the column will be lost.
  - You are about to drop the `samples` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[referral]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promoItemId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDisc` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referral` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `date`,
    ADD COLUMN `address` LONGTEXT NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `eventDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `image` LONGTEXT NULL,
    ADD COLUMN `slug` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Promotor` DROP COLUMN `iamge`,
    DROP COLUMN `token`,
    ADD COLUMN `image` LONGTEXT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `promoItemId` INTEGER NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('pending', 'paid', 'cancel') NOT NULL,
    ADD COLUMN `totalDisc` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `redeem` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `referral` VARCHAR(191) NOT NULL,
    MODIFY `image` LONGTEXT NULL;

-- DropTable
DROP TABLE `samples`;

-- CreateTable
CREATE TABLE `Promo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromoItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `promoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Point` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `point` INTEGER NOT NULL,
    `expiredDate` DATETIME(3) NOT NULL,
    `redeem` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_referral_key` ON `User`(`referral`);

-- AddForeignKey
ALTER TABLE `Promo` ADD CONSTRAINT `Promo_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromoItem` ADD CONSTRAINT `PromoItem_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

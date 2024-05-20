/*
  Warnings:

  - You are about to drop the column `isPromotor` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `OrderTicket` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referal` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_eventId_fkey`;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL,
    ADD COLUMN `seats` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `isPromotor`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `referal` VARCHAR(191) NOT NULL,
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    MODIFY `image` LONGTEXT NOT NULL;

-- DropTable
DROP TABLE `OrderTicket`;

-- CreateTable
CREATE TABLE `Promotor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `iamge` LONGTEXT NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `dateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiredDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Promotor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

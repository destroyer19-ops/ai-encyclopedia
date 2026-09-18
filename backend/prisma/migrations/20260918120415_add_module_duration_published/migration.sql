-- AlterTable
ALTER TABLE `Module` ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT true;

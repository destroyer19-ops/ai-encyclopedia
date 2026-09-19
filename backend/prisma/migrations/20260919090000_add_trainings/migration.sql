CREATE TABLE `Training` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL DEFAULT '',
    `venue` VARCHAR(191) NOT NULL DEFAULT '',
    `eventDate` DATE NULL,
    `endDate` DATE NULL,
    `eventTime` VARCHAR(191) NOT NULL DEFAULT '',
    `format` VARCHAR(191) NOT NULL DEFAULT 'In person',
    `registrationUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `imageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

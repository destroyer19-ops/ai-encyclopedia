-- Keep the database in sync with prisma/schema.prisma.
-- These columns are already used by the backend and frontend enrollment flow.
SELECT IF(
  COUNT(*) = 0,
  'ALTER TABLE `Course` ADD COLUMN `imageUrl` VARCHAR(191) NULL',
  'SELECT 1'
) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Course'
  AND COLUMN_NAME = 'imageUrl';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT IF(
  COUNT(*) = 0,
  'ALTER TABLE `Course` ADD COLUMN `ecardUrl` VARCHAR(191) NULL',
  'SELECT 1'
) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Course'
  AND COLUMN_NAME = 'ecardUrl';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT IF(
  COUNT(*) = 0,
  'ALTER TABLE `Enrollment` ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL DEFAULT ''unpaid''',
  'SELECT 1'
) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Enrollment'
  AND COLUMN_NAME = 'paymentStatus';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT IF(
  COUNT(*) = 0,
  'ALTER TABLE `Enrollment` ADD COLUMN `paymentProofUrl` VARCHAR(191) NULL',
  'SELECT 1'
) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Enrollment'
  AND COLUMN_NAME = 'paymentProofUrl';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

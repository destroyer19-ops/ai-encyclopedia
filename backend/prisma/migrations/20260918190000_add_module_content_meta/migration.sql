-- Extend modules with structured metadata for files and quizzes.
SELECT IF(
  COUNT(*) = 0,
  'ALTER TABLE `Module` ADD COLUMN `contentMeta` JSON NULL',
  'SELECT 1'
) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Module'
  AND COLUMN_NAME = 'contentMeta';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

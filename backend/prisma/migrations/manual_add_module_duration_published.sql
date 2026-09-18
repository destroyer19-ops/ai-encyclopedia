-- Migration: add duration and isPublished to Module table
-- Run this against your database when deploying

ALTER TABLE `Module`
  ADD COLUMN `duration`    INT         NULL,
  ADD COLUMN `isPublished` TINYINT(1)  NOT NULL DEFAULT 1;

-- Also note: contentUrl now stores the S3 object KEY (e.g. "uploads/modules/abc.mp4")
-- NOT a full public URL. The backend generates a short-lived presigned GET URL at request time.
-- Existing rows that have a full URL will need to be backfilled manually if/when they are migrated.

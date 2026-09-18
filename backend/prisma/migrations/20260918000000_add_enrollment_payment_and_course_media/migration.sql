-- Keep the database in sync with prisma/schema.prisma.
-- These columns are already used by the backend and frontend enrollment flow.
ALTER TABLE `Course`
  ADD COLUMN `imageUrl` VARCHAR(191) NULL,
  ADD COLUMN `ecardUrl` VARCHAR(191) NULL;

ALTER TABLE `Enrollment`
  ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'unpaid',
  ADD COLUMN `paymentProofUrl` VARCHAR(191) NULL;

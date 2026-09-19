-- Keep legacy Course.isPublished rows aligned with the public course status field.
UPDATE `Course`
SET `status` = CASE WHEN `isPublished` = TRUE THEN 'published' ELSE 'draft' END
WHERE `status` IS NULL
   OR (`isPublished` = TRUE AND `status` <> 'published')
   OR (`isPublished` = FALSE AND `status` <> 'draft');

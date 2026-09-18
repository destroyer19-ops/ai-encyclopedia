-- Ensure the courses shown by the frontend also exist in the backend database.
-- Enrollment endpoints resolve by Course.slug and require status='published'.
INSERT INTO `Course` (`id`, `slug`, `persona`, `title`, `category`, `description`, `status`)
VALUES
  (
    UUID(),
    'ai-for-business-applications',
    'Youth',
    'AI for Business Applications',
    '01',
    'Learn how to use AI for spreadsheets, databases, automation and operations.',
    'published'
  ),
  (
    UUID(),
    'ai-for-content-creation',
    'Youth',
    'AI for Content Creation',
    '02',
    'Write, script, record and produce content for real audiences across social, editorial, audio and video.',
    'published'
  ),
  (
    UUID(),
    'ai-for-digital-publishing',
    'Youth',
    'AI for Digital Publishing',
    '03',
    'Design and publish finished materials: print pieces, documents, e-books, web pages and a consistent brand system.',
    'published'
  ),
  (
    UUID(),
    'the-50-essential-ai-tools',
    'Youth',
    'The 50 Essential AI Tools',
    '04',
    'A guided tour of fifty tools, how to compare them honestly, and how to decide which ones earn a place in your workflow.',
    'published'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `category` = VALUES(`category`),
  `description` = VALUES(`description`),
  `status` = 'published';

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// You will need to ensure these are set in your .env file
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log('Fetching courses from Supabase...');
  const { data: supabaseCourses, error } = await supabase
    .from('courses')
    .select('*');

  if (error) {
    console.error('Error fetching courses from Supabase:', error);
    process.exit(1);
  }

  console.log(`Found ${supabaseCourses?.length || 0} courses in Supabase.`);

  for (const course of supabaseCourses || []) {
    console.log(`Migrating course: ${course.title}...`);
    
    // Map the Supabase course schema to the Prisma Course schema
    // Adjust these fields based on the exact structure of your Supabase table
    await prisma.course.upsert({
      where: {
        persona_slug: {
          persona: course.persona || 'General',
          slug: course.slug || uuidv4()
        }
      },
      update: {
        title: course.title,
        category: course.level || course.category || 'Uncategorized',
        description: course.overview || course.summary || '',
        imageUrl: course.image_url || null,
        status: course.published ? 'published' : 'draft',
      },
      create: {
        slug: course.slug || uuidv4(),
        persona: course.persona || 'General',
        title: course.title,
        category: course.level || course.category || 'Uncategorized',
        description: course.overview || course.summary || '',
        imageUrl: course.image_url || null,
        status: course.published ? 'published' : 'draft',
      }
    });
  }

  console.log('Course migration completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

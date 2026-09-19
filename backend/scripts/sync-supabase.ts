import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://logphwxmjompkqlrricg.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_V68cU6yCdG4BALFlyt3xCg_vaX2sGRG";

async function main() {
  console.log('Fetching courses from Supabase...');
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to fetch from Supabase: ${res.status} ${text}`);
    process.exit(1);
  }

  const courses = await res.json() as any[];
  console.log(`Fetched ${courses.length} courses. Updating local database...`);

  for (const sc of courses) {
    console.log(`- Upserting ${sc.slug}...`);
    
    // Some field mappings based on likely Supabase column names vs Prisma schema names
    const data = {
      slug: sc.slug,
      persona: sc.persona || "Youth",
      title: sc.title,
      category: sc.level || sc.category || "01",
      description: sc.summary || sc.description || "",
      overview: sc.overview || null,
      tone: sc.tone || "bg-sky",
      imageUrl: sc.image_url || sc.imageUrl || null,
      ecardUrl: sc.ecard_url || sc.ecardUrl || null,
      status: sc.published ? "published" : "draft",
      isPublished: !!sc.published,
      sortOrder: sc.sort_order ?? sc.sortOrder ?? 0,
      country: sc.country || "Global",
      tier: sc.tier || null,
      outcomes: sc.outcomes || [],
      sessions: sc.sessions || []
    };

    await prisma.course.upsert({
      where: {
        persona_slug: { persona: data.persona, slug: data.slug }
      },
      update: data,
      create: data
    });
  }

  console.log('Sync complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

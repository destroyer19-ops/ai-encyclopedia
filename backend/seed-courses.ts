import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const staticCourses = [
  {
    slug: "ai-for-business-applications",
    persona: "Youth",
    title: "AI for Business Applications",
    category: "01",
    description: "Learn how to use AI for spreadsheets, databases, automation and operations.",
    status: "published"
  },
  {
    slug: "ai-for-content-creation",
    persona: "Youth",
    title: "AI for Content Creation",
    category: "02",
    description: "Write, script, record and produce content for real audiences across social, editorial, audio and video.",
    status: "published"
  },
  {
    slug: "ai-for-digital-publishing",
    persona: "Youth",
    title: "AI for Digital Publishing",
    category: "03",
    description: "Design and publish finished materials: print pieces, documents, e-books, web pages and a consistent brand system.",
    status: "published"
  },
  {
    slug: "the-50-essential-ai-tools",
    persona: "Youth",
    title: "The 50 Essential AI Tools",
    category: "04",
    description: "A guided tour of fifty tools, how to compare them honestly, and how to decide which ones earn a place in your workflow.",
    status: "published"
  }
];

async function main() {
  console.log('Seeding courses...');
  for (const c of staticCourses) {
    await prisma.course.upsert({
      where: { persona_slug: { persona: c.persona, slug: c.slug } },
      update: {},
      create: c,
    });
  }
  console.log('Done!');
}
main().catch(console.error).finally(() => prisma.$disconnect());

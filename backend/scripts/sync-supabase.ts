import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://logphwxmjompkqlrricg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_V68cU6yCdG4BALFlyt3xCg_vaX2sGRG';

async function fetchTable(table: string, select = '*') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`  ⚠ Could not fetch "${table}": ${res.status} ${text}`);
    return [];
  }
  return res.json() as Promise<any[]>;
}

async function syncCourses() {
  console.log('\n📚 Syncing courses...');
  const rows = await fetchTable('courses');
  console.log(`  Fetched ${rows.length} courses.`);

  for (const sc of rows) {
    const data = {
      slug:              sc.slug ?? '',
      persona:           sc.persona ?? 'Youth',
      title:             sc.title ?? '',
      category:          sc.category_id ?? sc.category ?? sc.level ?? '01',
      description:       sc.summary ?? sc.description ?? '',
      overview:          sc.overview ?? null,
      tone:              sc.tone ?? 'bg-sky',
      imageUrl:          sc.image_url ?? sc.imageUrl ?? null,
      ecardUrl:          sc.ecard_url ?? sc.ecardUrl ?? null,
      status:            sc.status ?? (sc.published ? 'published' : 'draft'),
      isPublished:       sc.published ?? sc.isPublished ?? false,
      featured:          sc.featured ?? false,
      sortOrder:         sc.sort_order ?? sc.sortOrder ?? 0,
      country:           sc.country ?? 'Global',
      tier:              sc.tier ?? null,
      price:             sc.price ?? null,
      outcomes:          sc.outcomes ?? [],
      sessions:          sc.sessions ?? [],
      // New educator fields
      educatorId:        sc.educator_id ?? null,
      authorName:        sc.author_name ?? null,
      authorAvatarUrl:   sc.author_avatar_url ?? null,
      courseLevel:       sc.course_level ?? null,
      language:          sc.language ?? null,
      delivery:          sc.delivery ?? null,
      durationHours:     sc.duration_hours ?? null,
      passMark:          sc.pass_mark ?? null,
      sequentialModules: sc.sequential_modules ?? true,
      requireAssessment: sc.require_assessment ?? true,
      rejectionReason:   sc.rejection_reason ?? null,
    };

    await prisma.course.upsert({
      where: { persona_slug: { persona: data.persona, slug: data.slug } },
      update: data,
      create: data,
    });
    console.log(`  ✓ ${data.slug}`);
  }
}

async function syncModules() {
  console.log('\n📦 Syncing modules...');
  const rows = await fetchTable('modules');
  console.log(`  Fetched ${rows.length} modules.`);

  for (const m of rows) {
    // Only upsert if the course exists locally
    const course = await prisma.course.findUnique({ where: { id: m.course_id } });
    if (!course) {
      console.warn(`  ⚠ Skipping module "${m.title}" — course ${m.course_id} not found locally.`);
      continue;
    }

    const data = {
      courseId:       m.course_id,
      title:          m.title ?? 'Untitled',
      order:          m.sort_order ?? m.order ?? 0,
      contentType:    m.content_type ?? m.contentType ?? 'text',
      contentUrl:     m.content_url ?? m.contentUrl ?? null,
      videoUrl:       m.video_url ?? m.videoUrl ?? null,
      fileUrl:        m.file_url ?? m.fileUrl ?? null,
      contentBody:    m.content ?? m.content_body ?? m.contentBody ?? null,
      contentMeta:    m.content_meta ?? m.contentMeta ?? null,
      durationMinutes: m.duration_minutes ?? m.duration ?? null,
      isPublished:    m.is_published ?? m.isPublished ?? true,
    };

    await prisma.module.upsert({
      where: { id: m.id },
      update: data,
      create: { id: m.id, ...data },
    });
    console.log(`  ✓ ${m.title}`);
  }
}

async function syncProfiles() {
  console.log('\n👤 Syncing profiles...');
  const rows = await fetchTable('profiles');
  console.log(`  Fetched ${rows.length} profiles.`);

  for (const p of rows) {
    await prisma.profile.upsert({
      where: { id: p.id },
      update: {
        email:     p.email ?? '',
        firstName: p.first_name ?? null,
        lastName:  p.last_name ?? null,
        avatarUrl: p.avatar_url ?? null,
      },
      create: {
        id:        p.id,
        email:     p.email ?? '',
        firstName: p.first_name ?? null,
        lastName:  p.last_name ?? null,
        avatarUrl: p.avatar_url ?? null,
      },
    });
    console.log(`  ✓ ${p.email}`);
  }
}

async function syncEducatorProfiles() {
  console.log('\n🎓 Syncing educator_profiles...');
  const rows = await fetchTable('educator_profiles');
  console.log(`  Fetched ${rows.length} educator profiles.`);

  for (const ep of rows) {
    await prisma.educatorProfile.upsert({
      where: { userId: ep.user_id },
      update: {
        displayName:   ep.display_name ?? null,
        bankName:      ep.bank_name ?? null,
        accountNumber: ep.account_number ?? null,
        accountName:   ep.account_name ?? null,
      },
      create: {
        userId:        ep.user_id,
        displayName:   ep.display_name ?? null,
        bankName:      ep.bank_name ?? null,
        accountNumber: ep.account_number ?? null,
        accountName:   ep.account_name ?? null,
      },
    });
    console.log(`  ✓ ${ep.user_id}`);
  }
}

async function syncCourseMaterials() {
  console.log('\n📎 Syncing course_materials...');
  const rows = await fetchTable('course_materials');
  console.log(`  Fetched ${rows.length} materials.`);

  for (const m of rows) {
    await prisma.courseMaterial.upsert({
      where: { id: m.id },
      update: {
        courseId:    m.course_id,
        title:       m.title ?? 'Untitled',
        description: m.description ?? null,
        fileUrl:     m.file_url ?? null,
        fileType:    m.file_type ?? null,
        sortOrder:   m.sort_order ?? 0,
      },
      create: {
        id:          m.id,
        courseId:    m.course_id,
        title:       m.title ?? 'Untitled',
        description: m.description ?? null,
        fileUrl:     m.file_url ?? null,
        fileType:    m.file_type ?? null,
        sortOrder:   m.sort_order ?? 0,
      },
    });
    console.log(`  ✓ ${m.title}`);
  }
}

async function syncEnrollments() {
  console.log('\n📋 Syncing enrollments...');
  const rows = await fetchTable('enrollments');
  console.log(`  Fetched ${rows.length} enrollments.`);

  for (const e of rows) {
    const user = await prisma.user.findUnique({ where: { id: e.user_id } });
    const course = await prisma.course.findUnique({ where: { id: e.course_id } });
    if (!user || !course) {
      console.warn(`  ⚠ Skipping enrollment — user or course not found locally.`);
      continue;
    }

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: e.user_id, courseId: e.course_id } },
      update: {
        progressPct:     e.progress_pct ?? 0,
        completedAt:     e.completed_at ? new Date(e.completed_at) : null,
        paymentStatus:   e.payment_status ?? 'unpaid',
        paymentProofUrl: e.payment_proof_url ?? null,
      },
      create: {
        userId:          e.user_id,
        courseId:        e.course_id,
        progressPct:     e.progress_pct ?? 0,
        startedAt:       e.started_at ? new Date(e.started_at) : new Date(),
        completedAt:     e.completed_at ? new Date(e.completed_at) : null,
        paymentStatus:   e.payment_status ?? 'unpaid',
        paymentProofUrl: e.payment_proof_url ?? null,
      },
    });
    console.log(`  ✓ ${e.user_id} → ${e.course_id}`);
  }
}

async function main() {
  console.log('🔄 Starting Supabase → Local MySQL sync...');
  console.log(`   URL: ${SUPABASE_URL}`);

  try {
    await syncCourses();
    await syncModules();
    await syncProfiles();
    await syncEducatorProfiles();
    await syncCourseMaterials();
    await syncEnrollments();
    console.log('\n✅ Sync complete!');
  } catch (err) {
    console.error('\n❌ Sync failed:', err);
    process.exit(1);
  }
}

main().finally(() => prisma.$disconnect());

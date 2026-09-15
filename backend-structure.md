# Backend Architecture — Node.js (Course Platform API)

## Stack

- **Framework**: NestJS (TypeScript) — chosen over raw Express for built-in module structure, DI, and validation pipes, which pays off once you add the forum, chatbot, admin, and analytics modules
- **Database**: MySQL via Prisma ORM
- **Auth**: Passport.js strategies (Google OAuth, local) + JWT sessions
- **Storage**: S3-compatible client (AWS SDK v3, works with DigitalOcean Spaces or AWS S3)
- **Validation**: class-validator / class-transformer (native to Nest)
- **Background jobs**: BullMQ + Redis (progress recalculation, email sending, nightly analytics refresh, future embedding generation for chatbot)
- **Email**: Resend / SES for transactional (verification, password reset)
- **Product analytics**: PostHog (`posthog-node` for server-fired events)

**Everything below lives in one repo, one deploy, one database — no third-party CMS, no separate analytics service to run yourself.**

## Directory Structure

```
backend/
├── src/
│   ├── main.ts                        # App bootstrap
│   ├── app.module.ts                  # Root module, imports all feature modules
│   │
│   ├── config/
│   │   ├── configuration.ts           # Env var loading/validation
│   │   └── database.config.ts
│   │
│   ├── common/
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts         # admin vs learner
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform-response.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts     # /auth/login, /register, /google, /refresh
│   │   │   ├── auth.service.ts        # also fires PostHog user_signed_up / user_logged_in
│   │   │   ├── strategies/
│   │   │   │   ├── google.strategy.ts
│   │   │   │   ├── local.strategy.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       └── login.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts    # /users/me, /users/:id/profile
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       └── update-profile.dto.ts  # gender, birth year, nationality, employment, persona
│   │   │
│   │   ├── courses/
│   │   │   ├── courses.module.ts
│   │   │   ├── courses.controller.ts  # /courses, /courses/:persona, /courses/:persona/:slug
│   │   │   │                          # always filters status: "published"
│   │   │   ├── courses.service.ts
│   │   │   └── dto/
│   │   │       └── query-courses.dto.ts   # filters: persona, category
│   │   │
│   │   ├── modules-content/            # named to avoid clashing with Nest "module" term
│   │   │   ├── modules.module.ts
│   │   │   ├── modules.controller.ts  # /courses/:courseId/modules/:moduleId
│   │   │   ├── modules.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── enrollments/
│   │   │   ├── enrollments.module.ts
│   │   │   ├── enrollments.controller.ts  # /enrollments, /enrollments/:id/progress
│   │   │   ├── enrollments.service.ts     # fires course_started/module_completed/course_completed
│   │   │   └── dto/
│   │   │
│   │   ├── admin/                      # Self-built course authoring — no third-party CMS
│   │   │   ├── admin.module.ts
│   │   │   ├── admin-courses.controller.ts   # CRUD for courses/modules, draft/publish, reorder
│   │   │   ├── admin-courses.service.ts
│   │   │   ├── admin-uploads.controller.ts   # POST /admin/uploads/presign
│   │   │   ├── admin-uploads.service.ts      # Generates short-lived S3 presigned PUT URLs
│   │   │   ├── admin-users.controller.ts     # GET /admin/users (search/filter, view progress)
│   │   │   └── dto/
│   │   │       ├── create-course.dto.ts
│   │   │       ├── create-module.dto.ts
│   │   │       ├── reorder-modules.dto.ts
│   │   │       └── presign-upload.dto.ts
│   │   │
│   │   ├── analytics/                  # Platform-specific aggregate metrics (not PostHog's job)
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts # GET /admin/analytics/overview, /courses/:id
│   │   │   ├── analytics-queries.service.ts   # Aggregate SQL / reads snapshot tables
│   │   │   └── analytics.processor.ts  # BullMQ job: refreshes snapshot tables nightly
│   │   │
│   │   ├── forum/                      # Phase 2
│   │   │   ├── forum.module.ts
│   │   │   ├── forum.controller.ts
│   │   │   └── forum.service.ts
│   │   │
│   │   ├── chat/                       # Phase 3 — AI chatbot
│   │   │   ├── chat.module.ts
│   │   │   ├── chat.controller.ts     # POST /chat
│   │   │   ├── chat.service.ts        # RAG orchestration, fires chatbot_message_sent
│   │   │   ├── embeddings.service.ts  # generates/stores embeddings on course publish
│   │   │   └── dto/
│   │   │
│   │   └── i18n/                       # Phase 4 — translation content management
│   │       ├── i18n.module.ts
│   │       ├── i18n.controller.ts
│   │       └── i18n.service.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── jobs/
│   │   ├── queue.module.ts
│   │   └── processors/
│   │       ├── progress-recalc.processor.ts
│   │       ├── email.processor.ts
│   │       └── analytics-refresh.processor.ts   # Nightly refresh of snapshot tables
│   │
│   └── integrations/
│       ├── posthog.client.ts          # Server-side PostHog client (posthog-node), fire-and-forget
│       └── s3.client.ts               # Shared S3-compatible client for presigned URLs
│
├── test/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## Core Prisma schema (simplified)

```prisma
model User {
  id               String   @id @default(uuid())
  email            String   @unique
  passwordHash     String?
  authProvider     String   // "google" | "local"
  role             String   @default("learner")  // "learner" | "admin"
  gender           String?
  birthYear        Int?
  nationality      String?
  employmentStatus String?
  persona          String   // Youth | Parents | Educators | MasterTrainers
  enrollments      Enrollment[]
  createdAt        DateTime @default(now())
}

model Course {
  id          String   @id @default(uuid())
  slug        String
  persona     String
  title       String
  category    String
  description String
  status      String   @default("draft")  // "draft" | "published"
  modules     Module[]
  enrollments Enrollment[]

  @@unique([persona, slug])
}

model Module {
  id          String   @id @default(uuid())
  courseId    String
  title       String
  order       Int
  contentType String   // video | text | quiz
  contentUrl  String?
  contentBody String?
  course      Course   @relation(fields: [courseId], references: [id])
}

model Enrollment {
  id                 String    @id @default(uuid())
  userId             String
  courseId           String
  progressPct        Int       @default(0)
  completedModuleIds String[]  @default([])
  startedAt          DateTime  @default(now())  // used for avg. time-to-complete
  completedAt        DateTime?
  user               User      @relation(fields: [userId], references: [id])
  course             Course    @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
}

// Denormalized, refreshed nightly by analytics.processor.ts.
// Powers /admin/analytics/* without hammering the live enrollment table.
model CourseAnalyticsSnapshot {
  id                   String   @id @default(uuid())
  courseId             String   @unique
  totalLearners        Int
  completionRate       Float    // completedCount / totalLearners
  avgTimeToCompleteHrs Float?
  refreshedAt          DateTime @default(now())
}

model PlatformAnalyticsSnapshot {
  id                 String   @id @default(uuid())
  totalBeneficiaries Int
  newSignupsLast30d  Int
  personaBreakdown   Json     // { "Youth": 1200, "Parents": 340, ... }
  refreshedAt        DateTime @default(now())
}
```

## Course upload flow (self-built admin, one repo)

No Strapi/Sanity, no separate CMS service — the `admin` module below is the entire authoring system, and it's just more NestJS routes in this same app.

1. `POST /admin/courses` — creates a `Course` row with `status: "draft"`. Gated to `role: "admin"` via `roles.guard.ts`.
2. `POST /admin/uploads/presign` — takes a filename + content type, returns a short-lived signed S3 PUT URL from `integrations/s3.client.ts`. The frontend uploads the file **directly to object storage**, bypassing the Node server entirely — keeps the API stateless and avoids streaming large video files through it.
3. `POST /admin/courses/:id/modules` — creates a `Module` row referencing the now-uploaded object's URL.
4. `PATCH /admin/courses/:id/modules/reorder` — bulk-updates `order` on modules from the frontend's drag-and-drop UI.
5. `PATCH /admin/courses/:id/publish` — flips `status` to `"published"`, making it visible on the public `/courses` endpoints (which always filter on `status: "published"`).

No transcoding pipeline in v1. If video file size/format becomes a problem later, add a job under `jobs/processors/` that calls Mux or Cloudflare Stream's API right after upload and updates the module's `contentUrl` once transcoding finishes — this slots in without changing the authoring flow above.

## Analytics — two layers, two owners

Deliberately not merged into one system, so nothing ever has to reconcile "PostHog's number" against "our number":

### Layer 1 — PostHog (engagement analytics)

Handles anything behavioral: **MAU/DAU, retention curves, funnels (signup → first course → completion), persona-based cohorts.** You do not build any of this — you view it directly in PostHog's own dashboard (self-hosted via Docker, or PostHog Cloud's free tier).

The backend's only job is making sure the events that matter can't be silently dropped:
- `auth.service.ts` fires `user_signed_up`, `user_logged_in` server-side via `integrations/posthog.client.ts` — these are the events you most care about not losing to an ad-blocker, so they're sent from the backend rather than relying only on the frontend.
- `enrollments.service.ts` fires `course_started`, `module_completed`, `course_completed` when progress updates.
- `chat.service.ts` (Phase 3) will fire `chatbot_message_sent`.
- All events are sent fire-and-forget (non-blocking) so PostHog latency or downtime never affects your actual API response times.
- Every event payload includes `persona` and `courseId`/`moduleId` where relevant, so cohorts can be sliced by audience segment inside PostHog without any extra backend work later.
- Less critical, purely-UI events (`course_card_clicked`, `video_played`) are fired directly from the frontend instead — no need to round-trip through the backend for those.

### Layer 2 — Custom `analytics` module (business/content metrics)

Handles numbers that require joining against your own course/enrollment data — things a generic analytics tool has no way to know:

- `GET /admin/analytics/overview` — total learners, total beneficiaries (the homepage-counter style stat from the reference site), persona breakdown, count of published courses.
- `GET /admin/analytics/courses/:id` — per-course completion rate, average time-to-complete (`completedAt - startedAt`), and module-level drop-off (which module has the highest abandonment — useful for spotting weak content).
- **Implementation**: `analytics-queries.service.ts` runs aggregate SQL (Prisma `groupBy` / raw queries) against `Enrollment`/`Module`. Rather than compute this live on every dashboard load, `analytics.processor.ts` — a nightly BullMQ job — recalculates the numbers and writes them into `CourseAnalyticsSnapshot` / `PlatformAnalyticsSnapshot`. The controller just reads these snapshot tables: fast reads, and you avoid expensive aggregate queries hitting your primary tables during business hours.
- If you want a near-real-time public "Total Beneficiaries" counter on the homepage (rather than only inside `/admin`), that can be its own lightweight cached count with a short TTL (Redis, 5–10 min) instead of waiting for the nightly snapshot.

**Defining "Active Users per Month" once, clearly:** e.g. "distinct users with ≥1 login or module-completion event in the trailing 30 days." Once defined, you can get this from PostHog directly (it computes this natively from the events above) rather than duplicating the logic in your own SQL — one more reason to keep the two layers separate rather than trying to make your own DB replicate what PostHog already does well.

## Key architectural decisions

1. **NestJS module-per-feature** mirrors the frontend's route grouping — `courses`, `enrollments`, `users`, `auth`, `admin`, `analytics` are independently testable and independently deployable later if you ever need to split into microservices (unlikely at this scale, but the boundary is free with Nest).
2. **`modules-content` is deliberately separate from `courses`** — course metadata (catalog, filtering) and module content (video/text/quiz payloads) have very different read patterns and caching needs.
3. **Progress tracking is denormalized** (`progressPct`, `completedModuleIds` on `Enrollment`) rather than computed on every read — recalculated via a BullMQ job whenever a module is marked complete, keeping the dashboard endpoint fast.
4. **Course authoring is a self-built module (`admin`) in this same repo**, not a third-party CMS — no extra service to run or pay for, and course/module data lives directly in the same MySQL database and Prisma schema as everything else, with no sync job needed between systems.
5. **`chat` and `i18n` modules exist as stubs in the structure now** even though you're deferring them — Phase 3/4 becomes additive (new module folder + route registration) rather than a refactor of `courses`/`modules-content`.
6. **S3-compatible storage from day one** (not local disk) — course videos/images go straight to object storage via presigned uploads, matching what the reference platform does with DigitalOcean Spaces.
7. **Analytics is deliberately split into two owners** — PostHog for behavioral/engagement data (MAU, funnels, retention), your own MySQL for content/business metrics (completion rates, beneficiary counts) — avoids building a custom event pipeline while still getting the platform-specific numbers PostHog has no way to compute.
8. **Analytics reads hit denormalized snapshot tables, not live aggregate queries** — a nightly job does the expensive computation once; the `/admin/analytics/*` endpoints just read pre-computed rows, keeping the admin dashboard fast regardless of how large `Enrollment` grows.

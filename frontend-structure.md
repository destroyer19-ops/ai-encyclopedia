# Frontend Architecture — Next.js (Course Platform)

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State/data fetching**: React Server Components + `fetch` for server data, TanStack Query for client-side mutations/interactive state
- **Auth**: Auth.js (NextAuth) — Google OAuth + credentials provider
- **Forms**: React Hook Form + Zod validation
- **Video**: Mux Player / Cloudflare Stream embed component (or YouTube iframe for MVP)
- **Charts**: Recharts (admin analytics dashboard)
- **Product analytics**: PostHog (`posthog-js`)
- **i18n (Phase 4, structure only for now)**: next-intl

## Directory Structure

```
frontend/
├── app/
│   ├── (marketing)/                 # Public, unauthenticated pages
│   │   ├── page.tsx                 # Landing page (hero, features, testimonials)
│   │   ├── about/page.tsx
│   │   ├── help/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (auth)/                      # Auth flow pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── layout.tsx               # Minimal layout, no nav
│   │
│   ├── courses/
│   │   ├── page.tsx                 # Catalog, filterable by persona/category
│   │   ├── [persona]/
│   │   │   └── page.tsx             # e.g. /courses/youth
│   │   └── [persona]/[slug]/
│   │       ├── page.tsx             # Course detail page
│   │       └── module/[moduleId]/
│   │           └── page.tsx         # Module player (video/text/quiz)
│   │
│   ├── dashboard/                   # Authenticated learner area
│   │   ├── page.tsx                 # "Continue learning", progress overview
│   │   ├── profile/page.tsx
│   │   └── layout.tsx               # Requires session
│   │
│   ├── forum/                       # Phase 2 — likely just an embed wrapper
│   │   └── page.tsx
│   │
│   ├── admin/                       # Self-built internal admin (role-gated), same app/repo
│   │   ├── layout.tsx               # Checks session.user.role === "admin"
│   │   ├── page.tsx                 # Admin home: quick stats, recent activity
│   │   ├── courses/
│   │   │   ├── page.tsx             # List all courses (draft/published), create button
│   │   │   ├── new/page.tsx         # Create course form
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Edit course metadata, publish/unpublish toggle
│   │   │       └── modules/
│   │   │           ├── page.tsx     # Reorderable module list for this course
│   │   │           ├── new/page.tsx # Add module (video/text/quiz)
│   │   │           └── [moduleId]/page.tsx  # Edit module + upload media
│   │   ├── users/
│   │   │   └── page.tsx             # Search/filter users, view profile + progress
│   │   └── analytics/
│   │       ├── page.tsx             # Overview: total learners, signups, completions
│   │       ├── courses/page.tsx     # Per-course completion rate, avg time-to-complete
│   │       └── personas/page.tsx    # Breakdown by Youth/Parents/Educators/Master Trainers
│   │
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   │
│   ├── layout.tsx                   # Root layout (nav, footer, providers, PostHog init)
│   ├── globals.css
│   └── middleware.ts                # Route protection (/dashboard, /admin), locale detection later
│
├── components/
│   ├── ui/                          # Reusable primitives (Button, Card, Input, Modal)
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── CourseFilterBar.tsx
│   │   ├── ModulePlayer.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PersonaTabs.tsx          # Youth / Parents / Educators / Master Trainers
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProfileOnboardingForm.tsx # gender, birth year, nationality, employment
│   ├── testimonials/
│   │   └── TestimonialCarousel.tsx
│   └── admin/
│       ├── CourseForm.tsx           # Create/edit course metadata (title, slug, persona, category)
│       ├── ModuleForm.tsx           # Create/edit module (content type switch: video/text/quiz)
│       ├── MediaUploader.tsx        # Requests presigned S3 URL, PUTs file directly to storage
│       ├── ModuleReorderList.tsx    # Drag-to-reorder modules within a course
│       ├── AnalyticsCard.tsx        # Single stat card (total learners, completion %, etc.)
│       └── AnalyticsChart.tsx       # Recharts wrapper for trend lines (signups/week, etc.)
│
├── lib/
│   ├── api-client.ts                # Typed fetch wrapper for backend API
│   ├── auth.ts                      # Auth.js config
│   ├── upload.ts                    # Requests presigned URL from backend, PUTs file to S3 directly
│   ├── analytics/
│   │   ├── posthog-client.ts        # posthog-js init + typed capture() wrapper
│   │   └── events.ts                # Shared event name constants (mirrors backend's events.ts)
│   ├── validators/                  # Zod schemas (registration, login, profile, course, module)
│   └── utils.ts
│
├── hooks/
│   ├── useEnrollment.ts
│   ├── useProgress.ts
│   ├── useCourseCatalog.ts
│   └── useAdminAnalytics.ts         # Fetches backend analytics endpoints for AnalyticsCard/Chart
│
├── types/
│   ├── course.ts
│   ├── user.ts
│   └── api.ts                       # Shared response types (mirror backend DTOs)
│
├── public/
│   └── assets/
│
├── messages/                        # Phase 4 — i18n JSON dictionaries
│   └── en.json
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Course upload flow (self-built admin, same repo)

No third-party CMS — the whole thing lives at `/admin/*` in this same Next.js app, gated by `middleware.ts` checking `session.user.role === "admin"`.

1. Admin fills out `CourseForm` (title, slug, persona, category, description) → `POST /admin/courses` on the backend. New courses default to `status: "draft"`.
2. Inside the course, admin adds modules via `ModuleForm`. For video/image content, `MediaUploader` calls `POST /admin/uploads/presign` on the backend, which returns a short-lived signed S3/Spaces PUT URL; the browser uploads the file **directly to object storage** (never proxied through your Node server), then the returned object URL is saved on the module record.
3. `ModuleReorderList` lets admins drag modules into the right order; persists via `PATCH /admin/courses/:id/modules/reorder`.
4. When ready, the admin flips the course from `draft` → `published` on the course edit page — only published courses appear in the public catalog (`GET /courses` filters on status server-side).

Trade-off worth naming: you own the upload UI and its edge cases (large file handling, video transcoding if you ever need it). Transcoding can be added later as a background job that calls Mux/Cloudflare Stream's API right after upload, without changing the authoring flow.

## Analytics integration (frontend side)

Two data sources feed the `/admin/analytics/*` pages:

### 1. PostHog (engagement analytics — MAU/DAU, retention, funnels)

- `posthog-js` initialized once in the root `layout.tsx`, using the project API key from env vars.
- Auto-captures pageviews. Custom events fired from existing user actions — no new UI required:
  - `signup`, `login` — fired on auth form success
  - `course_started` — fired when a module player first loads for a given enrollment
  - `module_completed`, `course_completed` — fired from `useProgress.ts` on progress updates
  - `chatbot_opened` (Phase 3)
- `posthog.identify(userId, { persona, nationality, ... })` fires right after login/registration so every event is tied to a known user and segmentable by persona inside PostHog's own dashboard.
- MAU/DAU, retention curves, and funnels (signup → first course → completion) are viewed **directly in PostHog** — no custom chart needed for these. `admin/analytics/page.tsx` can either link out to a shared PostHog dashboard or embed a shared insight via iframe if you want it inside your own admin shell.

### 2. Custom aggregate endpoints (platform-specific numbers PostHog can't compute)

- `useAdminAnalytics.ts` calls the backend's `analytics` module (see backend doc) for: total learners/"beneficiaries" counter, per-course completion rate, avg. time-to-complete, persona breakdown.
- Rendered via `AnalyticsCard` (single numbers) and `AnalyticsChart` (trend lines, e.g. signups per week) using Recharts.
- This is the "Total Beneficiaries" style counter from the reference site — a cached aggregate query against your own enrollment data, not something a generic analytics tool tracks natively.

## Key architectural decisions

1. **App Router + Server Components by default.** Course catalog and detail pages are server-rendered for SEO (public course platform → discoverability matters). Only interactive pieces (module player controls, forms, progress updates) are client components.
2. **Route groups** `(marketing)` and `(auth)` keep layout concerns separate without affecting the URL structure.
3. **`middleware.ts`** handles auth-gating for `/dashboard/*` and `/admin/*`, and will later handle locale routing (`/id-ID/*`, `/th-TH/*`, etc.) without restructuring the app directory.
4. **`lib/api-client.ts`** is the single boundary between frontend and backend — all backend calls go through it, making it easy to swap in mocking for tests or add auth token injection in one place.
5. **Persona segmentation is a URL param, not a separate app** — `/courses/[persona]/[slug]` — mirrors how the reference site structures the same course content differently per audience.
6. **Admin lives in the same repo/app as the learner-facing site**, gated by role, not split into a separate CMS or codebase — keeps everything in one deploy, one auth system, one database.
7. **Chatbot (Phase 3)** will live as a floating `components/chatbot/ChatWidget.tsx` client component + `app/api/chat/route.ts` proxy to the backend RAG endpoint — kept isolated so it can be added without touching existing routes.
8. **PostHog handles engagement analytics; a small internal dashboard handles business metrics** — avoids building a custom event/charting pipeline for MAU-style numbers, while still surfacing platform-specific stats (completion rates, beneficiary counts) that only your own data model knows about.

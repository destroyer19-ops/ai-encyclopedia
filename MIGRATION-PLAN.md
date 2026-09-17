# Phase 1 Migration Plan: AI Encyclopedia Hub

## 1. Existing System Analysis

### Frontend (Lovable / `ai-encyclopedia-hub`)
The frontend is a React Router SPA currently tightly coupled with Supabase for the following functionalities:
- **Authentication**: `supabase.auth` is used to protect the `/admin` route (for content editors).
- **Courses & Trainings Catalog**: Fetched from Supabase `courses` and `trainings` tables via `useCourseRows` and `useTrainings` in `cms.ts`.
- **Site Content / CMS**: Fetched from `site_content` table.
- **Storage**: Media served from Supabase storage bucket `site-images`.
- Currently, **there is no user registration/login** on the frontend for *learners* — it's just an admin auth.

### Backend (`backend` directory, NestJS)
The new backend already has a robust architecture:
- **Auth Module**: Implemented with JWT and local/Google strategies (`/auth/login`, `/auth/register`).
- **Users Module**: Manages learner profiles (gender, persona, etc.).
- **Courses Module**: Handles retrieving published courses (`/courses`).
- **Enrollments Module**: Manages tracking user enrollments and progress (`/enrollments`, `/enrollments/:courseId/progress`).
- **Admin Module**: Manages course uploading, publishing, S3 storage presigned URLs, and analytics.
- **Database (Prisma + MySQL)**: Has `User`, `Course`, `Module`, `Enrollment`, `ModuleCompletion` tables.

## 2. Backend Changes Made (Phase 1)

### Prisma Schema
- Added `paymentStatus` (string: 'unpaid' | 'under_review' | 'approved' | 'rejected') to `Enrollment`.
- Added `paymentProofUrl` (string) to `Enrollment`.

### New Endpoints Added
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/enrollments/payment-proof/presign` | Returns a pre-signed S3 URL for direct image upload |
| POST | `/enrollments/:courseId/payment-proof` | Marks enrollment as `under_review` after upload |
| GET | `/admin/enrollments/payments/pending` | Lists all `under_review` enrollments for admin review |
| PATCH | `/admin/enrollments/:id/payment-status` | Admin approve or reject a payment |

### Data Migration
- Ran `scripts/migrate-courses.ts` to copy all courses from Supabase → MySQL.
- Images remain in Supabase Storage (referenced by URL) — will be moved to S3 in a later phase.

## 3. Frontend Implementation Plan (Phase 1)

### Step 1 — API Client (`lib/api-client.ts`)
- Centralised typed fetch wrapper pointing at the Node.js backend (`VITE_API_URL`).
- Stores JWT in `localStorage`, attaches it to every request.
- Exposes typed methods: `register`, `login`, `getCourses`, `getCourse`, `enroll`, `getMyEnrollments`, `presignPayment`, `submitPaymentProof`.

### Step 2 — Auth Store (`lib/auth-store.ts`)
- Lightweight Zustand (or localStorage) store for the JWT token and decoded user object.
- Methods: `login(token)`, `logout()`, `getUser()`, `isAuthenticated()`.

### Step 3 — Learner Auth Pages
- `/register` — Email + password form → calls `POST /auth/register` → stores JWT → redirects to `/courses`.
- `/login` — Email + password form → calls `POST /auth/login` → stores JWT → redirects to `/dashboard`.

### Step 4 — Course Catalog from Backend
- Replace `useCourseRows()` (Supabase) with `useQuery` → `GET /courses` on new backend.
- Fallback to static data if API is unreachable.

### Step 5 — Course Detail & Enrollment UI
- "Enroll Now" button → calls `POST /enrollments/:courseId`.
- If enrolled + unpaid → show payment instructions + file picker (PNG/JPG).
- File upload flow: presign → PUT to S3 → `POST /enrollments/:courseId/payment-proof`.
- If `under_review` → show "Payment Under Review" badge.
- If `approved` → show "Access Granted".

### Step 6 — Admin Payment Approval UI
- New tab in Admin dashboard: "Pending Payments".
- Lists all `under_review` enrollments with user name, email, course, proof image, date.
- Approve / Reject buttons → `PATCH /admin/enrollments/:id/payment-status`.

### Step 7 — Approval Email
- On approval, backend sends confirmation email to the learner.
- Uses the existing email integration (Resend/SES) in the backend.

## 4. Supabase Phase-Out Status

| Feature | Status |
|---------|--------|
| Learner Auth | ✅ Moved to backend |
| Course Catalog | ✅ Data migrated to MySQL |
| Enrollment & Payment | ✅ New backend endpoints |
| Site Content / CMS | ⏳ Remains on Supabase (Phase 2) |
| Admin CMS Auth | ⏳ Remains on Supabase (Phase 2) |
| Trainings / Events | ⏳ Remains on Supabase (Phase 2) |
| Site Images | ⏳ Remains in Supabase Storage (Phase 2) |

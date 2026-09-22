# Frontend-Backend Audit Report: Admin & Educator Functionality

## 1. Frontend Expectations vs Backend Reality

The frontend application uses a hybrid data-fetching approach. For some read-heavy operations, it calls the NestJS REST API via `apiFetch`. For many critical write operations (course authoring, educator applications, payouts), it bypasses the REST API entirely and hits the database directly using the **Supabase client** (both client-side PostgREST and server-side `supabaseAdmin` via `@tanstack/react-start` server functions).

Because the frontend is hardcoded to interact with specific snake_case tables and columns via Supabase, the **Prisma schema must precisely match these expectations** (using `@map` where necessary) to ensure the frontend works without modifications.

### Operations Matrix

| Operation | Frontend Mechanism | Expected Data Shape / Table | Existing Backend Support | Missing / Disconnects |
| :--- | :--- | :--- | :--- | :--- |
| **Admin: View Dashboard** | `apiFetch("/admin/overview")` | JSON with user/course stats | `GET /admin/overview` | Partial. Financial stats and payouts are mocked. |
| **Admin: List Courses** | `apiFetch("/admin/courses")` | Array of `AdminCourse` | `GET /admin/courses` | Ownership/educator data, revenues, and categories are missing or mocked. |
| **Admin: Manage Courses** | `apiFetch("/admin/courses/:id", PUT/PATCH/DELETE)` | `{ status, isPublished, featured, category }` | `PUT/PATCH/DELETE /admin/courses/:id` | `featured` and `category` fields not fully supported. |
| **Admin: View Enrollments** | `apiFetch("/admin/enrollments")` | Array of enrollments | `GET /admin/enrollments` | (Exists) |
| **Admin: Users & Roles** | `apiFetch("/admin/users")` | Array of users | `GET /admin/users` | (Exists) Role management expects a `user_roles` table via RPC. |
| **Educator: Applications** | Server Fn (`submitEducatorApplication`) | `educator_applications` table | None | Entirely missing from Prisma schema. |
| **Educator: Create/Edit Course** | Direct Supabase (`supabase.from("courses").insert()`) | `courses` table (snake_case fields) | `Course` Prisma model exists | Misses 10+ frontend fields (`educator_id`, `course_level`, `pass_mark`, etc.). Needs `@map` to snake_case. |
| **Educator: Manage Modules** | Direct Supabase (`supabase.from("modules").insert()`) | `modules` table (snake_case fields) | `Module` Prisma model exists | Misses `file_url`, `video_url`, expects snake_case `sort_order`, `content_type`. |
| **Educator: Materials/Announce.** | Direct Supabase (`course_materials`, `course_announcements`) | `course_materials` / `course_announcements` tables | None | Tables do not exist in Prisma schema. |
| **Educator: Ledgers & Payouts** | Server Fn (`requestPayout`) | `payout_requests`, `ledger_entries`, `educator_profiles` tables | None | Financial/Payout models do not exist in Prisma schema. |

---

## 2. Prisma Schema & Authorization Audit

### Current Role/Auth Implementation
- **Prisma:** The `User` model has a simple `role String @default("learner") // "learner" \| "admin"`.
- **Frontend Expectation:** The frontend relies on a `user_roles` table and an RPC function `has_role(user_id, role)` to check for the `"educator"` role. When an application is approved, the frontend inserts directly into `user_roles`.
- **Conclusion:** The simple string `role` field on `User` is insufficient. The backend must introduce a `user_roles` table to store multiple roles per user.

### Current Course & Module Schema
- **Missing Course Ownership:** The `Course` model has no relation to an author/educator. The frontend explicitly writes `educator_id`, `author_name`, and `author_avatar_url`.
- **Missing Configuration Fields:** The frontend inserts UI state like `course_level` (beginner/intermediate), `delivery` (online/hybrid), `duration_hours`, `pass_mark`, `require_assessment`, `sequential_modules`, and `rejection_reason`.
- **Naming Mismatches:** Prisma uses camelCase (`courseId`, `imageUrl`) while PostgREST queries expect snake_case (`course_id`, `image_url`). Without Prisma `@map` directives, these direct Supabase queries will fail entirely.

---

## 3. Minimum Proposed Backend Changes

To support the frontend exactly as it is (without altering its direct Supabase queries or `apiFetch` shapes), the following minimal backend adjustments are required:

### 1. Database Schema Updates (Prisma)
Add the following missing models to `schema.prisma`:
- `EducatorProfile` (mapped to `educator_profiles`): `user_id`, `display_name`, bank details.
- `EducatorApplication` (mapped to `educator_applications`): `user_id`, `status`, `nin`, `cv_url`.
- `UserRole` (mapped to `user_roles`): `user_id`, `role`.
- `CourseMaterial` (mapped to `course_materials`): `course_id`, `title`, `file_url`, `file_type`, `sort_order`.
- `CourseAnnouncement` (mapped to `course_announcements`): `course_id`, `educator_id`, `title`, `body`.
- `PayoutRequest` (mapped to `payout_requests`): `educator_id`, `amount_kobo`, `status`, etc.
- `LedgerEntry` (mapped to `ledger_entries`): `educator_id`, `course_id`, `amount_kobo`, etc.
- `AuditLog` (mapped to `audit_log`): actor, action, entity details.

### 2. Augment Existing Prisma Models
**Course Model:**
Add the missing fields and map all existing/new fields to snake_case using `@map`:
- `@map("educator_id") educatorId String?`
- `@map("author_name") authorName String?`
- `@map("course_level") courseLevel String?`
- `@map("duration_hours") durationHours Int?`
- `@map("pass_mark") passMark Int?`
- `@map("sequential_modules") sequentialModules Boolean?`
- `@map("require_assessment") requireAssessment Boolean?`
- `@map("image_url") imageUrl String?`

**Module Model:**
- Rename `order` to `sortOrder` mapped to `sort_order`.
- Rename `duration` to `durationMinutes` mapped to `duration_minutes`.
- Add `videoUrl` (`@map("video_url")`) and `fileUrl` (`@map("file_url")`).
- Map existing fields to snake_case (`course_id`, `content_type`, etc.).

### 3. NestJS API Adjustments
- Update the **Course Listing (`GET /admin/courses`, `GET /courses`)** services in NestJS to include and return the newly added ownership/tier fields.
- Ensure any backend REST response payloads serialize keys appropriately to match the shapes expected by `apiFetch` in files like `catalog.ts` and `admin.functions.ts` (or rely on the frontend's mapping functions which already gracefully fallback).
- Add the required `has_role` PostgreSQL function via a raw SQL migration to support the frontend's RPC call.

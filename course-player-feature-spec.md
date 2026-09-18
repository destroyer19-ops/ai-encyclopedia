# Feature Specification: Course Content & Learner Player

## 1. Executive Summary
The goal of this feature is to complete the end-to-end learning lifecycle for AI Encyclovia. We will build a **Content Management Interface** for administrators to seamlessly upload and organize course materials (videos, text, resources) and a **World-Class Course Player** for learners to consume the content. 

The focus is on delivering a bug-free, highly performant, and secure experience that rivals top-tier e-learning platforms.

---

## 2. Infrastructure & Architecture

### Backend (NestJS API)
*   **Module CRUD Endpoints:** Implement secure endpoints (`POST`, `PUT`, `DELETE`) for admins to manage course modules.
*   **Progress Tracking:** Endpoints to record when a user completes a module and to fetch their overall progress.
*   **Security:** Module endpoints must enforce authorization. Only learners with an `approved` payment status for the specific course can fetch module data or video links.

### Storage & Delivery (AWS S3 & CloudFront)
*   **Direct-to-S3 Uploads:** Admins will upload large video files directly to S3 using Presigned PUT URLs (identical to the payment proof flow) to avoid crashing the Node.js backend.
*   **Secure Playback:** Course videos must **not** be public. The backend will generate short-lived **Presigned GET URLs** when a learner requests a module. This prevents users from sharing video links with unapproved individuals.
*   **CDN Delivery:** (Recommended) Place an AWS CloudFront distribution in front of the S3 bucket to ensure ultra-fast, buffer-free video streaming globally.

---

## 3. Database Schema (Prisma)
The database already has a strong foundation with the `Module` and `ModuleCompletion` models. We will leverage them and potentially add a few minor fields for a better UX:

```prisma
model Module {
  id          String   @id @default(uuid())
  courseId    String
  title       String
  order       Int
  contentType String   // "video" | "text" | "quiz"
  contentUrl  String?  // S3 Object Key for the video
  contentBody String?  @db.Text // Markdown/HTML for text lessons
  
  // Recommended Additions:
  duration    Int?     // Video length in seconds (for UX: "10 min read / 5 min video")
  isPublished Boolean  @default(true) // Allow drafting modules without showing learners
  
  course      Course   @relation(fields: [courseId], references: [id])
  completions ModuleCompletion[]
}
```

---

## 4. World-Class Learner UX & Best Practices

To ensure learners have the best possible experience, the frontend Course Player will implement the following:

*   **Responsive Layout:** A classic LMS layout featuring a collapsible sidebar with the module list on the left, and the video player / content area on the right.
*   **Smooth Video Streaming:** Ensure the S3 bucket supports `Accept-Ranges: bytes` so the browser's native `<video>` player can buffer and seek efficiently. 
*   **Auto-Advance & Resume:** 
    *   Automatically mark a module as complete when the video reaches 90%.
    *   Auto-play the next module.
    *   When a user returns to a course, automatically load their last watched module.
*   **Rich Text Support:** For `text` modules, use a clean typography layout (prose) rendering Markdown, supporting code blocks, images, and embedded links.
*   **Optimistic UI:** When a learner clicks "Mark as Complete", the UI should update instantly while the API request processes in the background.

---

## 5. Implementation Phases

### Phase 1: Backend API & Storage Preparation ✅ DONE
1.  ✅ Extended `ModuleServices` with full CRUD + completion tracking + secure presigned GET URLs
2.  ✅ Extended `ModuleController` with admin-only create/update/delete endpoints (JWT + RolesGuard)
3.  ✅ Added `generatePresignedGetUrl()` to `S3Service` for secure video streaming
4.  ✅ Updated Prisma schema — added `duration` and `isPublished` to `Module`
5.  ✅ Migration SQL saved at `backend/prisma/migrations/manual_add_module_duration_published.sql`

> **To apply:** Start MySQL, then run `npx prisma migrate dev` from the backend directory.

### Phase 2: Admin Content Builder ✅ DONE
1.  ✅ Added all module API functions to `api-client.ts` (types, CRUD, upload with progress, presign)
2.  ✅ Built `ModulesAdmin` component — video upload with progress bar, Markdown text editor, publish toggle, drag-grip ordering UI
3.  ✅ Wired `ModulesAdmin` into `CoursesAdmin` — appears inline when editing an existing course

### Phase 3: Learner Course Player ✅ DONE
1.  ✅ Created `/learn/$slug` route with enrollment + approval gate
2.  ✅ Sidebar navigation with per-module completion indicators and progress bar
3.  ✅ Video player that auto-marks complete at 90% watched
4.  ✅ Markdown text reader for text-type modules
5.  ✅ Optimistic "Mark as complete" button
6.  ✅ Previous / Next module navigation
7.  ✅ Auto-resume to first incomplete module
8.  ✅ Fixed dashboard "Start learning" button → `/learn/$slug`

---

## 6. Remaining Tasks

### Required before going live
- [ ] Run the Prisma migration against the production database
- [ ] Migrate admin dashboard auth from Supabase to new JWT (`admin.tsx`)
- [ ] Add `S3_PUBLIC_BASE_URL` to production `.env` if using CloudFront CDN

### Nice to have (next iteration)
- [ ] Drag-and-drop module reordering (replace the `order` number field)
- [ ] Quiz module type UI
- [ ] Email notification to learner when payment is approved
- [ ] Admin bulk-reorder API endpoint


# Supabase Migration Audit Report

Here is the audit of all Supabase usages across the frontend application. 

## Files Using Supabase Data / Storage / RPC

1. **`src/lib/educator.ts`**
   - **Functionality**: Supabase RPC calls (`educator_overview`, `educator_balance`, `educator_course_stats`) and direct table queries (`.from("courses")`, `.from("ledger_entries")`, `.from("payout_requests")`).
   - **Purpose**: Fetches financial and overview metrics, manages courses and payouts specifically for educators.

2. **`src/lib/admin.functions.ts`**
   - **Functionality**: Supabase RPC (`has_role`) and comprehensive table queries/mutations (for `audit_log`, `courses`, `quizzes`, `enrollments`, `profiles`, `user_roles`, `ledger_entries`, `payments`, `payout_requests`, `announcements`, `chat_logs`).
   - **Purpose**: A comprehensive admin dashboard API containing server actions for auditing, user management, course management, transactions, and site communications.

3. **`src/lib/catalog.ts`**
   - **Functionality**: Table queries (`.from("categories")`, `.from("courses")`, `.from("course_prices")`) and RPC calls (`course_outline`, `search_course_ids`).
   - **Purpose**: Serves public and personalized course catalog queries, outlines, and search functionalities.

4. **`src/routes/_authenticated/settings.tsx`**
   - **Functionality**: Table update (`.from("profiles").update`)
   - **Purpose**: Updates the logged-in user's profile information.

5. **`src/routes/_authenticated/dashboard.tsx`**
   - **Functionality**: Table queries (`.from("payments")`)
   - **Purpose**: Fetches user-specific payments/transactions data for their dashboard.

6. **`src/routes/contact.tsx`**
   - **Functionality**: Table inserts (`.from("contact_messages").insert`)
   - **Purpose**: Stores contact form submissions in the database.

7. **`src/routes/sitemap[.]xml.ts`**
   - **Functionality**: Server-side client creation (`createClient`) and table query (`.from("courses")`)
   - **Purpose**: Generates the SEO sitemap dynamically based on available courses.

8. **`src/routes/api/public/paystack-webhook.ts`**
   - **Functionality**: Uses `supabaseAdmin` client to query/update (`.from("payments")`)
   - **Purpose**: Handles payment webhook validation and records successful transactions.

9. **`src/routes/api/public/media.$.ts`**
   - **Functionality**: Storage calls (`supabase.storage.from("site-images").download`)
   - **Purpose**: Serves images directly from Supabase object storage.

## Files Using Supabase Authentication

1. **`src/routes/auth.tsx`**
   - **Functionality**: `supabase.auth.getSession`, `supabase.auth.resetPasswordForEmail`, `supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.signOut`
   - **Purpose**: The main authentication page for login, registration, and starting the password reset process. (Also relies on `lovable.auth.signInWithOAuth`).

2. **`src/routes/reset-password.tsx`**
   - **Functionality**: `supabase.auth.onAuthStateChange`, `supabase.auth.getSession`, `supabase.auth.updateUser`
   - **Purpose**: Finalizes password reset when redirected from email.

## Locations Gated by Authentication or Role

1. **`src/routes/_authenticated/route.tsx`** (Protected Layout)
   - Checks `supabase.auth.getUser()` before load.
   - Redirects to `/auth` if no valid user is returned.
   - **Gate**: Restricts access to all child routes (e.g., dashboard, settings, admin).

2. **`src/routes/_authenticated/admin.tsx`** (Admin Layout/Page)
   - Checks `supabase.rpc("has_role", ...)` to ensure the user has the "admin" role.
   - **Gate**: Renders admin interfaces only if the user holds admin permissions.

3. **`src/lib/admin.functions.ts`** (Admin Server Functions)
   - Employs an `assertAdmin(context)` utility which queries `has_role`.
   - **Gate**: Ensures all admin-level API queries strictly reject unauthorized invocations.

---

I will wait for your approval on this audit before proceeding to Step 2 (Replacing Authentication).

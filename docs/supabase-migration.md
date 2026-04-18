# Supabase Migration Guide

This project expects Supabase credentials to be provided only through environment variables.

## Required environment variables

Set these in your local `.env.local` and in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Shared client setup

The repository now uses these shared helpers:

- `lib/supabase/config.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`

Do not hardcode Supabase URLs or keys elsewhere in the repo.

## Required storage buckets

Create these buckets in the new Supabase project before testing uploads:

- `documents`
- `media`
- `cms`

## Tables referenced by the application

The app queries or writes these tables directly:

- `audit_logs`
- `cities`
- `cms_content`
- `contact_messages`
- `coupons`
- `departments`
- `ecard_members`
- `franchise_partners`
- `franchises`
- `invoices`
- `notifications`
- `partner_commissions`
- `payments`
- `phr_categories`
- `phr_documents`
- `plan_categories`
- `plans`
- `profiles`
- `reimbursement_claims`
- `request_messages`
- `service_requests`
- `system_settings`
- `wallet_transactions`
- `wallets`
- `withdrawal_requests`

Additional SQL artifacts in this repo create or reference:

- `activity_logs`
- `commissions`
- `faqs`
- `homepage_sections`
- `media`
- `media_folders`
- `pages`
- `partners`
- `payment_transactions`
- `support_replies`
- `support_tickets`

## SQL files and scripts to review

- `sql/missing_tables.sql`
- `create-missing-tables.js`
- `scripts/run-migrations.ts`
- `scripts/run-migrations.js`

The JavaScript scripts are now env-driven, but you should still review the SQL against the new project before running it.

## Recommended migration steps

1. Create a new Supabase project.
2. Copy the project URL, anon key, and service role key into `.env.local`.
3. Create the required storage buckets: `documents`, `media`, and `cms`.
4. Open the SQL editor in the new Supabase project.
5. Run `sql/missing_tables.sql`.
6. Review the rest of the app-required tables above and create any missing schema objects from your previous project or migration history.
7. If you want to use the helper scripts, run them only after env vars are set.
8. Start the app and verify auth, uploads, dashboard data, notifications, plans, reimbursements, and wallet flows.

## Verification checklist

Run these checks after connecting the new project:

1. Open the homepage and confirm plans, FAQs, and testimonials load without Supabase errors.
2. Sign in and confirm the session persists through middleware-protected routes.
3. Visit dashboard, wallet, notifications, reimbursements, and support pages.
4. Upload a document and confirm the file lands in the `documents` bucket.
5. Open the CMS media area and confirm reads and uploads work against the `cms` and `media` buckets.
6. Test at least one admin flow that uses `createAdminClient`, such as reports or settings.

## Known runtime breakpoints if schema is incomplete

Missing schema will break these areas quickly:

- Missing `profiles`: auth-dependent pages and role checks
- Missing `plans`: homepage and plans pages
- Missing `notifications`: dashboard and notifications pages
- Missing `service_requests`: support and request flows
- Missing `reimbursement_claims`: reimbursements flows
- Missing `wallets` or `wallet_transactions`: wallet pages and related API routes
- Missing storage buckets: file upload and CMS media flows

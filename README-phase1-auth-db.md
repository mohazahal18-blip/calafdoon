# Phase 1 — Auth & Database: setup notes

## What's in this drop
- `supabase/migrations/0001_init.sql` — full schema (all phases' tables, so later
  phases only add logic, not migrations) with Row Level Security policies,
  an auto-match trigger on mutual likes, and a trigger that mirrors new
  `auth.users` rows into the app's `users` table.
- `lib/supabase/client.ts` / `server.ts` — Supabase clients for Client
  Components and Server Components/Actions, using `@supabase/ssr`.
- `middleware.ts` — refreshes the auth session on every request and redirects
  signed-out users away from anything outside the public marketing pages.
- `app/(auth)/` — signup and login pages plus their server actions.

## What you need to provide
1. **A Supabase project** (free tier is fine to start) — create one at
   supabase.com, then run `supabase link` and
   `supabase db push` (or paste `0001_init.sql` into the SQL editor) to apply
   the migration.
2. **Three environment variables**, from Supabase → Project Settings → API,
   copied into `.env.local` using `.env.example` as the template:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` (the last one isn't used yet — it's needed once
   we build the admin dashboard in Phase 4, but worth generating now).
3. **Email confirmation setting**: in Supabase → Authentication → Providers →
   Email, decide whether to require email confirmation before login. The
   signup action already branches on this (`data.session` present or not).
4. **Package installs**: `@supabase/ssr` and `@supabase/supabase-js` in
   `package.json` — not included here since this drop is source files only,
   not a full repo scaffold.

## Not yet wired up (next phase of this task)
- The onboarding steps after signup (`/onboarding/basic-info` is referenced
  by the signup redirect but its page isn't built yet).
- Rate limiting on the auth actions (recommend Supabase's built-in auth rate
  limits to start, revisit if abuse shows up).
- Social/OAuth login — schema and `auth.users` already support it, just not
  wired into the UI.

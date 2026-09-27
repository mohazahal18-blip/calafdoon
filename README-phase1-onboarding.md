# Phase 1 — Onboarding flow: setup notes

## What's in this drop
- `app/onboarding/layout.tsx` — shared shell with the progress bar and back
  button for steps 2–9 (step 1, account creation, is `/signup`).
- `app/onboarding/{basic-info,photo,about-me,interests,goals,preferences,
  compatibility-preferences,preview}/page.tsx` — one page per step, each a
  short form bound to a server action.
- `app/onboarding/actions.ts` — all the server actions; each validates,
  writes to Supabase, and redirects to the next step.
- `lib/onboarding/steps.ts` — the ordered step list driving the progress bar
  and back/next routing (add or remove a step here and the whole flow
  updates).
- `lib/onboarding/options.ts` — the interest/language/goal option lists shown
  in the UI, kept in sync with the seed data below.
- `supabase/migrations/0002_seed_lookup_data.sql` — seeds the `languages` and
  `interests` tables the onboarding UI references by name.
- `app/styles/onboarding.css` — shared styling for the auth + onboarding
  forms, using the same brand tokens as the landing page.

## What you need to provide
1. **Run the new migration** (`0002_seed_lookup_data.sql`) after `0001_init.sql`.
2. **A Supabase Storage bucket named `profile-photos`.** Create it in
   Supabase → Storage, and for the MVP mark it public (so `getPublicUrl`
   works) — moderation happens via the `moderation_status` column on
   `photos`, not by hiding the file. Add a storage policy so a user can only
   upload into their own profile's folder, e.g.:
   ```sql
   create policy "Users can upload their own profile photos"
   on storage.objects for insert
   with check (
     bucket_id = 'profile-photos'
     and (storage.foldername(name))[1] in (
       select id::text from profiles where user_id = auth.uid()
     )
   );
   ```
3. **Import `onboarding.css`** in your root layout (`app/layout.tsx`) alongside
   the Poppins font link already used on the landing page.

## Design decisions worth knowing
- Interests/languages are stored as normalized many-to-many tables (not a
  free-text array) so discovery filtering and the compatibility algorithm can
  join on them efficiently later.
- The photo step inserts one row into `photos` per upload; multiple-photo
  support (the blueprint's "additional photos") is a straightforward repeat
  of this step later — not built now to keep onboarding to one photo, per
  your "don't make onboarding unnecessarily long" instruction.
- `finishOnboarding` just redirects to `/discover` — there's no separate
  "onboarding complete" flag. A profile with `relationship_intention` set is
  a reasonable proxy for "onboarded" until there's a reason to need more.

## Not yet built (next phase)
- `/discover` itself doesn't exist yet — signup and onboarding both redirect
  there. That's the natural next step: the discovery feed, the compatibility
  scoring logic from the blueprint, and likes/matches.

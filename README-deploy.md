# CALAFDOON — Sida loo isku xirayo oo loo hosting-gareynayo

Dhammaan waxaad hadda haysaa waa **hal project oo Next.js ah oo dhammaystiran** —
landing page-ka, login/signup-ka, iyo onboarding-ka 8-ka tallaabo oo dhan waxay
hadda ku wada jiraan isla folder-ka `calafdoon/`. Ma aha koox files ah oo kala
go'an — waa isku mid.

## 1. Habaynta local-ka (kombiyuutarkaaga)

```bash
cd calafdoon
npm install
cp .env.example .env.local
```

Ka buuxi `.env.local` seddexda qiyam ee Supabase (fiiri qaybta 2 hoose haddii
aadan weli lahayn Supabase project). Kadibna:

```bash
npm run dev
```

Fur `http://localhost:3000` — waa inaad aragto landing page-ka. `/signup` iyo
`/login` way shaqaynayaan marka Supabase la xirooo.

## 2. Supabase (backend-ka + database-ka)

1. Ka samee account [supabase.com](https://supabase.com), samee project cusub.
2. **SQL Editor** ku dhex ku shubo (copy-paste + run) labadan file, isla
   xilliga:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_seed_lookup_data.sql`
3. **Storage** → samee bucket magaciisu yahay `profile-photos`, ka dhig public,
   kuna dar policy-ga SQL ah ee `README-phase1-onboarding.md` ku qoran (si uu
   qofku u soo geliyo sawir aan cid kale ka wax bedeli karin).
4. **Project Settings → API** — ka koobiiso:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (weli lama isticmaalayo,
     laakiin waxaa loo baahan doonaa marka la dhiso admin dashboard-ka).

Saddexdaas qiyam ku rid `.env.local` (local-ka) iyo Vercel (hosting-ka, hoos
ka eeg).

## 3. GitHub

```bash
cd calafdoon
git init
git add .
git commit -m "CALAFDOON: landing + auth + onboarding"
```

Samee repo cusub oo GitHub ah, ka dibna:

```bash
git remote add origin <URL-ka repo-gaaga>
git push -u origin main
```

## 4. Hosting-ka — Vercel

Tech stack-gaaga (Next.js) wuxuu si toos ah ula shaqeeyaa Vercel, isla
shirkadda soo saartay Next.js:

1. Tag [vercel.com](https://vercel.com), ku gal GitHub account-kaaga.
2. "Add New Project" → dooro repo-ga `calafdoon`.
3. Vercel wuu ogaan doonaa inuu Next.js yahay — waxba ha bedelin settings-ka
   build-ka.
4. Ka hor inta aanad "Deploy" gujin, ku dar **Environment Variables** — isla
   saddexdii qiyam ee `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.
5. Deploy gujii. Dhawr daqiiqo gudahood waxaad heli doontaa link noocan ah
   `calafdoon.vercel.app` — kaas oo ah website-kaaga oo online ah.

Mar kasta oo aad `git push` u dirto `main`, Vercel si otomaatig ah ayuu website-ka cusboonaysiin doonaa.

## 5. Waxa aan weli la dhisin (si aan website-ku u noqon mid buuxa)

- `/discover` hadda waa boos ku meel gaadh ah oo leh fariin "You're in" — feed-ka
  dhabta ah ee discovery, compatibility scoring, iyo likes/matches waa
  Phase 2 (arag blueprint-ka).
- Bogagga `Blog`, `Contact`, `Terms`, `Privacy`, `Community Guidelines` weli
  lama qorin — nav-ka landing page-ka hadda kuma jiraan ilaa la sameeyo, si aan
  link jajaban loo yeelin.
- Admin dashboard-ka iyo verification-ku waa Phase 4.

Marka aad diyaar u tahay, waan sii wadi karnaa Phase 2 — discovery feed-ka iyo
compatibility algorithm-ka — isla mar bay website-ku noqon doonaa mid dhab ah
oo dadku isku heli karaan.

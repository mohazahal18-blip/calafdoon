-- =========================================================================
-- CALAFDOON — Initial schema
-- Phase 1: users, profiles, photos, languages, interests, preferences
-- Phase 2+ tables are included now so later phases only add logic, not schema.
-- =========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- users  (mirrors auth.users; keeps app-level fields separate from auth)
-- ---------------------------------------------------------------------
create type user_status as enum ('active', 'suspended', 'deleted');
create type user_role as enum ('user', 'admin', 'moderator');

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  phone text,
  status user_status not null default 'active',
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();

-- Mirror new auth.users rows into the app-level users table automatically,
-- so signup never has to make a second insert from the client.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, phone)
  values (new.id, new.email, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create type gender_type as enum ('male', 'female');
create type relationship_intention as enum ('marriage', 'serious_relationship', 'open_to_both');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  first_name text not null,
  birth_date date not null,
  gender gender_type not null,
  country text not null,
  city text,
  nationality text,
  education text,
  career text,
  about_me text,
  relationship_intention relationship_intention,
  is_visible boolean not null default true,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint adult_only check (birth_date <= (current_date - interval '18 years'))
);
create index idx_profiles_country_city on profiles(country, city);
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- photos
-- ---------------------------------------------------------------------
create type moderation_status as enum ('pending', 'approved', 'rejected');

create table photos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  url text not null,
  position smallint not null default 0,
  is_primary boolean not null default false,
  moderation_status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index idx_photos_profile on photos(profile_id);

-- ---------------------------------------------------------------------
-- languages / interests (shared lookup tables)
-- ---------------------------------------------------------------------
create table languages (
  id serial primary key,
  name text unique not null
);

create table interests (
  id serial primary key,
  name text unique not null,
  category text
);

create table profile_languages (
  profile_id uuid references profiles(id) on delete cascade,
  language_id int references languages(id) on delete cascade,
  primary key (profile_id, language_id)
);

create table profile_interests (
  profile_id uuid references profiles(id) on delete cascade,
  interest_id int references interests(id) on delete cascade,
  primary key (profile_id, interest_id)
);

-- ---------------------------------------------------------------------
-- preferences
-- ---------------------------------------------------------------------
create table preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  age_min smallint not null default 18,
  age_max smallint not null default 99,
  preferred_genders gender_type[] not null default '{}',
  preferred_locations text[] not null default '{}',
  preferred_languages int[] not null default '{}',
  education_pref text,
  lifestyle_pref jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint valid_age_range check (age_min <= age_max)
);
create trigger trg_preferences_updated_at before update on preferences
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- compatibility weights (tunable without a schema change — see blueprint §6)
-- ---------------------------------------------------------------------
create table compatibility_weights (
  key text primary key,
  weight numeric not null check (weight >= 0 and weight <= 1)
);
insert into compatibility_weights (key, weight) values
  ('relationship_goal', 0.25),
  ('location', 0.20),
  ('age_fit', 0.15),
  ('languages', 0.15),
  ('interests', 0.15),
  ('education', 0.10);

-- ---------------------------------------------------------------------
-- likes / matches
-- ---------------------------------------------------------------------
create type like_type as enum ('like', 'super_like');

create table likes (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references profiles(id) on delete cascade,
  to_profile_id uuid not null references profiles(id) on delete cascade,
  type like_type not null default 'like',
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id),
  constraint no_self_like check (from_profile_id <> to_profile_id)
);
create index idx_likes_to_profile on likes(to_profile_id);

create type match_status as enum ('active', 'unmatched');

create table matches (
  id uuid primary key default gen_random_uuid(),
  profile_a_id uuid not null references profiles(id) on delete cascade,
  profile_b_id uuid not null references profiles(id) on delete cascade,
  matched_at timestamptz not null default now(),
  status match_status not null default 'active',
  constraint ordered_pair check (profile_a_id < profile_b_id),
  unique (profile_a_id, profile_b_id)
);

-- When a mutual like occurs, create a match automatically.
create or replace function try_create_match()
returns trigger as $$
declare
  mutual_exists boolean;
  a uuid;
  b uuid;
begin
  select exists (
    select 1 from likes
    where from_profile_id = new.to_profile_id
      and to_profile_id = new.from_profile_id
  ) into mutual_exists;

  if mutual_exists then
    a := least(new.from_profile_id, new.to_profile_id);
    b := greatest(new.from_profile_id, new.to_profile_id);
    insert into matches (profile_a_id, profile_b_id)
    values (a, b)
    on conflict (profile_a_id, profile_b_id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_try_create_match after insert on likes
  for each row execute function try_create_match();

-- ---------------------------------------------------------------------
-- messages / notifications
-- ---------------------------------------------------------------------
create table messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  sent_at timestamptz not null default now(),
  read_at timestamptz,
  deleted_by_sender boolean not null default false,
  deleted_by_recipient boolean not null default false
);
create index idx_messages_match_sent on messages(match_id, sent_at);

create type notification_type as enum ('new_match', 'new_message', 'new_like', 'verification_update', 'system');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id, created_at desc);

-- ---------------------------------------------------------------------
-- reports / blocks
-- ---------------------------------------------------------------------
create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references users(id) on delete cascade,
  reported_profile_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  details text,
  status report_status not null default 'open',
  reviewed_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references users(id) on delete cascade,
  blocked_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id)
);

-- ---------------------------------------------------------------------
-- verifications / subscriptions / payments
-- ---------------------------------------------------------------------
create type verification_status as enum ('unverified', 'pending', 'approved', 'rejected');

create table verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  status verification_status not null default 'pending',
  method text not null default 'selfie_id_check',
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create type subscription_plan as enum ('free', 'premium');
create type subscription_status as enum ('active', 'canceled', 'past_due');

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plan subscription_plan not null default 'free',
  status subscription_status not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  provider text not null,
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  status text not null,
  provider_ref text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- admin / audit
-- ---------------------------------------------------------------------
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  role text not null default 'moderator',
  permissions jsonb not null default '{}'::jsonb
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
  action text not null,
  target_type text not null,
  target_id uuid,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Row Level Security
-- =========================================================================

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$ language sql stable security definer;

alter table users enable row level security;
alter table profiles enable row level security;
alter table photos enable row level security;
alter table preferences enable row level security;
alter table likes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;
alter table blocks enable row level security;
alter table verifications enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table admin_users enable row level security;
alter table audit_logs enable row level security;

-- users: read/update own row; admins read all
create policy users_select_own on users for select using (id = auth.uid() or is_admin());
create policy users_update_own on users for update using (id = auth.uid());

-- profiles: owner full access; everyone else can read only visible, non-suspended profiles
create policy profiles_owner_all on profiles for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_public_read on profiles for select
  using (is_visible = true or is_admin());

-- photos: owner manages; others can read approved photos on visible profiles
create policy photos_owner_all on photos for all
  using (profile_id in (select id from profiles where user_id = auth.uid()))
  with check (profile_id in (select id from profiles where user_id = auth.uid()));
create policy photos_public_read on photos for select
  using (moderation_status = 'approved' or is_admin());

-- preferences: owner only
create policy preferences_owner_all on preferences for all
  using (profile_id in (select id from profiles where user_id = auth.uid()))
  with check (profile_id in (select id from profiles where user_id = auth.uid()));

-- likes: a user can insert their own likes and see likes they sent or received
create policy likes_insert_own on likes for insert
  with check (from_profile_id in (select id from profiles where user_id = auth.uid()));
create policy likes_select_own on likes for select
  using (
    from_profile_id in (select id from profiles where user_id = auth.uid())
    or to_profile_id in (select id from profiles where user_id = auth.uid())
  );

-- matches: visible to either participant
create policy matches_select_participant on matches for select
  using (
    profile_a_id in (select id from profiles where user_id = auth.uid())
    or profile_b_id in (select id from profiles where user_id = auth.uid())
  );

-- messages: only participants of the match can read/send
create policy messages_select_participant on messages for select
  using (
    match_id in (
      select id from matches
      where profile_a_id in (select id from profiles where user_id = auth.uid())
         or profile_b_id in (select id from profiles where user_id = auth.uid())
    )
  );
create policy messages_insert_participant on messages for insert
  with check (
    sender_id = auth.uid()
    and match_id in (
      select id from matches
      where profile_a_id in (select id from profiles where user_id = auth.uid())
         or profile_b_id in (select id from profiles where user_id = auth.uid())
    )
  );

-- notifications: owner only
create policy notifications_owner_all on notifications for all
  using (user_id = auth.uid());

-- reports: reporter can create/read own; admins read all
create policy reports_insert_own on reports for insert with check (reporter_id = auth.uid());
create policy reports_select_own_or_admin on reports for select
  using (reporter_id = auth.uid() or is_admin());

-- blocks: owner only
create policy blocks_owner_all on blocks for all
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- verifications: owner + admin
create policy verifications_owner_read on verifications for select
  using (profile_id in (select id from profiles where user_id = auth.uid()) or is_admin());
create policy verifications_owner_insert on verifications for insert
  with check (profile_id in (select id from profiles where user_id = auth.uid()));
create policy verifications_admin_update on verifications for update using (is_admin());

-- subscriptions / payments: owner + admin
create policy subscriptions_owner_read on subscriptions for select
  using (user_id = auth.uid() or is_admin());
create policy payments_owner_read on payments for select
  using (user_id = auth.uid() or is_admin());

-- admin_users / audit_logs: admin only
create policy admin_users_admin_only on admin_users for all using (is_admin());
create policy audit_logs_admin_only on audit_logs for select using (is_admin());

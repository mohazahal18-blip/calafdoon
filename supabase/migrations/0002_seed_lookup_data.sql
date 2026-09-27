-- Seed lookup values referenced by the onboarding UI (lib/onboarding/options.ts).
-- Safe to re-run: unique constraints make these idempotent.

insert into languages (name) values
  ('Somali'), ('English'), ('Arabic'), ('Swahili'), ('Amharic'), ('French')
on conflict (name) do nothing;

insert into interests (name, category) values
  ('Travel', 'lifestyle'),
  ('Reading', 'lifestyle'),
  ('Cooking', 'lifestyle'),
  ('Fitness', 'lifestyle'),
  ('Business', 'career'),
  ('Sports', 'lifestyle'),
  ('Faith & spirituality', 'values'),
  ('Family time', 'values'),
  ('Music', 'lifestyle'),
  ('Volunteering', 'values')
on conflict (name) do nothing;

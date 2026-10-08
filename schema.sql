-- Run once in Neon > SQL Editor
create table profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  position text, company text, bio text, address text,
  email text, email2 text,
  phone1 text, phone2 text, contact1 text, contact2 text,
  image_url text,
  socials jsonb not null default '{}',
  created_at timestamptz default now()
);

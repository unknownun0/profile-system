-- Run this once in Supabase > SQL Editor
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
alter table profiles enable row level security; -- no public policies: only the server (service role) reads/writes

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

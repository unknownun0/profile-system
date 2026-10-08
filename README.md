# Profile system (Next.js + Supabase on Vercel)

1. Create a Supabase project, run `supabase.sql` in the SQL Editor.
2. Copy `.env.example` to `.env.local` and fill in the values (Supabase > Settings > API).
3. `npm install && npm run dev`
4. Open `/admin` (any username, password = ADMIN_PASSWORD) and create profiles.
5. Each profile is public at `/u/<url-name>`.

Deploy: push to GitHub, import in Vercel, add the same 3 env vars.

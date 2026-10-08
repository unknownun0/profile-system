# Profile system (Next.js + Neon + Vercel Blob)

1. Neon: create a database (or Vercel > Storage > Create > Neon). Run `schema.sql` in the Neon SQL Editor.
2. Images: Vercel > Storage > Create > Blob (adds BLOB_READ_WRITE_TOKEN).
3. Copy `.env.example` to `.env.local` and fill in the 3 values (Vercel: `vercel env pull`).
4. `npm install && npm run dev`
5. Open `/admin` (any username, password = ADMIN_PASSWORD) and create profiles.
6. Each profile is public at `/u/<url-name>`.

Deploy: push to GitHub, import in Vercel, connect the Neon + Blob stores to the project.

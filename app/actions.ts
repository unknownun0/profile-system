'use server'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { sql, SOCIALS } from '@/lib/db'

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function createProfile(fd: FormData) {
  const g = (k: string) => String(fd.get(k) ?? '').trim() || null
  const name = g('name')
  if (!name) throw new Error('Name is required')

  const slug = slugify(g('slug') ?? '') || `${slugify(name) || 'user'}-${Math.random().toString(36).slice(2, 6)}`

  let image_url: string | null = null
  const file = fd.get('image') as File | null
  if (file && file.size > 0) {
    if (file.size > 4 * 1024 * 1024) throw new Error('Image must be under 4 MB')
    const blob = await put(`avatars/${slug}-${Date.now()}.${file.name.split('.').pop()}`, file, { access: 'public' })
    image_url = blob.url
  }

  const socials: Record<string, string> = {}
  for (const s of SOCIALS) { const v = g(s); if (v) socials[s] = v }

  try {
    await sql`insert into profiles
      (slug, name, position, company, bio, address, email, email2, phone1, phone2, contact1, contact2, image_url, socials)
      values (${slug}, ${name}, ${g('position')}, ${g('company')}, ${g('bio')}, ${g('address')},
        ${g('email')}, ${g('email2')}, ${g('phone1')}, ${g('phone2')}, ${g('contact1')}, ${g('contact2')},
        ${image_url}, ${JSON.stringify(socials)}::jsonb)`
  } catch (e: any) {
    throw new Error(e.code === '23505' ? 'That URL name is already taken' : e.message)
  }
  revalidatePath('/admin')
}

export async function deleteProfile(fd: FormData) {
  await sql`delete from profiles where id = ${String(fd.get('id'))}::uuid`
  revalidatePath('/admin')
}

'use server'
import { revalidatePath } from 'next/cache'
import { db, SOCIALS } from '@/lib/db'

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function createProfile(fd: FormData) {
  const g = (k: string) => String(fd.get(k) ?? '').trim() || null
  const name = g('name')
  if (!name) throw new Error('Name is required')

  // Custom URL name if given, otherwise name + short random suffix
  const slug = slugify(g('slug') ?? '') || `${slugify(name) || 'user'}-${Math.random().toString(36).slice(2, 6)}`

  let image_url: string | null = null
  const file = fd.get('image') as File | null
  if (file && file.size > 0) {
    const path = `${slug}-${Date.now()}.${file.name.split('.').pop()}`
    const up = await db.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (up.error) throw new Error(up.error.message)
    image_url = db.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  const socials: Record<string, string> = {}
  for (const s of SOCIALS) { const v = g(s); if (v) socials[s] = v }

  const { error } = await db.from('profiles').insert({
    slug, name, image_url, socials,
    position: g('position'), company: g('company'), bio: g('bio'), address: g('address'),
    email: g('email'), email2: g('email2'),
    phone1: g('phone1'), phone2: g('phone2'), contact1: g('contact1'), contact2: g('contact2'),
  })
  if (error) throw new Error(error.code === '23505' ? 'That URL name is already taken' : error.message)
  revalidatePath('/admin')
}

export async function deleteProfile(fd: FormData) {
  await db.from('profiles').delete().eq('id', String(fd.get('id')))
  revalidatePath('/admin')
}

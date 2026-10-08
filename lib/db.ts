import { neon } from '@neondatabase/serverless'

// Server-only. Never import this in a client component.
export const sql = neon(process.env.DATABASE_URL!)

export const SOCIALS = ['facebook', 'instagram', 'youtube', 'linkedin', 'whatsapp', 'viber', 'wechat', 'telegram'] as const

export function socialHref(kind: string, v: string) {
  if (/^https?:\/\//i.test(v)) return v
  const digits = v.replace(/[^\d]/g, '')
  const user = v.replace(/^@/, '')
  switch (kind) {
    case 'whatsapp': return `https://wa.me/${digits}`
    case 'viber': return `viber://chat?number=%2B${digits}`
    case 'telegram': return `https://t.me/${user}`
    case 'facebook': return `https://facebook.com/${user}`
    case 'instagram': return `https://instagram.com/${user}`
    case 'linkedin': return `https://linkedin.com/in/${user}`
    case 'youtube': return `https://youtube.com/@${user}`
    default: return null // wechat: show the ID as text
  }
}

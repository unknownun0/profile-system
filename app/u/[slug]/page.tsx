import { notFound } from 'next/navigation'
import { db, SOCIALS, socialHref } from '@/lib/db'

export const dynamic = 'force-dynamic'

const Mail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
const Phone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>

export default async function Profile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: p } = await db.from('profiles').select('*').eq('slug', slug).maybeSingle()
  if (!p) notFound()

  const emails = [p.email, p.email2].filter(Boolean) as string[]
  const phones = [['Primary', p.phone1], ['Secondary', p.phone2], ['Contact 1', p.contact1], ['Contact 2', p.contact2]].filter(x => x[1])
  const socials = SOCIALS.filter(s => p.socials?.[s])
  const mailHref = emails[0] ? `mailto:${emails[0]}` : null
  const callHref = phones[0] ? `tel:${phones[0][1]}` : null
  const initials = p.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <main className="card">
      <div className="hero">
        {p.image_url ? <img src={p.image_url} alt={p.name} /> : <span>{initials}</span>}
      </div>

      <section className="body">
        <div className="namebar">
          <div>
            <h1>{p.name}</h1>
            <p className="handle">@{p.slug}</p>
          </div>
          <div className="icons">
            {callHref && <a href={callHref} aria-label="Call"><Phone /></a>}
            {mailHref && <a href={mailHref} aria-label="Email"><Mail /></a>}
          </div>
        </div>

        {(p.position || p.company) && <p className="role">{[p.position, p.company].filter(Boolean).join(' · ')}</p>}
        {p.bio && <p className="bio">{p.bio}</p>}

        {socials.length > 0 && (
          <ul className="socials">
            {socials.map(s => {
              const href = socialHref(s, p.socials[s])
              return <li key={s}>{href ? <a href={href} target="_blank" rel="noopener">{s}</a> : <span>{s}: {p.socials[s]}</span>}</li>
            })}
          </ul>
        )}

        <dl className="glass">
          {emails.map(e => <div key={e}><dt>Email</dt><dd><a href={`mailto:${e}`}>{e}</a></dd></div>)}
          {phones.map(([l, v]) => <div key={l}><dt>{l}</dt><dd><a href={`tel:${v}`}>{v}</a></dd></div>)}
          {p.address && <div><dt>Address</dt><dd>{p.address}</dd></div>}
        </dl>

        {(mailHref || callHref) && <a className="cta" href={(callHref ?? mailHref)!}>Contact {p.name.split(' ')[0]}</a>}
      </section>
    </main>
  )
}

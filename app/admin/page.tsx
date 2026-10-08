import { db, SOCIALS } from '@/lib/db'
import { createProfile, deleteProfile } from '../actions'

export const dynamic = 'force-dynamic'

const Field = ({ n, label, type = 'text', ph }: { n: string; label: string; type?: string; ph?: string }) => (
  <label>{label}<input name={n} type={type} placeholder={ph} /></label>
)

export default async function Admin() {
  const { data: profiles } = await db.from('profiles').select('id,slug,name,position,company').order('created_at', { ascending: false })

  return (
    <main className="admin">
      <h1>Create a profile</h1>
      <form action={createProfile} className="form">
        <fieldset><legend>Profile</legend>
          <label>Profile image<input name="image" type="file" accept="image/*" /></label>
          <Field n="name" label="Full name *" />
          <Field n="slug" label="URL name (optional)" ph="e.g. juan-delacruz → /u/juan-delacruz" />
          <Field n="position" label="Position" />
          <Field n="company" label="Company" />
          <label>Bio<textarea name="bio" rows={4} /></label>
          <Field n="address" label="Address" />
        </fieldset>
        <fieldset><legend>Email</legend>
          <Field n="email" label="Email" type="email" />
          <Field n="email2" label="Secondary email" type="email" />
        </fieldset>
        <fieldset><legend>Contact numbers</legend>
          <Field n="phone1" label="Primary phone" type="tel" />
          <Field n="phone2" label="Secondary phone" type="tel" />
          <Field n="contact1" label="Contact 1" />
          <Field n="contact2" label="Contact 2" />
        </fieldset>
        <fieldset><legend>Social media</legend>
          {SOCIALS.map(s => <Field key={s} n={s} label={s[0].toUpperCase() + s.slice(1)} ph="username, number or full link" />)}
        </fieldset>
        <button type="submit">Create profile</button>
      </form>

      <h2>Existing profiles</h2>
      {!profiles?.length && <p className="muted">No profiles yet. Create the first one above.</p>}
      <ul className="list">
        {profiles?.map(p => (
          <li key={p.id}>
            <div><strong>{p.name}</strong><span className="muted"> {[p.position, p.company].filter(Boolean).join(' at ')}</span><br />
              <a href={`/u/${p.slug}`} target="_blank">/u/{p.slug}</a></div>
            <form action={deleteProfile}><input type="hidden" name="id" value={p.id} /><button className="ghost">Delete</button></form>
          </li>
        ))}
      </ul>
    </main>
  )
}

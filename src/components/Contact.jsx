import { contact, profile } from '../data/content.js'
import { Module } from './Module.jsx'

/* Airlock. */
export default function Contact({ mod }) {
  return (
    <Module mod={mod} lead={contact.blurb}>
      <p>
        <a className="contact-email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      </p>
      <div className="actions">
        {contact.socials.map((s) => (
          <a className="ref" key={s.label} href={s.url} target="_blank" rel="noreferrer">
            {s.label} — {s.handle}
          </a>
        ))}
        <a className="ref" href={profile.resumeUrl} target="_blank" rel="noreferrer">
          Resume (PDF)
        </a>
      </div>
    </Module>
  )
}

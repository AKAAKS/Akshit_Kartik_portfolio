import { profile, contact } from '../data/content.js'

/* Node 1. Carries the h1, so it does not use the shared Module shell. */
export default function Intro({ mod }) {
  return (
    <section id={mod.id} className="module" aria-labelledby={`${mod.id}-h`}>
      <div className="module-head">
        <span className="stamp">{mod.desig} · {mod.hatch}</span>
      </div>
      <div className="module-body">
        <h1 id={`${mod.id}-h`} className="intro-name">{profile.name}</h1>
        <p className="intro-role">{profile.title}</p>
        <p className="intro-tagline">{profile.tagline}</p>
        <div className="actions">
          <a className="ref" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Resume (PDF)
          </a>
          <a className="ref" href={`mailto:${contact.email}`}>Email</a>
          <a className="ref" href="#timeline">Timeline</a>
        </div>
      </div>
    </section>
  )
}

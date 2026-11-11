import { profile, contact } from '../data/content.js'
import { Placard } from './Module.jsx'

/* Node 1. Carries the h1, so its placard holds the name instead of the module
 * title; the module name still appears on the placard's top line. */
export default function Intro({ mod }) {
  return (
    <section id={mod.id} className="module" aria-labelledby={`${mod.id}-h`}>
      <div className="tube module-inner">
        <div className="placard">
          <p className="placard-top">
            <span className="pl-desig">{mod.desig}</span>
            <span className="pl-elem">{mod.element}</span>
            <span className="pl-note">{mod.name}</span>
          </p>
          <h1 id={`${mod.id}-h`} className="intro-name">{profile.name}</h1>
        </div>
        <div className="module-body">
          <p className="intro-role">{profile.title}</p>
          <p className="intro-tagline">{profile.tagline}</p>
          {/* Status before links. A reader's first two questions about a
            * portfolio are "is this person available" and "where are they",
            * and both used to be unanswerable without reading the whole
            * page and doing date arithmetic. */}
          <p className="intro-status">
            <span>{profile.status}</span>
            <span>{profile.location}</span>
            <span>{profile.seeking}</span>
          </p>
          {/* The evidence for the two claims above, before the reader has
            * scrolled far enough to find any of it. */}
          <p className="intro-proof">
            <span className="ip-label">Selected</span>
            {profile.proof.map((x) => (
              <a className="ref" key={x.label} href={x.href}>{x.label}</a>
            ))}
          </p>
          <div className="actions">
            <a className="ref" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Resume (PDF)
            </a>
            <a className="ref" href={`mailto:${contact.email}`}>Email</a>
            <a className="ref" href="#timeline">Timeline</a>
          </div>
        </div>
      </div>
    </section>
  )
}

import { profile, contact } from '../data/content.js'
import { Placard } from './Module.jsx'

/* Node 1.
 *
 * SPIKE: the h1 used to live here, which made this placard a special case -
 * every other module's placard carries its module title. With the name up on
 * the landing, this one behaves like all the others and the intro leads with
 * the tagline and the readout, which is what it should have been doing. */
export default function Intro({ mod }) {
  return (
    <section id={mod.id} className="module" aria-labelledby={`${mod.id}-h`}>
      <div className="tube module-inner">
        <Placard mod={mod} />
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

import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { research, profile } from '../data/content.js'
import { FiArrowUpRight, FiDownload } from 'react-icons/fi'

export default function Research() {
  return (
    <section id="research">
      <div className="container">
        <SectionHead eyebrow="Archive" title="Research & Publications" sub={research.intro} />

        <div style={{ display: 'grid', gap: 12 }}>
          {research.papers.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <a className="paper" href={p.link} target="_blank" rel="noreferrer">
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="ptitle">{p.title}</span>
                  <div className="pmeta">
                    {p.venue} · {p.year}
                  </div>
                  {p.blurb && <div className="pblurb">{p.blurb}</div>}
                </span>
                <FiArrowUpRight className="parrow" size={20} />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div style={{ marginTop: 26 }}>
            <a className="btn gold" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <FiDownload /> Download Full Resume / CV
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

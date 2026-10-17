import SectionHead from './SectionHead.jsx'
import HudPanel from './HudPanel.jsx'
import Reveal from './Reveal.jsx'
import { projects } from '../data/content.js'
import { FiGithub, FiExternalLink, FiFileText } from 'react-icons/fi'

const LINK_META = {
  site: { label: 'Landing', Icon: FiExternalLink },
  repo: { label: 'Repo', Icon: FiGithub },
  demo: { label: 'Live', Icon: FiExternalLink },
  paper: { label: 'Paper', Icon: FiFileText },
}

function ProjectCard({ p, gold }) {
  const links = Object.entries(p.links || {})
  return (
    <HudPanel gold={gold} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="proj-top">
        <span className="proj-code">{p.code}</span>
        {p.status && <span className="status-chip">● {p.status}</span>}
      </div>
      <h3 className="proj-name">{p.name}</h3>
      <p className="proj-summary">{p.summary}</p>
      <div className="chips">
        {p.tags.map((t) => (
          <span className="chip" key={t}>{t}</span>
        ))}
      </div>
      {links.length > 0 && (
        <div className="proj-links" style={{ marginTop: 'auto', paddingTop: 16 }}>
          {links.map(([key, url]) => {
            const meta = LINK_META[key] || { label: key, Icon: FiExternalLink }
            const { Icon, label } = meta
            return (
              <a key={key} href={url} target="_blank" rel="noreferrer">
                <Icon /> {label}
              </a>
            )
          })}
        </div>
      )}
    </HudPanel>
  )
}

function Group({ label, items, goldIndex }) {
  if (!items || items.length === 0) return null
  return (
    <div className="proj-group">
      <Reveal>
        <div className="proj-group-label">
          <span className="gl-line" />
          {label}
          <span className="gl-count">[{String(items.length).padStart(2, '0')}]</span>
        </div>
      </Reveal>
      <div className="grid-auto">
        {items.map((p, i) => (
          <Reveal key={p.code} delay={i * 0.08}>
            <ProjectCard p={p} gold={i === goldIndex} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <SectionHead
          eyebrow="Build Log"
          title="Projects"
          sub="Things I've designed, built, and shipped, plus what's on the bench right now."
        />
        <Group label="CURRENT" items={projects.current} goldIndex={0} />
        <Group label="COMPLETED" items={projects.completed} goldIndex={0} />
      </div>
    </section>
  )
}

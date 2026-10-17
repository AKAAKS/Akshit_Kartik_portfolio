import SectionHead from './SectionHead.jsx'
import HudPanel from './HudPanel.jsx'
import Reveal from './Reveal.jsx'
import { about } from '../data/content.js'

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <SectionHead eyebrow="Operator Profile" title="About" />
        <Reveal>
          <HudPanel>
            {about.body.map((p, i) => (
              <p key={i} style={{ margin: i === 0 ? '0 0 14px' : 0, color: 'var(--text)' }}>
                {p}
              </p>
            ))}
            <div className="readouts">
              {about.stats.map((s) => (
                <div className="readout" key={s.label}>
                  <div className="rk">{s.label}</div>
                  <div className="rv">{s.value}</div>
                </div>
              ))}
            </div>
          </HudPanel>
        </Reveal>
      </div>
    </section>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import SectionHead from './SectionHead.jsx'
import HudPanel from './HudPanel.jsx'
import Reveal from './Reveal.jsx'
import { skills } from '../data/content.js'

function Meter({ name, level }) {
  const reduce = useReducedMotion()
  return (
    <div className="meter">
      <div className="meter-top">
        <span>{name}</span>
        <span className="val">{level}%</span>
      </div>
      <div className="meter-track">
        <motion.div
          className="meter-fill"
          initial={reduce ? { width: `${level}%` } : { width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <SectionHead
          eyebrow="Diagnostics"
          title="Skills & Systems"
          sub="Rough power levels across the stack, self-assessed."
        />
        <div className="grid-3">
          {skills.map((grp, i) => (
            <Reveal key={grp.group} delay={i * 0.08}>
              <HudPanel>
                <div className="proj-code">{grp.group.toUpperCase()}</div>
                <div style={{ marginTop: 16 }}>
                  {grp.items.map((it) => (
                    <Meter key={it.name} {...it} />
                  ))}
                </div>
              </HudPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import SectionHead from './SectionHead.jsx'
import HudPanel from './HudPanel.jsx'
import Reveal from './Reveal.jsx'
import { contact } from '../data/content.js'
import { FiMail, FiGithub, FiLinkedin, FiTwitter, FiGlobe } from 'react-icons/fi'

const ICON = {
  GitHub: FiGithub,
  LinkedIn: FiLinkedin,
  'Twitter / X': FiTwitter,
}

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <SectionHead eyebrow="Open Channel" title="Contact" sub={contact.blurb} />
        <div className="contact-grid">
          <Reveal>
            <HudPanel gold>
              <div className="proj-code">DIRECT LINE</div>
              <a
                className="btn gold"
                style={{ marginTop: 18 }}
                href={`mailto:${contact.email}`}
              >
                <FiMail /> {contact.email}
              </a>
              <p className="proj-summary" style={{ marginTop: 16 }}>
                Preferred for project inquiries, collaborations, and research.
              </p>
            </HudPanel>
          </Reveal>

          <Reveal delay={0.08}>
            <HudPanel>
              <div className="proj-code">NETWORKS</div>
              <div style={{ marginTop: 10 }}>
                {contact.socials.map((s) => {
                  const Icon = ICON[s.label] || FiGlobe
                  return (
                    <a className="social-row" key={s.label} href={s.url} target="_blank" rel="noreferrer">
                      <Icon className="sicon" />
                      <span className="slabel">{s.label}</span>
                      <span className="shandle">{s.handle}</span>
                    </a>
                  )
                })}
              </div>
            </HudPanel>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

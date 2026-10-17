import Reveal from './Reveal.jsx'

/* Eyebrow + title + optional subtitle, used atop each section. */
export default function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="section-head">
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </Reveal>
    </div>
  )
}

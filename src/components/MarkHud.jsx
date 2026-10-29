import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  FiArrowDownRight, FiDownload, FiGithub, FiExternalLink, FiLinkedin, FiMail,
} from 'react-icons/fi'
import { profile, about, proof, loadout, projects, research, contact } from '../data/content.js'
import CountUp from './CountUp.jsx'

/* ============================================================================
 * MARK HUD — you are Tony Stark scanning Akshit through the J.A.R.V.I.S. helmet.
 * Controlled snap scroller (deliberate scroll = one target) + trigger-on-enter
 * time-based animation: the reticle hunts an off-center target, locks, and the
 * panel zooms to centre with a leader line.
 * ========================================================================== */

/* Tuning for the controlled scroller */
const WHEEL_THRESHOLD = 170 // accumulated wheel delta before advancing (higher = less sensitive)
const COOLDOWN = 820        // ms lock after an advance (one gesture = one section)
const GESTURE_GAP = 260     // ms idle that resets the accumulator
const TOUCH_THRESHOLD = 55  // px swipe to advance

/* Off-center anchors — cycled so the reticle locks across all four axes. */
const ANCHORS = [
  { fx: -0.30, fy: -0.17 }, // upper-left
  { fx: 0.32, fy: 0.18 },   // lower-right
  { fx: -0.28, fy: 0.20 },  // lower-left
  { fx: 0.30, fy: -0.16 },  // upper-right
  { fx: -0.34, fy: 0.02 },  // left
  { fx: 0.34, fy: 0.05 },   // right
  { fx: 0.03, fy: -0.22 },  // up
  { fx: -0.03, fy: 0.23 },  // down
]
const LINES = [['70%', '46%'], ['58%', '80%', '40%'], ['76%', '52%'], ['64%', '44%', '72%']]

const NAV = [
  { label: 'HOME', chapter: 'SUBJECT' },
  { label: 'PROFILE', chapter: 'PROFILE' },
  { label: 'LOADOUT', chapter: 'LOADOUT' },
  { label: 'PROJECTS', chapter: 'MISSION LOG' },
  { label: 'RESEARCH', chapter: 'RECORDS' },
  { label: 'CONTACT', chapter: 'COMMS' },
]
const CHAPTERS = ['SUBJECT', 'PROFILE', 'LOADOUT', 'MISSION LOG', 'RECORDS', 'COMMS']

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }))
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return vp
}

function Reticle({ locked }) {
  const ticks = Array.from({ length: 32 })
  return (
    <div className={`mk-reticle ${locked ? 'locked' : ''}`}>
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="82" className="mk-ring" />
        <circle cx="100" cy="100" r="68" className="mk-dash" />
        <g className="mk-ticks">
          {ticks.map((_, i) => (
            <line key={i} x1="100" y1="10" x2="100" y2={i % 4 === 0 ? 20 : 15}
              transform={`rotate(${i * 11.25} 100 100)`} className="mk-tick" />
          ))}
        </g>
        <line x1="100" y1="36" x2="100" y2="72" className="mk-cross" />
        <line x1="100" y1="128" x2="100" y2="164" className="mk-cross" />
        <line x1="36" y1="100" x2="72" y2="100" className="mk-cross" />
        <line x1="128" y1="100" x2="164" y2="100" className="mk-cross" />
        <circle cx="100" cy="100" r="2.5" className="mk-cdot" />
      </svg>
      <span className="mk-rcnr tl" /><span className="mk-rcnr tr" />
      <span className="mk-rcnr bl" /><span className="mk-rcnr br" />
      {locked && (
        <>
          <span className="mk-tele tr">MATCH 98.4%</span>
          <span className="mk-tele r">LOCK</span>
          <span className="mk-tele bl">θ 41.2 · ρ 0.88</span>
        </>
      )}
    </div>
  )
}

function TargetBeat({
  vp, index, total, code, callsign, cardLabel, title, titleKw, sub, anchor, targetLines, wide, children,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.55 })
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState('idle') // idle | acquire | lock | expand

  const ax = anchor.fx * vp.w * 0.5
  const ay = anchor.fy * vp.h * 0.5

  useEffect(() => {
    if (!inView) { setPhase('idle'); return }
    if (reduce) { setPhase('expand'); return }
    setPhase('acquire')
    const t1 = setTimeout(() => setPhase('lock'), 480)
    const t2 = setTimeout(() => setPhase('expand'), 1080)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView, reduce])

  const locked = phase === 'lock' || phase === 'expand'
  const expanded = phase === 'expand'

  const reticleAnim =
    phase === 'idle' ? { x: ax * 0.5, y: ay * 0.5, opacity: 0, scale: 1.5 }
      : phase === 'acquire' ? { x: ax, y: ay, opacity: 1, scale: 1.05 }
        : phase === 'lock' ? { x: ax, y: ay, opacity: 1, scale: 0.92 }
          : { x: ax, y: ay, opacity: 0, scale: 0.6 }

  const body = typeof children === 'function' ? children(expanded) : children

  return (
    <section ref={ref} className="mk-sec">
      <div className="mk-stage">
        {/* off-center target card */}
        <motion.div
          className={`mk-target ${locked ? 'locked' : ''}`}
          initial={false}
          animate={{ x: ax, y: ay, opacity: expanded ? 0 : inView ? 1 : 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="t-code">TGT-{code}</div>
          <div className="t-name">{cardLabel}</div>
          {targetLines.map((w, i) => <div key={i} className="t-ln" style={{ width: w }} />)}
        </motion.div>

        {/* leader line */}
        <svg className="mk-leader">
          <motion.line
            x1={`${50 + anchor.fx * 50}%`} y1={`${50 + anchor.fy * 50}%`} x2="50%" y2="50%"
            initial={false} animate={{ opacity: expanded ? 0.8 : 0 }} transition={{ duration: 0.4 }}
          />
          <motion.circle
            cx={`${50 + anchor.fx * 50}%`} cy={`${50 + anchor.fy * 50}%`} r="3"
            initial={false} animate={{ opacity: expanded ? 1 : 0 }}
          />
        </svg>

        {/* reticle */}
        <motion.div
          style={{ zIndex: 6 }} initial={false} animate={reticleAnim}
          transition={{ duration: phase === 'acquire' ? 0.6 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <Reticle locked={locked} />
        </motion.div>

        {/* centered panel */}
        <motion.div
          className={`mk-panel ${wide ? 'wide' : ''}`}
          style={{ pointerEvents: expanded ? 'auto' : 'none' }}
          initial={false}
          animate={expanded ? { x: 0, y: 0, scale: 1, opacity: 1 } : { x: ax, y: ay, scale: 0.32, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mk-win">
            <div className="mk-win-bar">
              <span className="code">TGT-{code}</span>
              <span>{callsign}</span>
              <span>· SEC {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
              <span className="bars">{Array.from({ length: 11 }).map((_, i) => <i key={i} />)}</span>
            </div>
            <div className="mk-win-body">
              <h2 className="mk-win-title">{title}{titleKw && <> <span className="g">{titleKw}</span></>}</h2>
              {sub && <p className="mk-win-sub">{sub}</p>}
              {body}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Meters({ meters, open }) {
  return (
    <div className="mk-meters">
      {meters.map((m) => (
        <div key={m.name} className="mk-meter">
          <div className="mk-meter-top"><span>{m.name}</span><span className="lv">{m.level}</span></div>
          <div className="mk-meter-track">
            <div className="mk-meter-fill" style={{ width: open ? `${m.level}%` : '0%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function socialIcon(label) {
  const l = label.toLowerCase()
  if (l.includes('git')) return <FiGithub />
  if (l.includes('link')) return <FiLinkedin />
  return <FiExternalLink />
}

export default function MarkHud() {
  const vp = useViewport()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [time, setTime] = useState('')
  const scrollerRef = useRef(null)
  const goToRef = useRef(null)

  // Build the flat list of beats from real content.
  const beats = useMemo(() => {
    const list = []
    const name = profile.name.split(' ')
    const lastName = name.length > 1 ? name.pop() : ''
    list.push({
      kind: 'subject', code: '00', chapter: 'SUBJECT', callsign: 'SUBJECT', cardLabel: 'A. KARTIK',
      title: name.join(' '), titleKw: lastName, sub: profile.title,
    })
    list.push({
      kind: 'profile', code: '01', chapter: 'PROFILE', callsign: 'PROFILE', cardLabel: 'PROFILE',
      title: 'Operator', titleKw: 'Profile', sub: 'Scanning the subject — who he is and the numbers behind the work.',
    })
    loadout.forEach((c, i) => list.push({
      kind: 'loadout', data: c, code: `02.${i + 1}`, chapter: 'LOADOUT',
      callsign: `LOADOUT · ${c.label.toUpperCase()}`, cardLabel: c.label.toUpperCase(),
      title: 'Capability', titleKw: c.label, sub: c.tag,
    }))
    const all = [
      ...projects.current.map((p) => ({ ...p, group: 'ACTIVE' })),
      ...projects.completed.map((p) => ({ ...p, group: 'ARCHIVE' })),
    ]
    all.forEach((p, i) => {
      let title = p.name, kw = ''
      if (p.name.includes(':')) { const [a, b] = p.name.split(':'); title = `${a}:`; kw = b.trim() }
      list.push({
        kind: 'project', data: p, code: `03.${i + 1}`, chapter: 'MISSION LOG',
        callsign: `MISSION LOG · ${p.code}`, cardLabel: p.code, title, titleKw: kw, sub: '', wide: false,
      })
    })
    list.push({
      kind: 'records', code: '04', chapter: 'RECORDS', callsign: 'RECORDS', cardLabel: 'RECORDS',
      title: 'Research', titleKw: 'Records', sub: research.intro,
    })
    list.push({
      kind: 'comms', code: '05', chapter: 'COMMS', callsign: 'COMMS', cardLabel: 'COMMS',
      title: 'Open', titleKw: 'Comms', sub: contact.blurb,
    })
    return list
  }, [])

  const total = beats.length
  const chapterStart = (ch) => beats.findIndex((b) => b.chapter === ch)
  const activeChapter = beats[active].chapter
  const missionStart = chapterStart('MISSION LOG')

  // Controlled section scroller.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let idx = 0, acc = 0, last = 0, cooling = false, cd

    const go = (next) => {
      const clamped = Math.max(0, Math.min(total - 1, next))
      acc = 0
      if (clamped === idx) return
      idx = clamped
      setActive(idx)
      el.scrollTo({ top: idx * window.innerHeight, behavior: reduce ? 'auto' : 'smooth' })
      cooling = true
      clearTimeout(cd)
      cd = setTimeout(() => { cooling = false }, COOLDOWN)
    }
    goToRef.current = go

    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(idx + 1) }
      else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(idx - 1) }
      else if (e.key === 'Home') { e.preventDefault(); go(0) }
      else if (e.key === 'End') { e.preventDefault(); go(total - 1) }
    }
    window.addEventListener('keydown', onKey)

    let onWheel, onTS, onTE, touchY = 0, touchBody = null
    if (!reduce) {
      onWheel = (e) => {
        e.preventDefault()
        if (cooling) return
        const now = Date.now()
        if (now - last > GESTURE_GAP) acc = 0
        last = now
        if ((acc > 0 && e.deltaY < 0) || (acc < 0 && e.deltaY > 0)) acc = 0
        acc += e.deltaY
        if (acc > WHEEL_THRESHOLD) go(idx + 1)
        else if (acc < -WHEEL_THRESHOLD) go(idx - 1)
      }
      onTS = (e) => {
        touchY = e.touches[0].clientY
        touchBody = e.target.closest ? e.target.closest('.mk-win-body') : null
      }
      onTE = (e) => {
        if (cooling) return
        const dy = touchY - e.changedTouches[0].clientY
        if (Math.abs(dy) < TOUCH_THRESHOLD) return
        // If the swipe is inside a scrollable panel, let it pan until it hits the edge.
        const b = touchBody
        if (b && b.scrollHeight > b.clientHeight + 2) {
          const atTop = b.scrollTop <= 2
          const atBottom = b.scrollTop + b.clientHeight >= b.scrollHeight - 2
          if (dy > 0 && !atBottom) return
          if (dy < 0 && !atTop) return
        }
        go(idx + (dy > 0 ? 1 : -1))
      }
      el.addEventListener('wheel', onWheel, { passive: false })
      el.addEventListener('touchstart', onTS, { passive: true })
      el.addEventListener('touchend', onTE, { passive: true })
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      if (onWheel) {
        el.removeEventListener('wheel', onWheel)
        el.removeEventListener('touchstart', onTS)
        el.removeEventListener('touchend', onTE)
      }
      clearTimeout(cd)
      goToRef.current = null
    }
  }, [reduce, total])

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Cursor crosshair + background parallax (desktop, motion on).
  useEffect(() => {
    if (reduce) return
    const el = scrollerRef.current
    if (!el) return
    let raf = 0, mx = 0, my = 0
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        el.style.setProperty('--mx', `${mx}px`)
        el.style.setProperty('--my', `${my}px`)
        el.style.setProperty('--px', ((mx / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--py', ((my / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => { window.removeEventListener('mousemove', onMove); if (raf) cancelAnimationFrame(raf) }
  }, [reduce])

  const renderBody = (b) => {
    switch (b.kind) {
      case 'subject':
        return (
          <>
            <p>{profile.tagline}</p>
            <div className="mk-cta">
              <button className="mk-btn" onClick={() => goToRef.current?.(missionStart)}>
                View Mission Log <FiArrowDownRight />
              </button>
              <a className="mk-btn gold" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                <FiDownload /> Download Resume
              </a>
            </div>
          </>
        )
      case 'profile':
        return (expanded) => (
          <>
            {about.body.map((p, i) => <p key={i}>{p}</p>)}
            <div className="mk-stats">
              {proof.map((s) => (
                <div key={s.label} className="mk-stat">
                  <div className="n"><CountUp value={s.value} suffix={s.suffix} decimals={s.decimals || 0} run={expanded} /></div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )
      case 'loadout':
        return (expanded) => (
          <>
            <p>{b.data.blurb}</p>
            <Meters meters={b.data.meters} open={expanded} />
            <div className="mk-signal">SIGNAL · <b>{b.data.signal}</b></div>
          </>
        )
      case 'project': {
        const p = b.data
        return (expanded) => (
          <>
            <div className="mk-dmeta">
              <span>{p.code}</span>
              <span className={`grp ${p.group === 'ACTIVE' ? 'active' : ''}`}>{p.group}</span>
              {p.status && <span>{p.status}</span>}
              {p.metric && (
                <span className="metric">
                  <CountUp value={p.metric.value} suffix={p.metric.suffix} run={expanded} />
                  <small>{p.metric.label}</small>
                </span>
              )}
            </div>
            <p>{p.summary}</p>
            <div className="mk-chips">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
            {p.links && (p.links.site || p.links.repo) && (
              <div className="mk-cta">
                {p.links.site && <a className="mk-btn" href={p.links.site} target="_blank" rel="noreferrer"><FiExternalLink /> Live</a>}
                {p.links.repo && <a className="mk-btn gold" href={p.links.repo} target="_blank" rel="noreferrer"><FiGithub /> Repo</a>}
              </div>
            )}
          </>
        )
      }
      case 'records':
        return (
          <>
            <div className="mk-papers">
              {research.papers.map((pp) => (
                <div key={pp.title} className="mk-paper">
                  <div className="pt">{pp.title}</div>
                  <div className="pv">{pp.venue} · {pp.year}</div>
                  {pp.blurb && <div className="pb">{pp.blurb}</div>}
                  {pp.link && <a href={pp.link} target="_blank" rel="noreferrer">Read paper <FiExternalLink /></a>}
                </div>
              ))}
            </div>
            <div className="mk-cta">
              <a className="mk-btn gold" href={profile.resumeUrl} target="_blank" rel="noreferrer"><FiDownload /> Download Resume</a>
            </div>
          </>
        )
      case 'comms':
        return (
          <>
            <a className="mk-comms-lead" href={`mailto:${contact.email}`}><FiMail /> {contact.email}</a>
            <div className="mk-socials">
              {contact.socials.map((s) => (
                <a key={s.label} className="mk-social" href={s.url} target="_blank" rel="noreferrer">
                  <div className="sl">{socialIcon(s.label)} {s.label}</div>
                  <div className="sh">{s.handle}</div>
                </a>
              ))}
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="mk" ref={scrollerRef}>
      {/* background */}
      <div className="mk-bg"><div className="mk-bg-grid" /><div className="mk-bg-sphere" /></div>
      <div className="mk-scan" />
      <div className="mk-ambient" aria-hidden="true">
        <div className="mk-chip" style={{ top: '17%', left: '7%' }}>EDU · PENN STATE<span className="ln" style={{ width: 70 }} /></div>
        <div className="mk-chip" style={{ top: '44%', left: '9%' }}>LANG · PY/JS/C++<span className="ln" style={{ width: 54 }} /></div>
        <div className="mk-chip" style={{ top: '70%', left: '11%' }}>STACK · REACT/VITE<span className="ln" style={{ width: 48 }} /></div>
        <div className="mk-chip" style={{ top: '24%', left: '84%' }}>PUBS · 02<span className="ln" style={{ width: 40 }} /></div>
        <div className="mk-chip" style={{ top: '48%', left: '86%' }}>STATUS · OPEN<span className="ln" style={{ width: 60 }} /></div>
        <div className="mk-chip" style={{ top: '73%', left: '82%' }}>LOC · US · REMOTE<span className="ln" style={{ width: 52 }} /></div>
      </div>

      {/* cursor crosshair (scan field) */}
      <div className="mk-cursor" aria-hidden="true">
        <span className="ch-v" /><span className="ch-h" /><span className="ch-ring" />
      </div>

      {/* side telemetry rails */}
      <div className="mk-rail left" aria-hidden="true">
        <div className="rail-ticks" />
        <span className="rail-cap top">TGT</span>
        <div className="rail-marker" style={{ top: `${(active / (total - 1)) * 100}%` }} />
        <span className="rail-cap bot">{String(active + 1).padStart(2, '0')}</span>
      </div>
      <div className="mk-rail right" aria-hidden="true">
        <div className="rail-ticks" />
        <div className="rail-scan" />
        <span className="rail-val a">θ 041.2</span>
        <span className="rail-val b">ρ 0.88</span>
        <span className="rail-val c">SYS OK</span>
      </div>

      {/* helmet frame */}
      <div className="mk-frame">
        <span className="mk-cnr tl" /><span className="mk-cnr tr" />
        <span className="mk-cnr bl" /><span className="mk-cnr br" />
        <div className="mk-top">
          <span className="brand">{profile.codename}</span>
          <span className="sub-label">MARK HUD</span>
          <nav className="mk-nav">
            {NAV.map((n) => (
              <button
                key={n.label}
                className={activeChapter === n.chapter ? 'on' : ''}
                onClick={() => goToRef.current?.(chapterStart(n.chapter))}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <span className="live">◉ ONLINE</span>
          <span className="clock">{time}</span>
        </div>
        <div className="mk-bottom">
          <span className="live">● TRACKING</span>
          <span className="hide-sm">SUBJECT: A. KARTIK</span>
          <span className="gold">TARGET: {beats[active].callsign}</span>
          <span className="r">{String(active + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* radar */}
      <div className="mk-radar" aria-hidden="true">
        {CHAPTERS.map((ch, i) => (
          <span
            key={ch}
            className={`blip ${activeChapter === ch ? 'on' : ''}`}
            style={{ left: `${26 + (i % 3) * 24}%`, top: `${32 + Math.floor(i / 3) * 30}%` }}
          />
        ))}
      </div>

      {/* beats */}
      {beats.map((b, i) => (
        <TargetBeat
          key={b.code}
          vp={vp}
          index={i}
          total={total}
          code={b.code}
          callsign={b.callsign}
          cardLabel={b.cardLabel}
          title={b.title}
          titleKw={b.titleKw}
          sub={b.sub}
          anchor={ANCHORS[i % ANCHORS.length]}
          targetLines={LINES[i % LINES.length]}
          wide={b.kind === 'profile'}
        >
          {renderBody(b)}
        </TargetBeat>
      ))}

      <div className="mk-hint">scroll · ↑ ↓ to acquire next target</div>
    </div>
  )
}

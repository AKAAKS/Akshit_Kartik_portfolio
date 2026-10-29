import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/* Counts from 0 up to `value` once it scrolls into view.
 * Reduced-motion jumps straight to the final value. */
/* `run` (optional) forces the count when it becomes true (e.g. a panel expanding),
 * bypassing the viewport observer. If omitted, counts when scrolled into view. */
export default function CountUp({ value, suffix = '', decimals = 0, duration = 1.4, className = '', run }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)
  const trigger = run !== undefined ? run : inView

  useEffect(() => {
    if (reduce) {
      setDisplay(value)
      return
    }
    if (!trigger) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, reduce, value, duration])

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

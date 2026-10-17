/* Reusable glass HUD panel with animated corner brackets. */
export default function HudPanel({ children, className = '', gold = false, ...rest }) {
  return (
    <div className={`hud ${gold ? 'gold' : ''} ${className}`} {...rest}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      {children}
    </div>
  )
}

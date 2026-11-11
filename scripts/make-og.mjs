/* Regenerates public/og.png from the landing section.
 *
 * The card is a photograph of the real page, not a second drawing of it.
 * Anything else would drift: the field is seeded, the nose is drawn from the
 * same geometry as the hull, and a hand-built copy would have to be kept in
 * step with both by hand and silently wouldn't be.
 *
 * Run it after anything that changes how the landing looks:
 *   npm run dev        (in one terminal)
 *   npm run og         (in another)
 *
 * Headless Chrome rather than Playwright or Puppeteer, because the browser
 * is already on the machine and this does not earn a 300MB dependency that
 * exists to be driven once a month.
 */
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const URL = process.argv[2] || 'http://localhost:5182/'
const OUT = resolve('public/og.png')

/* 1200x630 is the Open Graph size every platform agrees on. Captured at 2x
 * so it stays sharp on the retina displays most people will see it on, which
 * is why the file is 2400x1260 while the meta tags still say 1200x630 - the
 * tags describe the layout size, not the pixel count. */
const W = 1200
const H = 630

const CANDIDATES = [
  process.env.CHROME_PATH,
  /* Forward slashes on purpose. Node accepts them on Windows, and unlike
   * backslashes they survive being passed through a shell or a heredoc. */
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  `${process.env.PROGRAMFILES}/Google/Chrome/Application/chrome.exe`,
  `${process.env['PROGRAMFILES(X86)']}/Google/Chrome/Application/chrome.exe`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter((x) => x && !x.includes('undefined'))

const chrome = CANDIDATES.find((p) => existsSync(p))
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH to its executable.')
  process.exit(1)
}

try {
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    `--window-size=${W},${H}`,
    /* Fonts arrive after first paint and the name is set in one of them, so
     * the shot has to wait or it captures the fallback face. */
    '--virtual-time-budget=8000',
    `--screenshot=${OUT}`,
    URL,
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
} catch (e) {
  console.error(`Capture failed. Is the dev server up at ${URL}?`)
  process.exit(1)
}

console.log(`Wrote ${OUT} at ${W * 2}x${H * 2} from ${URL}`)

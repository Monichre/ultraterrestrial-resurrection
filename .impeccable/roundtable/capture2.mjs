import puppeteer from 'puppeteer-core'

const OUT = '/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection/.impeccable/roundtable'
const EXEC =
  '/Users/liamellis/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const BASE = 'http://localhost:6006/iframe.html?viewMode=story&id='
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: EXEC, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

await page.goto(BASE + 'features-research-canvas-case-files-connections-canvas--nimitz', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForSelector('.react-flow__node', { timeout: 90000 })
await sleep(1500)

// S3: open drawer via edge label pill (role=button div, or button)
const pill = await page.evaluate(() => {
  const el = [...document.querySelectorAll('[role="button"], button')].find((e) =>
    e.textContent.toLowerCase().includes('occurred'),
  )
  if (!el) return false
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  return true
})
await sleep(1100)
await page.screenshot({ path: `${OUT}/S3-drawer.png` })
console.log('S3 redone, pill:', pill)

// close drawer via its X button
const closed = await page.evaluate(() => {
  const x = [...document.querySelectorAll('button')].find((b) =>
    b.querySelector('svg.lucide-x'),
  )
  if (!x) return false
  x.click()
  return true
})
await sleep(800)
console.log('drawer closed:', closed)

// S5: pin — dblclick on clearly empty pane (bottom-left area, empty in all shots)
await page.mouse.click(700, 180, { clickCount: 2 })
await sleep(900)
const pinCount = await page.evaluate(
  () => document.querySelectorAll('.react-flow__node textarea').length,
)
const pinned = await page.evaluate(() => {
  const ta = document.querySelector('.react-flow__node textarea')
  if (!ta) return false
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value',
  ).set
  setter.call(ta, 'radar chain of custody — who had the tapes first?')
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  return true
})
await sleep(400)
await page.screenshot({ path: `${OUT}/S5-pin.png` })
console.log('S5 redone, pins:', pinCount, 'typed:', pinned)

await browser.close()
console.log('DONE')

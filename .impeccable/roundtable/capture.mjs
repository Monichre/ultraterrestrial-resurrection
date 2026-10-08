import puppeteer from 'puppeteer-core'

const OUT = '/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection/.impeccable/roundtable'
const EXEC =
  '/Users/liamellis/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const BASE = 'http://localhost:6006/iframe.html?viewMode=story&id='
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: EXEC,
  headless: true,
  args: ['--window-size=1440,900'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
page.on('console', (m) => {
  if (m.type() === 'error') console.log('PAGE-ERR:', m.text().slice(0, 200))
})

const clickText = async (sel, text) =>
  page.evaluate(
    (sel, text) => {
      const el = [...document.querySelectorAll(sel)].find((e) =>
        e.textContent.toLowerCase().includes(text.toLowerCase()),
      )
      if (!el) return false
      el.click()
      return true
    },
    sel,
    text,
  )

// ---- Nimitz journey ----
await page.goto(BASE + 'features-research-canvas-case-files-connections-canvas--nimitz', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForSelector('.react-flow__node', { timeout: 90000 })
await sleep(1200)
await page.screenshot({ path: `${OUT}/S1-opening.png` })
console.log('S1 done')

// S2: expand +1 chip on spy1
const expanded = await clickText('.react-flow__node button', '+1')
await sleep(1200)
await page.screenshot({ path: `${OUT}/S2-expanded.png` })
console.log('S2 done, expand clicked:', expanded)

// S3: open drawer via edge label pill
const pill = await clickText('.react-flow__edgelabel-renderer button', 'occurred')
await sleep(900)
await page.screenshot({ path: `${OUT}/S3-drawer.png` })
console.log('S3 done, pill clicked:', pill)

// close drawer (X button)
await clickText('button', '') // noop safeguard
const closed = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')]
  const x = btns.find((b) => b.querySelector('svg.lucide-x'))
  if (!x) return false
  x.click()
  return true
})
await sleep(700)
console.log('drawer closed:', closed)

// S4: ego-network on the event node
await page.evaluate(() => {
  const node = document.querySelector('.react-flow__node[data-id="event_nimitz"]')
  if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
})
await sleep(900)
await page.screenshot({ path: `${OUT}/S4-egonet.png` })
console.log('S4 done')

// clear focus: click pane, then S5: dblclick to pin
await page.mouse.click(1100, 700, { clickCount: 1 })
await sleep(400)
await page.mouse.click(1050, 420, { clickCount: 2 })
await sleep(800)
// type into the pin textarea
const pinned = await page.evaluate(() => {
  const ta = document.querySelector('.react-flow__node textarea')
  if (!ta) return false
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
  setter.call(ta, 'radar chain of custody — who had the tapes first?')
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  return true
})
await sleep(400)
await page.screenshot({ path: `${OUT}/S5-pin.png` })
console.log('S5 done, pin typed:', pinned)

// S6: reveal weak tiers (Inferred, Unverified, Disconfirmed)
for (const t of ['Inferred', 'Unverified', 'Disconfirmed']) {
  await clickText('button', t)
  await sleep(250)
}
await sleep(1000)
await page.screenshot({ path: `${OUT}/S6-tiers-revealed.png` })
console.log('S6 done')

// ---- other stories ----
await page.goto(BASE + 'features-research-canvas-case-files-connections-canvas--contested-heavy', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForSelector('.react-flow__node', { timeout: 90000 })
await sleep(1400)
await page.screenshot({ path: `${OUT}/S7-contested.png` })
console.log('S7 done')

await page.goto(BASE + 'features-research-canvas-case-files-connections-canvas--ego-net', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForSelector('.react-flow__node', { timeout: 90000 })
await sleep(1400)
await page.screenshot({ path: `${OUT}/S8-egonet-story.png` })
console.log('S8 done')

// mobile viewport check on opening
await page.setViewport({ width: 390, height: 844 })
await page.goto(BASE + 'features-research-canvas-case-files-connections-canvas--nimitz', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForSelector('.react-flow__node', { timeout: 90000 })
await sleep(1200)
await page.screenshot({ path: `${OUT}/S9-mobile.png` })
console.log('S9 done')

await browser.close()
console.log('ALL DONE')

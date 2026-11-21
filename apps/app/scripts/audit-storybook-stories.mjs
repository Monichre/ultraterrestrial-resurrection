#!/usr/bin/env bun
/**
 * Runtime audit of Storybook stories against a running server.
 * Usage: bun scripts/audit-storybook-stories.mjs [baseUrl=http://localhost:6006]
 *
 * Success signal: body.sb-show-main (Storybook preview rendered)
 * Failure signal: body.sb-show-errordisplay, pageerror, or module-resolution console errors
 */
import {spawn} from 'node:child_process'
import {mkdir, writeFile} from 'node:fs/promises'
import {createRequire} from 'node:module'
import path from 'node:path'

const BASE = process.argv[2] || 'http://localhost:6006'
const CONCURRENCY = Number(process.env.STORYBOOK_AUDIT_CONCURRENCY || 2)
const TIMEOUT_MS = Number(process.env.STORYBOOK_AUDIT_TIMEOUT_MS || 45000)
/** When true (default), audit one story per importPath to cut load. Set STORYBOOK_AUDIT_ALL=1 for every story. */
const ONE_PER_FILE = process.env.STORYBOOK_AUDIT_ALL !== '1'
const OUT_DIR = path.join(process.cwd(), '.storybook-audit')
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const require = createRequire(import.meta.url)

const NOISE =
  /Download the React DevTools|favicon|NetInfo|ResizeObserver|punycode|DevTools|Act\(.*deprecated|Warning:|\[HMR\]|webpack-dev-server|sockjs|hot-update/i

async function ensurePuppeteer() {
  try {
    return require('puppeteer-core')
  } catch {
    console.log('Installing puppeteer-core…')
    await new Promise((resolve, reject) => {
      const child = spawn('bun', ['add', '-d', 'puppeteer-core'], {
        cwd: process.cwd(),
        stdio: 'inherit',
      })
      child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`bun add failed: ${code}`))))
    })
    return require('puppeteer-core')
  }
}

function classify(errors) {
  const blob = errors.join('\n')
  if (/Module not found|Can't resolve|Cannot find module/i.test(blob)) return 'module-not-found'
  if (/ModuleBuildError|Module parse failed|SyntaxError|Unexpected token/i.test(blob))
    return 'compile-error'
  if (/TypeError|ReferenceError|is not a function|is not defined|Invariant/i.test(blob))
    return 'runtime-error'
  if (/Couldn't find story|No story matched|story not found/i.test(blob)) return 'missing-story'
  if (/Navigation timeout|TimeoutError|timed out|waiting for function/i.test(blob)) return 'timeout'
  if (/Error:/i.test(blob)) return 'error'
  return 'unknown'
}

async function loadIndex() {
  const res = await fetch(`${BASE}/index.json`)
  if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`)
  const data = await res.json()
  const entries = Object.values(data.entries || {})
  return entries.filter((e) => e.type === 'story')
}

async function auditStory(browser, story) {
  const page = await browser.newPage()
  const pageErrors = []
  const hardConsole = []

  page.on('pageerror', (err) => pageErrors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (NOISE.test(text)) return
    if (
      /Module not found|Can't resolve|ModuleBuildError|TypeError|ReferenceError|Invariant Violation|Unhandled Promise/i.test(
        text
      )
    ) {
      hardConsole.push(text)
    }
  })

  const url = `${BASE}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`
  const result = {
    id: story.id,
    title: story.title,
    name: story.name,
    importPath: story.importPath,
    ok: true,
    category: null,
    errors: [],
    url,
  }

  try {
    await page.goto(url, {waitUntil: 'load', timeout: TIMEOUT_MS})

    // Wait until Storybook finishes preparing (main or error)
    await page.waitForFunction(
      () =>
        document.body.classList.contains('sb-show-main') ||
        document.body.classList.contains('sb-show-errordisplay'),
      {timeout: TIMEOUT_MS}
    )

    await new Promise((r) => setTimeout(r, 200))

    const probe = await page.evaluate(() => {
      const showingError = document.body.classList.contains('sb-show-errordisplay')
      const showingMain = document.body.classList.contains('sb-show-main')
      const errMsg = document.querySelector('#error-message')?.textContent?.trim() || ''
      const errStack = document.querySelector('#error-stack')?.textContent?.trim() || ''
      const errCode =
        document.querySelector('.sb-errordisplay_code')?.textContent?.trim() || ''
      return {
        showingError,
        showingMain,
        errorText: (errMsg || errCode || errStack).slice(0, 1500),
      }
    })

    const errors = [...pageErrors, ...hardConsole]
    if (probe.showingError) {
      errors.unshift(probe.errorText || 'Storybook error display active (no message)')
    }

    // pageerrors during a successful main render can be soft — only fail if error UI or hard module errors
    if (probe.showingError || hardConsole.length > 0) {
      result.ok = false
      result.errors = [...new Set(errors)].slice(0, 6)
      result.category = classify(result.errors)
    } else if (pageErrors.length > 0 && !probe.showingMain) {
      result.ok = false
      result.errors = [...new Set(errors)].slice(0, 6)
      result.category = classify(result.errors)
    } else if (!probe.showingMain && !probe.showingError) {
      result.ok = false
      result.category = 'timeout'
      result.errors = ['Preview never entered sb-show-main or sb-show-errordisplay']
    }
  } catch (err) {
    result.ok = false
    result.category = 'timeout'
    result.errors = [err.message]
  } finally {
    await page.close().catch(() => {})
  }

  return result
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length)
  let cursor = 0
  async function run() {
    while (cursor < items.length) {
      const i = cursor++
      results[i] = await worker(items[i], i)
    }
  }
  await Promise.all(Array.from({length: Math.min(concurrency, items.length)}, () => run()))
  return results
}

async function main() {
  console.log(`Auditing Storybook at ${BASE}`)
  const allStories = await loadIndex()
  let stories = allStories
  if (ONE_PER_FILE) {
    const seen = new Set()
    stories = allStories.filter((s) => {
      if (seen.has(s.importPath)) return false
      seen.add(s.importPath)
      return true
    })
  }
  console.log(
    `Found ${allStories.length} stories; auditing ${stories.length}${ONE_PER_FILE ? ' (one per file)' : ''}`
  )

  const puppeteer = await ensurePuppeteer()
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  })

  let done = 0
  let failCount = 0
  const started = Date.now()
  const results = await mapPool(stories, CONCURRENCY, async (story) => {
    const result = await auditStory(browser, story)
    done++
    if (!result.ok) failCount++
    if (done % 25 === 0 || !result.ok) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(1)
      const mark = result.ok ? 'ok' : 'FAIL'
      console.log(
        `[${done}/${stories.length}] fails=${failCount} ${elapsed}s ${mark} ${story.id}`
      )
    }
    return result
  })

  await browser.close()

  const broken = results.filter((r) => !r.ok)
  const byCategory = {}
  const byTitle = {}
  const byImport = {}
  for (const r of broken) {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1
    byTitle[r.title] = (byTitle[r.title] || 0) + 1
    byImport[r.importPath] = (byImport[r.importPath] || 0) + 1
  }

  const report = {
    auditedAt: new Date().toISOString(),
    base: BASE,
    mode: ONE_PER_FILE ? 'one-per-file' : 'all-stories',
    catalogStories: allStories.length,
    totalStories: stories.length,
    brokenCount: broken.length,
    okCount: stories.length - broken.length,
    byCategory,
    topBrokenTitles: Object.entries(byTitle)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([title, count]) => ({title, count})),
    topBrokenFiles: Object.entries(byImport)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([importPath, count]) => ({importPath, count})),
    broken: broken.map((r) => ({
      id: r.id,
      title: r.title,
      name: r.name,
      importPath: r.importPath,
      category: r.category,
      errors: r.errors.slice(0, 3),
      url: r.url,
    })),
  }

  await mkdir(OUT_DIR, {recursive: true})
  const jsonPath = path.join(OUT_DIR, 'broken-stories.json')
  const mdPath = path.join(OUT_DIR, 'broken-stories.md')
  await writeFile(jsonPath, JSON.stringify(report, null, 2))

  const md = [
    `# Storybook Broken Stories Audit`,
    ``,
    `- **When:** ${report.auditedAt}`,
    `- **Server:** ${BASE}`,
    `- **Stories audited:** ${report.totalStories}`,
    `- **Broken:** ${report.brokenCount}`,
    `- **OK:** ${report.okCount}`,
    ``,
    `## By category`,
    ``,
    ...(Object.keys(byCategory).length
      ? Object.entries(byCategory).map(([k, v]) => `- \`${k}\`: ${v}`)
      : ['- _(none)_']),
    ``,
    `## Top broken titles`,
    ``,
    ...(report.topBrokenTitles.length
      ? report.topBrokenTitles.map((t) => `- **${t.title}** — ${t.count}`)
      : ['- _(none)_']),
    ``,
    `## Top broken files`,
    ``,
    ...(report.topBrokenFiles.length
      ? report.topBrokenFiles.map((t) => `- \`${t.importPath}\` — ${t.count}`)
      : ['- _(none)_']),
    ``,
    `## Broken stories`,
    ``,
    ...(broken.length
      ? broken.map(
          (r) =>
            `### \`${r.id}\`\n- **Title:** ${r.title} / ${r.name}\n- **File:** \`${r.importPath}\`\n- **Category:** ${r.category}\n- **URL:** ${r.url}\n- **Error:**\n\`\`\`\n${(r.errors[0] || 'unknown').slice(0, 800)}\n\`\`\`\n`
        )
      : ['_No broken stories detected._']),
  ].join('\n')

  await writeFile(mdPath, md)

  console.log('\n=== AUDIT SUMMARY ===')
  console.log(`OK: ${report.okCount}`)
  console.log(`Broken: ${report.brokenCount}`)
  console.log('By category:', byCategory)
  console.log(`Wrote ${jsonPath}`)
  console.log(`Wrote ${mdPath}`)

  if (broken.length > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8')
}

function listSources(relativeDir: string): string[] {
  return fs
    .readdirSync(path.join(rootDir, relativeDir))
    .filter((name) => /\.(ts|tsx|astro|css)$/.test(name))
    .map((name) => path.join(relativeDir, name))
}

// The feature cards are the `features` array in the grid's frontmatter:
// one `title:` and one `body:` line per card, in file order.
function featureCards(source: string): { title: string; body: string }[] {
  const start = source.search(/^const features\b/m)
  expect(start).toBeGreaterThan(0)
  const end = source.indexOf('] as const', start)
  const block = source.slice(start, end)
  const titles = [...block.matchAll(/^\s*title: (['"])(.*)\1,$/gm)].map((m) => m[2])
  const bodies = [...block.matchAll(/^\s*body: (['"])(.*)\1,$/gm)].map((m) => m[2])
  expect(titles.length).toBe(bodies.length)
  return titles.map((title, i) => ({ title, body: bodies[i] }))
}

const EM_DASH = '\u2014'
const WORD_GATE = /\b(proof|truth)\b/i
const ABOUT_EXCLUSION = 'source of truth for each release'

const CARD_TITLES = ['Policy engine', 'Cross-tool budgets', 'Prerequisites & evidence', 'Approvals', 'Tool-definition drift', 'Audit trail', 'Self-repair', 'Proxy, not a rewrite']
const TWO_CLAIMS = 'Require a successful prerequisite action. Require fresh application-provided evidence.'
const SITE_DESCRIPTION =
  'Helio is an open-source MCP governance proxy for policies, budgets, approvals, prerequisites, evidence, and audit trails. No agent or server code changes.'


// The home-page sweep from positioning.test.ts, plus the repo README.
const HOME_PAGE_FILES = [
  'src/pages/index.astro',
  'src/layouts/Layout.astro',
  'src/components/BaseHead.astro',
  'src/components/Header.astro',
  'src/components/Navbar.tsx',
  'src/components/Footer.astro',
  'src/components/DesignPartnerModal.astro',
  'src/components/analytics/CookieConsent.astro',
  'src/components/GoogleTag.astro',
  'src/components/Faqs.astro',
  'src/components/FeaturesGrid.astro',
  'src/components/PlatformLogos.astro',
  'src/components/CopyInstallCommand.astro',
  'src/components/ui/button.tsx',
  'README.md',
  ...listSources('src/components/helio-in-action'),
  ...listSources('src/components/why-helio-exists'),
]

// Files this door edits that carry no em dash on main; the theater data
// keeps four in pane strings, so it is checked on its diff lines only.
const EM_DASH_FREE_FILES = [
  'src/components/FeaturesGrid.astro',
  'src/pages/index.astro',
  'src/const.ts',
  'src/pages/about.astro',
  'README.md',
  '__tests__/positioning.test.ts',
  '__tests__/prerequisite-claims.test.ts',
]
const DIFFED_FILES = [...EM_DASH_FREE_FILES, 'src/components/helio-in-action/theater-data.ts']

describe('prerequisite claims (issue #394)', () => {
  const cards = featureCards(readSource('src/components/FeaturesGrid.astro'))

  it('T1 the grid keeps its eight cards in order, with the evidence card retitled', () => {
    expect(cards.map((c) => c.title)).toEqual(CARD_TITLES)
    for (const card of cards) {
      expect(card.title).not.toBe('Evidence & chains')
    }
  })

  it('T1b every card body stays at or under 180 characters', () => {
    for (const card of cards) {
      expect(card.body.length, card.title).toBeLessThanOrEqual(180)
    }
  })

  it('T2 chains and evidence are two claims with the presence-and-freshness disclaimer', () => {
    const body = cards[2]?.body ?? ''
    expect(body).toContain(TWO_CLAIMS)
    expect(body).toContain('presence and freshness')
    expect(body).not.toContain('verified lookup')
  })

  it('T3 the budget card says across servers', () => {
    expect(cards[1]?.title ?? '').toBe('Cross-tool budgets')
    expect(cards[1]?.body ?? '').toContain('across servers')
  })

  it('T4 the approval card puts the arguments on the ticket', () => {
    expect(cards[3]?.body ?? '').toContain('arguments')
  })

  it('T5 the site description names prerequisites and evidence', () => {
    const line = readSource('src/const.ts')
      .split('\n')
      .find((l) => l.startsWith('export const SITE_DESCRIPTION'))

    expect(line).toBe(`export const SITE_DESCRIPTION = '${SITE_DESCRIPTION}'`)
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160)
    expect(line).not.toContain('evidence checks')
  })

  it('T6 the pricing list says prerequisites and evidence', () => {
    const line = readSource('src/pages/index.astro')
      .split('\n')
      .find((l) => l.includes('const openSourceFeatures'))

    expect(line).toContain("'Prerequisites and evidence'")
    expect(line).not.toContain("'Evidence grounding'")
  })

  it('T7 the about note names prerequisite chains beside evidence checks', () => {
    expect(readSource('src/pages/about.astro')).toContain('prerequisite chains, evidence checks')
  })

  it('T9 the theater evidence scene pairs the evidence block with an allow rule', () => {
    const source = readSource('src/components/helio-in-action/theater-data.ts')
    const start = source.indexOf("id: 'evidence'")
    const end = source.indexOf("id: 'approvals'", start)
    const scene = source.slice(start, end)
    const policyLine = scene.split('\n').find((l) => l.includes('policy:')) ?? ''

    expect(policyLine).toContain('requires: [orders.lookup]')
    expect(policyLine).toContain('action: allow')
    expect(policyLine).not.toContain('action: deny')
  })

  it('T10 the repo README names prerequisites beside evidence checks', () => {
    const line3 = readSource('README.md').split('\n')[2] ?? ''
    expect(line3).toContain('prerequisites, evidence checks')
  })

  it('T11 no proof or truth on the home page or the README', () => {
    for (const file of HOME_PAGE_FILES) {
      expect(readSource(file), file).not.toMatch(WORD_GATE)
    }

    const about = readSource('src/pages/about.astro')
    expect(about).toContain(ABOUT_EXCLUSION)
    expect(about.split(ABOUT_EXCLUSION).join('')).not.toMatch(WORD_GATE)
  })

  it('T12 no em dash in the edited files or on the added lines against main', () => {
    for (const file of EM_DASH_FREE_FILES) {
      expect(readSource(file), file).not.toContain(EM_DASH)
    }

    const diff = execFileSync('git', ['diff', 'main', '--', ...DIFFED_FILES], { cwd: rootDir, encoding: 'utf8' })
    const added = diff.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    for (const line of added) {
      expect(line).not.toContain(EM_DASH)
    }
  })
})

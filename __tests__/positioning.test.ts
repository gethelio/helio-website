import fs from 'node:fs'
import path from 'node:path'
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

// The hero is the <h1> line and the paragraph on the line after it.
function heroLines(source: string): { h1: string[]; subhead: string } {
  const lines = source.split('\n')
  const h1 = lines.filter((line) => line.includes('<h1'))
  const subhead = lines[lines.findIndex((line) => line.includes('<h1')) + 1] ?? ''
  return { h1, subhead }
}

const HERO_H1 = 'Useful autonomy.<br /> Not unlimited authority.'
const HERO_SUBHEAD =
  'Helio sits between your agents and the tools they use. It lets routine actions run automatically, requires approval for risky ones, enforces budgets and prerequisites, and keeps a decision trail for every action.'
const WHY_H2 = 'Govern the action. Not the prompt.'
const SITE_TITLE = 'Helio | Governance for MCP agents: useful autonomy'
const EM_DASH = '\u2014'

describe('positioning (issue #393)', () => {
  it('the hero leads with the outcome', () => {
    const h1Lines = heroLines(readSource('src/pages/index.astro')).h1

    expect(h1Lines.length).toBe(1)
    expect(h1Lines[0]).toContain(HERO_H1)
    expect(h1Lines[0]).not.toContain('Govern the action')
  })

  it('the hero subhead names the four controls without an em dash', () => {
    const { h1, subhead } = heroLines(readSource('src/pages/index.astro'))

    expect(subhead).toContain(HERO_SUBHEAD)
    for (const line of [...h1, subhead]) {
      expect(line).not.toContain(EM_DASH)
    }
  })

  it('the mechanism line heads the Why section', () => {
    const component = readSource('src/components/why-helio-exists/why-helio-exists.tsx')
    const h2Lines = component.split('\n').filter((line) => line.includes('<h2'))

    expect(h2Lines.length).toBe(1)
    expect(h2Lines[0]).toContain(WHY_H2)

    const data = readSource('src/components/why-helio-exists/why-data.ts')
    for (const title of [
      'Ignored. Jailbroken. Forgotten.',
      'One platform cannot govern the whole stack.',
      'A chat log is not an audit trail.',
      'The call never left.',
    ]) {
      expect(data).toContain(title)
    }
  })

  it('the title tag keeps governance and says the outcome', () => {
    const titleLine = readSource('src/const.ts')
      .split('\n')
      .find((line) => line.startsWith('export const SITE_TITLE'))

    expect(titleLine).toBe(`export const SITE_TITLE = '${SITE_TITLE}'`)
    expect(SITE_TITLE.length).toBeLessThanOrEqual(60)
    expect(SITE_TITLE).toContain('Governance')
  })

  it('no Generate, Simulate, or Apply on the home page', () => {
    const files = [
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
      ...listSources('src/components/helio-in-action'),
      ...listSources('src/components/why-helio-exists'),
    ]

    expect(files.length).toBeGreaterThanOrEqual(31)
    for (const file of files) {
      expect(readSource(file), file).not.toMatch(/\b(generate|simulate|apply|applies|applied)\b/i)
    }
  })
})

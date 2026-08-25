import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8')
}

describe('mobile regressions', () => {
  it('keeps design partner fields at 16px on mobile to prevent iOS auto-zoom', () => {
    const source = readSource('src/components/DesignPartnerModal.astro')

    for (const id of ['dp-email', 'dp-agent-does', 'dp-tools']) {
      const classes = source.match(new RegExp(`id="${id}"[^>]*class="([^"]+)"`))?.[1]

      expect(classes, `missing classes for #${id}`).toBeDefined()
      expect(classes).toContain('!text-base')
      expect(classes).toContain('sm:!text-sm')
    }
  })

  it('uses LinkedIn supported web sharing without custom mobile deep links', () => {
    const source = readSource('src/pages/blog/[...slug].astro')

    expect(source).toContain('https://www.linkedin.com/sharing/share-offsite/')
    expect(source).toContain('href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer"')
    expect(source).not.toContain('linkedin://')
    expect(source).not.toContain('intent://')
    expect(source).not.toContain('data-share="linkedin"')
  })
})

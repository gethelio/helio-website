// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

/** @type {Map<string, Date>} */
const urlDateMap = new Map()

// Read blog posts and extract dates from frontmatter
const blogDir = './src/content/blog'
if (fs.existsSync(blogDir)) {
    fs.readdirSync(blogDir).forEach((file) => {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
            const filePath = path.join(blogDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const { data } = matter(content)
            const slug = file.replace(/\.mdx?$/, '')
            const url = `https://www.helio.so/blog/${slug}/`
            const date = data.updatedDate ? new Date(data.updatedDate) : new Date(data.pubDate)
            urlDateMap.set(url, date)
        }
    })
}

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        mdx(),
        sitemap({
            serialize(item) {
                // Use content date if available, otherwise use current build date
                const contentDate = urlDateMap.get(item.url)
                item.lastmod = contentDate || new Date()
                return item
            },
        }),
        react(),
    ],
    site: 'https://www.helio.so',
    trailingSlash: 'always',
    redirects: {
        '/blog/2': '/blog/',
    },
    prefetch: {
        prefetchAll: true,
    },
    adapter: vercel(),
})
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

export const blogCategories = ['Guide', 'Governance', 'Security', 'MCP', 'Agent'] as const
export type BlogCategory = (typeof blogCategories)[number]

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        seoTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        slug: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        heroImageAlt: z.string().optional(),
        author: z.string().default('Oli Guei'),
        authorImage: z.string().optional(),
        category: z.enum(blogCategories).default('Governance'),
        categories: z.array(z.enum(blogCategories)).min(1).optional(),
    }),
})

export const collections = { blog }

export function blogSlug(post: { id: string; data: { slug?: string } }) {
    return post.data.slug ?? post.id
}

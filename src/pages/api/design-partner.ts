import type { APIRoute } from 'astro'
import dotenv from 'dotenv'
import path from 'path'
import { extractClientIp, handleDesignPartnerPost } from '../../lib/design-partner/handle-post'

const rootDir = process.cwd()
dotenv.config({ path: path.join(rootDir, '.env') })
dotenv.config({ path: path.join(rootDir, '.env.local'), override: true })
dotenv.config({ path: path.join(rootDir, '.env.development.local'), override: true })

export const prerender = false

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value
  })

  try {
    const result = await handleDesignPartnerPost(body, extractClientIp(headers, clientAddress))
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Design partner route error:', error)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const ALL: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}

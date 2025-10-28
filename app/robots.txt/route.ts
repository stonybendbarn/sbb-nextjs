import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://stonybendbarn.com/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow product pages
Allow: /products/
Allow: /custom-orders
Allow: /gallery
Allow: /events
Allow: /inventory`

    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400'
      }
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    return new Response('Error generating robots.txt', { status: 500 })
  }
}

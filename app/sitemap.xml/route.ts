import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Fetch all products that should be included in sitemap
    const { rows: products } = await sql`
      SELECT id, name, category, updated_at
      FROM products 
      WHERE inc_products_page = true
      ORDER BY updated_at DESC
    `

    // Static pages
    const staticPages = [
      {
        url: 'https://stonybendbarn.com',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '1.0'
      },
      {
        url: 'https://stonybendbarn.com/products',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '0.9'
      },
      {
        url: 'https://stonybendbarn.com/custom-orders',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.8'
      },
      {
        url: 'https://stonybendbarn.com/gallery',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: '0.7'
      },
      {
        url: 'https://stonybendbarn.com/events',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.6'
      },
      {
        url: 'https://stonybendbarn.com/inventory',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: '0.8'
      },
      {
        url: 'https://stonybendbarn.com/project-files',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.6'
      }
    ]

    // Category pages - get most recent update date per category from products
    const categories = [
      'cutting-boards',
      'game-boards', 
      'cheese-boards',
      'coasters',
      'outdoor-items',
      'furniture',
      'bar-ware',
      'laser-engraving',
      'montessori',
      'barn-finds'
    ]

    // Group products by category and find most recent update date
    const categoryLastModified: Record<string, string> = {}
    products.forEach(product => {
      if (product.category && product.updated_at) {
        const existingDate = categoryLastModified[product.category]
        const productDate = new Date(product.updated_at).toISOString()
        if (!existingDate || productDate > existingDate) {
          categoryLastModified[product.category] = productDate
        }
      }
    })

    const categoryPages = categories.map(category => ({
      url: `https://stonybendbarn.com/products/${category}`,
      lastModified: categoryLastModified[category] || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: '0.8'
    }))

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  
  ${categoryPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}

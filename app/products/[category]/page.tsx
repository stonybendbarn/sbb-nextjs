import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ProductCategoryNavigation from "@/components/product-category-navigation"
import { Button } from "@/components/ui/button"
import { GraduationCap, Search, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { sql } from "@vercel/postgres"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { StructuredData } from "@/components/StructuredData"
import { Testimonials } from "@/components/testimonials"
import { fetchTestimonials, getTestimonialsByCategory } from "@/lib/testimonials-data"
import type { Metadata } from "next"

// Force dynamic rendering to ensure fresh data from database
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Category metadata for page headers
const categoryMetadata: Record<
  string,
  {
    name: string
    description: string
  }
> = {
  "cutting-boards": {
    name: "End Grain Cutting Boards",
    description: "Premium end grain cutting boards crafted from select hardwoods for durability and beauty.",
  },
  "game-boards": {
    name: "Game Boards",
    description: "Handcrafted game boards that combine function with artistic design.",
  },
  "cheese-boards": {
    name: "Cheese & Charcuterie Boards",
    description: "Elegant serving boards perfect for entertaining and special occasions.",
  },
  coasters: {
    name: "Coasters",
    description: "Protective and stylish coasters for your furniture.",
  },
  "outdoor-items": {
    name: "Outdoor Items",
    description: "Weather-resistant pieces designed for outdoor enjoyment.",
  },
  furniture: {
    name: "Furniture",
    description: "Custom furniture pieces that become family heirlooms.",
  },
  "bar-ware": {
    name: "Bar & Kitchen Ware",
    description: "Sophisticated accessories for the home bar enthusiast.",
  },
  "laser-engraving": {
    name: "Laser Engraving",
    description: "Custom laser engraving on wood - from maps and plaques to personalized coasters and bottle openers. Showcasing our custom work capabilities.",
  },
  montessori: {
    name: "Montessori Materials",
    description: "Custom-crafted Montessori materials designed to support child development and learning. Each piece is made to order with attention to educational principles and child safety.",
  },
  "barn-finds": {
    name: "Barn Finds!",
    description: "Mistakes happen, and sometimes items don't meet our high standards. These one-of-a-kind pieces are offered at discounted prices with full transparency.",
  },
}

interface Product {
  id: string
  name: string
  description: string
  size: string
  price_cents: number
  sale_price_cents: number | null
  images: string[] | string | null
  stock_status: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  seo_meta_title?: string
  seo_meta_description?: string
}

// Function to generate SEO metadata for category pages
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryInfo = categoryMetadata[params.category]
  
  if (!categoryInfo) {
    return {
      title: "Category Not Found | Stony Bend Barn",
      description: "The requested category could not be found."
    }
  }

  // Fetch products to get SEO data
  let products: Product[] = []
  try {
    const result = await sql`
      SELECT 
        name,
        seo_title,
        seo_description,
        seo_keywords,
        seo_meta_title,
        seo_meta_description
      FROM products
      WHERE category = ${params.category}
        AND inc_products_page = true
      LIMIT 5
    `
    products = result.rows as Product[]
  } catch (error) {
    console.error("Error fetching products for metadata:", error)
  }

  // Generate SEO content
  const categoryName = categoryInfo.name
  const categoryDescription = categoryInfo.description
  
  // Create enhanced title
  const title = `Premium ${categoryName} | Handcrafted Woodworking | Stony Bend Barn`
  
  // Create enhanced description
  const productNames = products.map(p => p.name).join(", ")
  const description = `Discover our collection of ${categoryName.toLowerCase()}. ${categoryDescription} Handcrafted from premium hardwoods by skilled artisans at Stony Bend Barn. Custom sizes available. ${productNames ? `Featured items: ${productNames}.` : ''}`
  
  // Create keywords
  const keywords = [
    categoryName.toLowerCase(),
    "handcrafted",
    "custom woodworking",
    "premium hardwood",
    "artisan",
    "Stony Bend Barn"
  ].join(", ")

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Stony Bend Barn"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  }
}

// Function to get the appropriate icon for each category
function getCategoryIcon(category: string) {
  switch (category) {
    case 'montessori':
      return <GraduationCap className="h-8 w-8 text-primary" />
    case 'barn-finds':
      return <Search className="h-8 w-8 text-primary" />
    default:
      return <ShoppingBag className="h-8 w-8 text-primary" />
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryInfo = categoryMetadata[params.category]

  if (!categoryInfo) {
    notFound()
  }

  // Fetch products from database
  let products: Product[] = []
  try {
    const result = await sql`
      SELECT 
        id,
        name,
        description,
        size,
        price_cents,
        sale_price_cents,
        stock_status,
        images,
        shipping_cents
      FROM products
      WHERE category = ${params.category}
        AND inc_products_page = true
      ORDER BY price_cents DESC
    `
    products = result.rows as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
  }

  const formatPrice = (cents: number): string => {
    return "$" + (cents / 100).toLocaleString()
  }

  // Get testimonials for this category from database
  const allTestimonials = await fetchTestimonials()
  const categoryTestimonials = getTestimonialsByCategory(params.category, allTestimonials)

  return (
    <div className="min-h-screen">
      <StructuredData products={products} category={params.category} categoryName={categoryInfo.name} />
      <Navigation />

      {/* Category Header */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {params.category === 'barn-finds' ? <Search className="h-8 w-8 text-primary" /> : getCategoryIcon(params.category)}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance mb-6">
              {categoryInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {params.category !== 'montessori' && (
            <ProductCategoryNavigation currentCategory={params.category} />
          )}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {products.map((product, index) => {
                // Handle images - Vercel Postgres returns JSONB as parsed JavaScript values
                let images: string[] = []
                
                // Handle different data types from database
                if (Array.isArray(product.images)) {
                  images = product.images.filter(img => img && typeof img === 'string')
                } else if (typeof product.images === 'string') {
                  try {
                    const parsed = JSON.parse(product.images)
                    images = Array.isArray(parsed) ? parsed.filter(img => img && typeof img === 'string') : []
                  } catch (e) {
                    images = []
                  }
                }
                
                return (
                  <div key={product.id || index} className="flex flex-col">
                    {/* Product Image */}
                    <div className="mb-6">
                      <ProductImageCarousel images={images} alt={product.name} />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{product.name}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 flex-1">{product.description}</p>
                      <p className="text-foreground">Size: <span className="text-muted-foreground leading-relaxed mb-4 flex-1">{product.size}</span></p>
                      <div className="space-y-3">
                        <p className="text-lg font-semibold text-primary">Starting Price: {formatPrice(product.price_cents)}</p>
                        <div className="flex gap-3">
                          <Button asChild className="flex-1">
                            <Link href="/custom-orders">Order Custom</Link>
                          </Button>
                          <Button asChild variant="outline" className="flex-1 bg-transparent">
                            <Link href="mailto:stonybendbarn@gmail.com?subject=Quote Request">Request Quote</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section (only show if there are testimonials for this category) */}
      {categoryTestimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Testimonials
              testimonials={categoryTestimonials}
              title="Customer Reviews"
              description={`See what customers are saying about our ${categoryInfo.name.toLowerCase()}`}
              variant="grid"
              maxDisplay={3}
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            {params.category === 'montessori' ? 'Ready to Order Montessori Materials?' : params.category === 'barn-finds' ? 'Found Something You Like?' : 'Want something custom?'}
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            {params.category === 'montessori' 
              ? 'Each Montessori material is custom-crafted to order with attention to educational principles and child safety. Lead times vary by complexity.'
              : params.category === 'barn-finds'
              ? 'These items are one-of-a-kind and won\'t be restocked. All sales are final, but we guarantee they\'re still quality woodworking!'
              : 'We can create a unique piece tailored to your exact specifications.'
            }
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href={params.category === 'barn-finds' ? "/inventory" : "/custom-orders"}>
              {params.category === 'montessori' ? 'Start Custom Order' : params.category === 'barn-finds' ? 'Shop All Inventory' : 'Request Custom Order'}
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

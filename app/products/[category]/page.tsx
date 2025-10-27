import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { sql } from "@vercel/postgres"
import { ProductImageCarousel } from "@/components/product-image-carousel"

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

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Category Header */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
                {categoryInfo.name}
              </h1>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {products.map((product, index) => {
                // Handle images - could be string[], string, or parsed JSON
                let images: string[] = []
                if (Array.isArray(product.images)) {
                  images = product.images
                } else if (typeof product.images === 'string') {
                  try {
                    images = JSON.parse(product.images)
                  } catch {
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

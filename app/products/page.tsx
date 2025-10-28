// Products folder
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ProductCategoryNavigation from "@/components/product-category-navigation"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

const productCategories = [
  {
    id: "cutting-boards",
    name: "End Grain Cutting Boards",
    image: "/images/cutting-boards/eg-pad-ash.jpeg",
  },
  {
    id: "game-boards",
    name: "Game Boards",
    image: "/images/game-boards/gb-chess-wal-map.jpeg",
  },
  {
    id: "cheese-boards",
    name: "Cheese & Charcuterie Boards",
    image: "/images/cheese-boards/cbeg-chaos.jpeg",
  },
  {
    id: "coasters",
    name: "Coasters",
    image: "/images/coasters/goncalo-box2.jpeg",
  },
  {
    id: "outdoor-items",
    name: "Outdoor Items",
    image: "/images/outdoor-items/IMG_6584.jpeg",
  },
  {
    id: "furniture",
    name: "Furniture",
    image: "/images/furniture/tab-mah-map-ebo.jpeg",
  },
  {
    id: "bar-ware",
    name: "Bar & Kitchen Ware",
    image: "/images/bar-ware/chaos-lazysusan.jpeg",
  },
  {
    id: "laser-engraving",
    name: "Laser Engraving",
    image: "/images/laser-engraving/asheville.jpeg",
  },
]

export const metadata: Metadata = {
  title: "Handcrafted Wood Products | Custom Woodworking | Stony Bend Barn",
  description: "Explore our collection of handcrafted wood products including cutting boards, game boards, furniture, and more. Each piece is custom-crafted from premium hardwoods by skilled artisans at Stony Bend Barn.",
  keywords: "handcrafted wood products, custom woodworking, cutting boards, game boards, furniture, artisan, premium hardwood, Stony Bend Barn",
  openGraph: {
    title: "Handcrafted Wood Products | Custom Woodworking | Stony Bend Barn",
    description: "Explore our collection of handcrafted wood products including cutting boards, game boards, furniture, and more. Each piece is custom-crafted from premium hardwoods by skilled artisans at Stony Bend Barn.",
    type: "website",
    siteName: "Stony Bend Barn"
  },
  twitter: {
    card: "summary_large_image",
    title: "Handcrafted Wood Products | Custom Woodworking | Stony Bend Barn",
    description: "Explore our collection of handcrafted wood products including cutting boards, game boards, furniture, and more. Each piece is custom-crafted from premium hardwoods by skilled artisans at Stony Bend Barn."
  }
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Explore our collection of handcrafted wood products, each piece made with care and attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCategoryNavigation showAllProducts={false} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white text-center text-balance">
                    {category.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            Don't see what you're looking for?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            We specialize in custom orders. Let us create something unique just for you.
          </p>
          <Link
            href="/custom-orders"
            className="inline-flex items-center justify-center rounded-md bg-secondary px-8 py-3 text-base font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            Request Custom Order
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

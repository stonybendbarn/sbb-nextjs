import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

const productCategories = [
  {
    id: "end-grain-cutting-boards",
    name: "End Grain Cutting Boards",
    image: "end grain cutting board with checkerboard pattern",
  },
  {
    id: "game-boards",
    name: "Game Boards",
    image: "wooden game board with chess pieces",
  },
  {
    id: "cheese-boards",
    name: "Cheese Boards",
    image: "wooden cheese board with handle and striped pattern",
  },
  {
    id: "coasters",
    name: "Coasters",
    image: "wooden coaster set in holder",
  },
  {
    id: "outdoor-items",
    name: "Outdoor Items",
    image: "outdoor wooden furniture on patio",
  },
  {
    id: "furniture",
    name: "Furniture",
    image: "rustic wooden dining table",
  },
  {
    id: "bar-ware",
    name: "Bar Ware",
    image: "wooden bottle opener and wine accessories",
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={`/.jpg?key=thkcq&height=600&width=600&query=${category.image}`}
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

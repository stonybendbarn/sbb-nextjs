import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"

const categoryData: Record<
  string,
  {
    name: string
    description: string
    products: Array<{
      name: string
      description: string
      size: string
      price: string
      image: string
    }>
  }
> = {
  "end-grain-cutting-boards": {
    name: "End Grain Cutting Boards",
    description: "Premium end grain cutting boards crafted from select hardwoods for durability and beauty.",
    products: [
      {
        name: "3D Waffle End Grain Board",
        description:
          'The 3D Waffle End Grain Board is made with a dark, medium, and light wood to create the 3D illusion. The board can be made to any size but is typically 12"x18"x 1.5".',
        size: '12"x18"x 1.5"',
        price: "$325",
        image: "3D waffle pattern end grain cutting board",
      },
      {
        name: "Weave End Grain Board",
        description:
          'The Weave End Grain Board is made with two contrasting woods to give the illusion of a weave though all lines are straight. The board can be made to any size but is typically 12"x18"x 1.5".',
        size: '12"x18"x 1.5"',
        price: "$275",
        image: "weave pattern end grain cutting board",
      },
      {
        name: "Stair Step End Grain Board",
        description:
          'The Stair Step End Grain Board is made with two contrasting woods to highlight the stair step pattern. The board can be made to any size but is typically 12"x18"x 1.5".',
        size: '12"x18"x 1.5"',
        price: "$275",
        image: "stair step pattern end grain cutting board",
      },
      {
        name: "Checkerboard End Grain Board",
        description:
          "Classic checkerboard pattern with alternating light and dark woods. Perfect for everyday use and makes a beautiful display piece.",
        size: '14"x20"x 1.5"',
        price: "$295",
        image: "checkerboard pattern end grain cutting board",
      },
    ],
  },
  "game-boards": {
    name: "Game Boards",
    description: "Handcrafted game boards that combine function with artistic design.",
    products: [
      {
        name: "Chess Board",
        description: "Traditional chess board with contrasting woods and smooth finish. Includes storage for pieces.",
        size: '16"x16"',
        price: "$195",
        image: "handcrafted wooden chess board",
      },
      {
        name: "Checkers Board",
        description: "Classic checkers design with beautiful wood grain patterns.",
        size: '14"x14"',
        price: "$145",
        image: "wooden checkers board",
      },
      {
        name: "Cribbage Board",
        description: "Elegant cribbage board with brass pegs and card storage.",
        size: '12"x4"',
        price: "$85",
        image: "wooden cribbage board",
      },
    ],
  },
  "cheese-boards": {
    name: "Cheese Boards",
    description: "Elegant serving boards perfect for entertaining and special occasions.",
    products: [
      {
        name: "Striped Cheese Board with Handle",
        description:
          "Beautiful striped pattern with integrated handle for easy serving. Perfect for charcuterie and cheese displays.",
        size: '16"x10"',
        price: "$95",
        image: "striped wooden cheese board with handle",
      },
      {
        name: "Round Cheese Board",
        description: "Perfect for parties and gatherings with rotating base option.",
        size: '12" diameter',
        price: "$75",
        image: "round wooden cheese board",
      },
      {
        name: "Live Edge Serving Board",
        description: "Natural edge for rustic elegance, each piece is unique.",
        size: "Varies",
        price: "$125",
        image: "live edge wooden serving board",
      },
    ],
  },
  coasters: {
    name: "Coasters",
    description: "Protective and stylish coasters for your furniture.",
    products: [
      {
        name: "Coaster Set with Holder",
        description:
          "Set of six matching coasters with beautiful wooden holder. Protects surfaces while adding natural beauty to your home.",
        size: '4"x4" each',
        price: "$65",
        image: "wooden coaster set in holder",
      },
      {
        name: "Coaster Set (4)",
        description: "Set of four matching coasters with contrasting wood patterns.",
        size: '4"x4" each',
        price: "$45",
        image: "set of four wooden coasters",
      },
      {
        name: "Custom Engraved Coasters",
        description: "Personalized with your design, logo, or monogram.",
        size: '4"x4" each',
        price: "$75",
        image: "custom engraved wooden coasters",
      },
    ],
  },
  "outdoor-items": {
    name: "Outdoor Items",
    description: "Weather-resistant pieces designed for outdoor enjoyment.",
    products: [
      {
        name: "Adirondack Chair",
        description: "Classic outdoor seating built to last with weather-resistant finish.",
        size: "Standard",
        price: "$285",
        image: "wooden adirondack chair",
      },
      {
        name: "Picnic Table",
        description: "Durable outdoor dining for family gatherings.",
        size: "6 feet",
        price: "$425",
        image: "wooden picnic table",
      },
      {
        name: "Planter Box",
        description: "Cedar planter boxes in various sizes for your garden.",
        size: "Various sizes",
        price: "$95+",
        image: "wooden planter box",
      },
    ],
  },
  furniture: {
    name: "Furniture",
    description: "Custom furniture pieces that become family heirlooms.",
    products: [
      {
        name: "Dining Table",
        description: "Made to your specifications with choice of wood and finish.",
        size: "Custom",
        price: "$1,200+",
        image: "rustic wooden dining table",
      },
      {
        name: "Coffee Table",
        description: "Centerpiece for your living room with storage options available.",
        size: "Various",
        price: "$650+",
        image: "wooden coffee table",
      },
      {
        name: "Bookshelf",
        description: "Built-in or freestanding options to fit your space perfectly.",
        size: "Custom",
        price: "$800+",
        image: "wooden bookshelf",
      },
    ],
  },
  "bar-ware": {
    name: "Bar Ware",
    description: "Sophisticated accessories for the home bar enthusiast.",
    products: [
      {
        name: "Bottle Opener",
        description: "Wall-mounted or handheld with beautiful wood grain.",
        size: '6" length',
        price: "$25",
        image: "wooden bottle opener",
      },
      {
        name: "Wine Bottle Stopper",
        description: "Handturned with unique grain pattern, each one is unique.",
        size: "Standard",
        price: "$18",
        image: "wooden wine bottle stopper",
      },
      {
        name: "Flight Board",
        description: "Perfect for beer or wine tasting with friends.",
        size: '16"x6"',
        price: "$55",
        image: "wooden flight board",
      },
    ],
  },
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categoryData[params.category]

  if (!category) {
    notFound()
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
                {category.name}
              </h1>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {category.products.map((product, index) => (
              <div key={index} className="flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square mb-6 overflow-hidden rounded-lg">
                  <img
                    src={`/.jpg?height=600&width=600&query=${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{product.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-1">{product.description}</p>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-primary">Starting Price: {product.price}</p>
                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <Link href="/inventory">Check Availability</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 bg-transparent">
                        <Link href="/custom-orders">Customize</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">Want something custom?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            We can create a unique piece tailored to your exact specifications.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/custom-orders">Request Custom Order</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

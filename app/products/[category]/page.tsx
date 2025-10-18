//[category] \sbb-nextjs\app\products\[category]
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
  "cutting-boards": {
    name: "End Grain Cutting Boards",
    description: "Premium end grain cutting boards crafted from select hardwoods for durability and beauty.",
    products: [
      {
        name: "3D Waffle End Grain Board",
        description:
          "The 3D Waffle End Grain Board is made with a dark, medium, and light wood to create the 3D illusion.",          
        size: '12" x 18" x 1.5"',
        price: "$325",
        image: "/images/cutting-boards/eg-waffle.jpeg",
      },
      {
        name: "Weave End Grain Board",
        description:
          "The Weave End Grain Board is made with two contrasting woods to give the illusion of a weave though all lines are straight.",
        size: '12" x 18" x 1.5"',
        price: "$225",
        image: "/images/cutting-boards/eg-cherry-maple.jpeg",
      },
      {
        name: "Chess Board End Grain Board",
        description:
          "Classic chess board pattern with alternating light and dark woods. Perfect for everyday use and makes a beautiful display piece.",
        size: '18.75" x 19" x 2"',
        price: "$295",
        image: "/images/cutting-boards/eg-chess-board.jpeg",
      },	  
      {
        name: "Brick & Mortar End Grain Board",
        description:
          'Classic walnut and maple brick and mortar cutting board.',
        size: '12" x 18" x 1.5"',
        price: "$250",
        image: "/images/cutting-boards/brick-mortar.jpeg",
      },	
      {
        name: "Chaos End Grain Board",
        description:
          'The Chaos board is made from various woods.',
        size: '12" x 18" x 1.5"',
        price: "$325",
        image: "/images/cutting-boards/eg-chaos.jpeg",
      },      
	  {
        name: "Optical Illusion End Grain Board",
        description:
          'The Optical Illusion End Grain Board is made with three contrasting woods to give the illusion of depth.',
        size: '16" x 16" x 1.5"',
        price: "$200",
        image: "/images/cutting-boards/eg-opt-warp.jpeg",
      },	  
      {
        name: "Stair Step End Grain Board",
        description:
          'The Stair Step End Grain Board is made with two contrasting woods to highlight the stair step pattern.',
        size: '16" x 16" x 1.5"',
        price: "$180",
        image: "/images/cutting-boards/step-board.jpeg",
      },
      {
        name: "Zig-Zag End Grain Board",
        description:
          'Zig-zag pattern with alternating light and dark woods. Perfect for everyday use and makes a beautiful display piece.',
        size: '16" x 16" x 1.5"',
        price: "$180",
        image: "/images/cutting-boards/zigzag.jpeg",
      },	
      {
        name: "End Grain Board",
        description:
          'End grain board perfect for cutting fresh vegetables..',
        size: '10" x 11" x 1"',
        price: "$85",
        image: "/images/cutting-boards/maple-walnut.jpeg",
      },	  
    ],
  },
  "game-boards": {
    name: "Game Boards",
    description: "Handcrafted game boards that combine function with artistic design.",
    products: [
      {
        name: "Chess Board",
        description: "Traditional chess board with contrasting woods and smooth finish.",
        size: '18" x 18"',
        price: "$125",
        image: "/images/game-boards/gb-chess-wal-map.jpeg",
      },
      {
        name: "Mini Chess Board",
        description: "Laser engraved small chess board and pieces - perfect for practicing!",
        size: '6" x 6"',
        price: "$50",
        image: "/images/game-boards/mini-chess.jpeg",
      },
      {
        name: "Morris Board",
        description: "Classic strategy play—place, move, and ‘mill’ three-in-a-row to remove your opponent’s pieces",
        size: '9" x 9"',
        price: "$75",
        image: "/images/game-boards/IMG_5484.jpeg",
      },
	  {
        name: "Cribbage Board - Multiple Woods",
        description: "Multiple wood cribbage board with pegs and cards.",
        size: '16" x 5"',
        price: "$60",
        image: "/images/game-boards/gb-cb-mult.jpeg",
      },	  
	  {
        name: "Cribbage Board",
        description: "Single wood cribbage board with pegs and cards.",
        size: '16" x 5"',
        price: "$50",
        image: "/images/game-boards/gb-cribbage.jpeg",
      },	  
    ],
  },
  "cheese-boards": {
    name: "Cheese & Charcuterie Boards",
    description: "Elegant serving boards perfect for entertaining and special occasions.",
    products: [
      {
        name: "Chaos End Grain Cheese Board",
        description: "Unique and one of a kind end grain cheese board.",
        size: '9" x 5.75" x 1"',
        price: "$125",
        image: "/images/cheese-boards/cbeg-chaos.jpeg",
      },
      {
        name: "Chaos End Grain Cheese Board",
        description: "Unique and one of a kind end grain cheese board.",
        size: '9" x 5.75" x 1"',
        price: "$100",
        image: "/images/cheese-boards/eg-chaos.jpeg",
      },	  
      {
        name: "Striped Cheese Board",
        description:
          "Beautiful striped pattern made with bloodwood, beech, cherry, and walnut.",
        size: '9" x 5.75" x 1"',
        price: "$65",
        image: "/images/cheese-boards/cb-bld-wal-bch.jpeg",
      },
      {
        name: "Cheese Board",
        description: "Single wood cheese board.",
        size: '9" x 5.75" x 1"',
        price: "$50",
        image: "/images/cheese-boards/cb-cherry.jpeg",
      },
      {
        name: "Charcuterie Board",
        description: "Single wood charcuterie board.",
        size: '15" x 7" x 1"',
        price: "$60",
        image: "/images/cheese-boards/char-maple.jpeg",
      },	  
    ],
  },
  coasters: {
    name: "Coasters",
    description: "Protective and stylish coasters for your furniture.",
    products: [
      {
        name: "Custom Engraved Coasters with Holder",
        description: "Personalized with your design, logo, or monogram.",
        size: '4" x 4" each',
        price: "$50",
        image: "/images/coasters/IMG_5409.jpeg",
      },	
      {
        name: "Coaster Set with Holder",
        description:
          "Set of four matching coasters with beautiful wooden holder. Protects surfaces while adding natural beauty to your home.",
        size: '4" x 4" each',
        price: "$45",
        image: "/images/coasters/goncalo-box.jpeg",
      },
      {
        name: "Custom Engraved Coasters",
        description: "Personalized with your design, logo, or monogram.",
        size: '4" x 4" each',
        price: "$30",
        image: "/images/coasters/silverback.jpeg",
      },
      {
        name: "Coaster Set (4)",
        description: "Set of four coasters - single wood.",
        size: '4" x 4" each',
        price: "$20",
        image: "/images/coasters/goncalo-alves-stack.jpeg",
      },
    ],
  },
  "outdoor-items": {
    name: "Outdoor Items",
    description: "Weather-resistant pieces designed for outdoor enjoyment.",
    products: [
      {
        name: "Fishing Net",
        description: "Durable outdoor net with environmentally friendly netting and magnetic clip.",
        size: '10.5" x 30.5" x .75"',
        price: "$190",
        image: "/images/outdoor-items/IMG_6584.jpeg",
      },
      {
        name: "Cigar Caddy",
        description: "Magnetic cigar caddy to keep your cigar dry and at your fingertips.",
        size: '2" x 4"',
        price: "$20",
        image: "/images/outdoor-items/IMG_3603.jpeg",
      },	  
    ],
  },
  furniture: {
    name: "Furniture",
    description: "Custom furniture pieces that become family heirlooms.",
    products: [
      {
        name: "Butcher Block Table",
        description: "Solid hardwood butcher block table with a thick end-grain top, sturdy tapered legs, and a hand-rubbed finish — built for daily prep and decades of use.",
        size: "Custom",
        price: "$2,000",
        image: "/images/furniture/bb-table.jpeg",
      },
      {
        name: "Dining Room Table",
        description: "Solid mahogany table with maple and ebony inlay. Metal legs provided by flowyline design.",
        size: "Custom",
        price: "$3,000",
        image: "/images/furniture/tab-mah-map-ebo.jpeg",
      },	  
      {
        name: "Side Table",
        description: "Solid hardwood side table with a lower shelf, square plug accents, and a hand-rubbed finish — clean, sturdy, and timeless.",
        size: "Custom",
        price: "$250",
        image: "/images/furniture/IMG_6742.jpeg",
      },
    ],
  },
  "bar-ware": {
    name: "Bar & Kitchen Ware",
    description: "Sophisticated accessories for the home bar enthusiast.",
    products: [
      {
        name: "Ashtray",
        description: "Walnut ashtray with stone inset. Can be made to hold 2 or 4 cigars.",
        size: '6" x 6"',
        price: "$65",
        image: "/images/bar-ware/ashtray-walnut.jpeg",
      },
      {
        name: "Wine Bottle Stopper",
        description: "Handturned solid wood with unique grain pattern. All bottle stops are made with Niles stainless steel stoppers.",
        size: "Varies",
        price: "$25",
        image: "/images/bar-ware/bs-bocote.jpeg",
      },
      {
        name: "Wine Bottle Stopper (Laminate)",
        description: "Handturned laminate with unique grain pattern. All bottle stops are made with Niles stainless steel stoppers.",
        size: "Varies",
        price: "$25",
        image: "/images/bar-ware/bs-lam-blue.jpeg",
      },	  
      {
        name: "Wine Caddie",
        description: "Easily carry your bottle of wine and 2 glasses wherever you want to enjoy a glass.",
        size: '4" x 12"',
        price: "$45",
        image: "/images/bar-ware/Mahogany Wine Caddy.jpeg",
      },	  
      {
        name: "Can Opener",
        description: "Perfect for opening cans of cat food!",
        size: 'Varies',
        price: "$25",
        image: "/images/bar-ware/can-opener.jpeg",
      },
    ],
  },
  montessori: {
    name: "Montessori Materials",
    description: "Custom-crafted Montessori materials designed to support child development and learning. Each piece is made to order with attention to educational principles and child safety.",
    products: [
      {
        name: "Stackable Learning Tables",
        description: "Versatile stackable tables perfect for Montessori classroom or home learning environments. Made from 3/4\" maple prefinished plywood with smooth, child-safe edges.",
        size: "Custom sizing available",
        price: "$70",
        image: "/images/montessori/stackable-tables.jpeg",
      },
      {
        name: "Metal Inset Tray",
        description: "Classic Montessori sensorial material featuring geometric metal insets. Perfect for developing fine motor skills and hand-eye coordination through tracing exercises.",
        size: "Custom dimensions",
        price: "$30",
        image: "/images/montessori/metal-inset-tray-placeholder.jpeg",
      },
      {
        name: "Nuts & Bolts Board",
        description: "Practical life activity board with various sized nuts and bolts for hand-twisting practice. Develops hand strength, coordination, and fine motor skills essential for daily life activities.",
        size: "Custom sizing available",
        price: "$35",
        image: "/images/montessori/nuts-bolts-board-placeholder.jpeg",
      },
      {
        name: "Tee Balance Board",
        description: "Balance and coordination board designed to help children develop gross motor skills and spatial awareness. Made from solid hardwood with smooth, safe edges.",
        size: "Custom dimensions",
        price: "$15",
        image: "/images/montessori/tee-balance-board-placeholder.jpeg",
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
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{product.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-1">{product.description}</p>
				  <p className="text-foreground">Size: <span className="text-muted-foreground leading-relaxed mb-4 flex-1">{product.size}</span></p>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-primary">{product.price}</p>
                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <Link href="/custom-orders">Order Custom</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 bg-transparent">
                        <Link href="mailto:stonybendbarn@gmail.com?subject=Montessori Quote Request">Request Quote</Link>
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
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            {params.category === 'montessori' ? 'Ready to Order Montessori Materials?' : 'Want something custom?'}
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            {params.category === 'montessori' 
              ? 'Each Montessori material is custom-crafted to order with attention to educational principles and child safety. Lead times vary by complexity.'
              : 'We can create a unique piece tailored to your exact specifications.'
            }
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/custom-orders">
              {params.category === 'montessori' ? 'Start Custom Order' : 'Request Custom Order'}
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

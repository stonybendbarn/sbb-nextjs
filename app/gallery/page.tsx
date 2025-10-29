import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera } from "lucide-react"

const galleryItems = [
  {
    id: 1,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    title: "Walnut & Maple Checkerboard",
    size: '18" x 24"',
    status: "Sold",
    image: "large walnut and maple checkerboard cutting board",
    description: "Custom oversized end grain board with intricate pattern",
  },
  {
    id: 2,
    category: "furniture",
    categoryName: "Furniture",
    title: "Live Edge Dining Table",
    size: '8 feet x 42"',
    status: "Sold",
    image: "live edge walnut dining table in dining room",
    description: "Stunning walnut slab table with steel legs",
  },
  {
    id: 3,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    title: "Cherry & Maple End Grain",
    size: '16" x 20"',
    status: "Sold",
    image: "cherry and maple end grain cutting board",
    description: "Beautiful contrast between cherry and maple woods",
  },
  {
    id: 4,
    category: "furniture",
    categoryName: "Furniture",
    title: "Rustic Bookshelf",
    size: "6 feet tall",
    status: "Sold",
    image: "rustic wooden bookshelf with books",
    description: "Custom built-in bookshelf with adjustable shelves",
  },
  {
    id: 5,
    category: "game-boards",
    categoryName: "Game Boards",
    title: "Walnut Chess Set",
    size: '20" x 20"',
    status: "Sold",
    image: "luxury walnut chess board with pieces",
    description: "Premium chess board with hand-carved pieces",
  },
  {
    id: 6,
    category: "outdoor",
    categoryName: "Outdoor Items",
    title: "Cedar Patio Set",
    size: "Table & 4 Chairs",
    status: "Sold",
    image: "cedar outdoor patio furniture set",
    description: "Complete outdoor dining set in weather-resistant cedar",
  },
  {
    id: 7,
    category: "cheese-boards",
    categoryName: "Cheese Boards",
    title: "Live Edge Charcuterie Board",
    size: '24" x 14"',
    status: "Sold",
    image: "large live edge charcuterie board with food",
    description: "Extra large serving board perfect for entertaining",
  },
  {
    id: 8,
    category: "furniture",
    categoryName: "Furniture",
    title: "Walnut Coffee Table",
    size: '48" x 30"',
    status: "Sold",
    image: "modern walnut coffee table in living room",
    description: "Mid-century modern inspired coffee table",
  },
  {
    id: 9,
    category: "barware",
    categoryName: "Bar Ware",
    title: "Custom Wine Flight Board",
    size: '20" x 8"',
    status: "Sold",
    image: "custom wine flight board with glasses",
    description: "Personalized engraving for wine enthusiast",
  },
  {
    id: 10,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    title: "Mixed Hardwood Masterpiece",
    size: '20" x 26"',
    status: "Sold",
    image: "intricate mixed hardwood cutting board",
    description: "Complex pattern using five different wood species",
  },
  {
    id: 11,
    category: "furniture",
    categoryName: "Furniture",
    title: "Farmhouse Dining Bench",
    size: "6 feet",
    status: "Sold",
    image: "rustic farmhouse dining bench",
    description: "Matching bench for farmhouse dining table",
  },
  {
    id: 12,
    category: "outdoor",
    categoryName: "Outdoor Items",
    title: "Adirondack Chair Set",
    size: "Set of 2",
    status: "Sold",
    image: "pair of wooden adirondack chairs",
    description: "Classic outdoor seating in durable hardwood",
  },
  {
    id: 13,
    category: "cheese-boards",
    categoryName: "Cheese Boards",
    title: "Round Walnut Serving Board",
    size: '16" diameter',
    status: "Available",
    image: "round walnut cheese board",
    description: "Elegant round board with juice groove",
  },
  {
    id: 14,
    category: "game-boards",
    categoryName: "Game Boards",
    title: "Custom Cribbage Board",
    size: '18" x 6"',
    status: "Sold",
    image: "custom engraved cribbage board",
    description: "Personalized cribbage board with family name",
  },
  {
    id: 15,
    category: "barware",
    categoryName: "Bar Ware",
    title: "Bottle Opener Collection",
    size: "Various",
    status: "Available",
    image: "collection of wooden bottle openers",
    description: "Handturned bottle openers in exotic woods",
  },
  {
    id: 16,
    category: "furniture",
    categoryName: "Furniture",
    title: "Entry Hall Table",
    size: '48" x 16"',
    status: "Sold",
    image: "narrow entry hall console table",
    description: "Slim profile table perfect for narrow spaces",
  },
  {
    id: 17,
    category: "coasters",
    categoryName: "Coasters",
    title: "Wedding Gift Coaster Set",
    size: "Set of 8",
    status: "Sold",
    image: "engraved wooden coaster set in box",
    description: "Custom engraved coasters with wedding date",
  },
  {
    id: 18,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    title: "Butcher Block Style Board",
    size: '18" x 18" x 3"',
    status: "Sold",
    image: "thick butcher block cutting board",
    description: "Extra thick professional-grade cutting board",
  },
]

const categories = [
  { value: "all", label: "All Items" },
  { value: "cutting-boards", label: "Cutting Boards" },
  { value: "game-boards", label: "Game Boards" },
  { value: "cheese-boards", label: "Cheese Boards" },
  { value: "coasters", label: "Coasters" },
  { value: "outdoor", label: "Outdoor Items" },
  { value: "furniture", label: "Furniture" },
  { value: "barware", label: "Bar Ware" },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Our Gallery
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Explore our portfolio of handcrafted pieces, including completed custom orders and items that have found
              their forever homes.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid with Tabs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {galleryItems
                    .filter((item) => category.value === "all" || item.category === category.value)
                    .map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-4">
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground text-sm px-4 text-center">{item.image}</span>
                          </div>
                          <Badge
                            className={`absolute top-4 right-4 ${
                              item.status === "Sold"
                                ? "bg-muted-foreground text-background"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-serif text-xl font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.categoryName}</span>
                            <span className="font-medium">{item.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {galleryItems.filter((item) => category.value === "all" || item.category === category.value).length ===
                  0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No gallery items for this category yet.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">Inspired by what you see?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            We can create something similar or completely unique for you. Every piece is custom-crafted to your
            specifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/custom-orders"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 px-8"
            >
              Request Custom Order
            </a>
            <a
              href="/inventory"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary-foreground/20 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground h-11 px-8"
            >
              View Current Inventory
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

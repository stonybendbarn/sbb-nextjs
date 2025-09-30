import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package } from "lucide-react"

const inventoryItems = [
  {
    id: 1,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Walnut & Maple End Grain Board",
    size: '12" x 18" x 1.5"',
    price: "$125",
    stock: "In Stock",
    image: "walnut and maple end grain cutting board",
    description: "Beautiful checkerboard pattern with food-safe finish",
  },
  {
    id: 2,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Cherry End Grain Board",
    size: '14" x 20" x 1.75"',
    price: "$145",
    stock: "In Stock",
    image: "cherry wood end grain cutting board",
    description: "Rich cherry wood with natural color variation",
  },
  {
    id: 3,
    category: "game-boards",
    categoryName: "Game Boards",
    name: "Walnut Chess Board",
    size: '16" x 16"',
    price: "$95",
    stock: "In Stock",
    image: "walnut chess board",
    description: "Classic chess board with contrasting maple squares",
  },
  {
    id: 4,
    category: "cheese-boards",
    categoryName: "Cheese Boards",
    name: "Live Edge Walnut Serving Board",
    size: '18" x 10"',
    price: "$85",
    stock: "In Stock",
    image: "live edge walnut cheese board",
    description: "Natural edge preserved for rustic elegance",
  },
  {
    id: 5,
    category: "coasters",
    categoryName: "Coasters",
    name: "Mixed Wood Coaster Set",
    size: '4" x 4" (Set of 6)',
    price: "$48",
    stock: "In Stock",
    image: "wooden coaster set with holder",
    description: "Six coasters with matching holder",
  },
  {
    id: 6,
    category: "barware",
    categoryName: "Bar Ware",
    name: "Beer Flight Board",
    size: '16" x 6"',
    price: "$55",
    stock: "In Stock",
    image: "wooden beer flight board",
    description: "Holds four glasses, perfect for tastings",
  },
  {
    id: 7,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Mixed Hardwood End Grain",
    size: '16" x 22" x 2"',
    price: "$165",
    stock: "In Stock",
    image: "mixed hardwood end grain cutting board",
    description: "Unique blend of walnut, cherry, and maple",
  },
  {
    id: 8,
    category: "game-boards",
    categoryName: "Game Boards",
    name: "Cribbage Board",
    size: '12" x 4"',
    price: "$55",
    stock: "In Stock",
    image: "wooden cribbage board",
    description: "Includes brass pegs and storage",
  },
  {
    id: 9,
    category: "cheese-boards",
    categoryName: "Cheese Boards",
    name: "Round Cheese Board",
    size: '12" diameter',
    price: "$65",
    stock: "In Stock",
    image: "round wooden cheese board",
    description: "Perfect size for entertaining",
  },
  {
    id: 10,
    category: "barware",
    categoryName: "Bar Ware",
    name: "Wine Bottle Stopper Set",
    size: "Set of 3",
    price: "$45",
    stock: "In Stock",
    image: "wooden wine bottle stoppers",
    description: "Hand-turned with unique grain patterns",
  },
  {
    id: 11,
    category: "outdoor",
    categoryName: "Outdoor Items",
    name: "Cedar Planter Box",
    size: '24" x 12" x 12"',
    price: "$95",
    stock: "In Stock",
    image: "cedar planter box",
    description: "Weather-resistant cedar construction",
  },
  {
    id: 12,
    category: "furniture",
    categoryName: "Furniture",
    name: "Live Edge Coffee Table",
    size: '48" x 24" x 18"',
    price: "$850",
    stock: "In Stock",
    image: "live edge walnut coffee table",
    description: "Stunning walnut slab with natural edge",
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

export default function InventoryPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Current Inventory
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Browse our available items ready to ship. All pieces are handcrafted and in stock now.
            </p>
          </div>
        </div>
      </section>

      {/* Inventory Grid with Tabs */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {inventoryItems
                    .filter((item) => category.value === "all" || item.category === category.value)
                    .map((item) => (
                      <Card key={item.id} className="overflow-hidden flex flex-col">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <img
                            src={`/.jpg?height=500&width=500&query=${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                            {item.stock}
                          </Badge>
                        </div>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="font-serif text-xl">{item.name}</CardTitle>
                          </div>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Size:</span>
                              <span className="text-sm font-medium">{item.size}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Category:</span>
                              <span className="text-sm font-medium">{item.categoryName}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-sm text-muted-foreground">Price:</span>
                              <span className="text-2xl font-bold text-primary">{item.price}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">Contact to Purchase</Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>

                {inventoryItems.filter((item) => category.value === "all" || item.category === category.value)
                  .length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No items currently in stock for this category.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Inventory Updates Regularly
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Our inventory changes frequently as pieces are sold and new items are completed. Don't see what you're
              looking for? Check back soon or place a custom order.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <a href="mailto:info@stonybendbarn.com">Contact About Availability</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <a href="/custom-orders">Place Custom Order</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

"use client";

// Inventory - \sbb-nextjs\app\inventory
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart-context";
import { Package } from "lucide-react";
import Image from "next/image";

// --- Sale styling config ---
// Change SALE_THEME between: "amber", "orange", "green", "blue", "rose"
const SALE_STYLES: Record<string, { button: string; badge: string }> = {
  amber:  { button: "bg-amber-500 text-black hover:bg-amber-600",  badge: "bg-amber-500 text-black" },
  orange: { button: "bg-orange-500 text-white hover:bg-orange-600", badge: "bg-orange-500 text-white" },
  green:  { button: "bg-emerald-600 text-white hover:bg-emerald-700", badge: "bg-emerald-600 text-white" },
  blue:   { button: "bg-sky-600 text-white hover:bg-sky-700",        badge: "bg-sky-600 text-white" },
  rose:   { button: "bg-rose-600 text-white hover:bg-rose-700",      badge: "bg-rose-600 text-white" },
};
const SALE_THEME = "green";
// --- end sale styling config ---

// Helper: parse a price string like "$295" -> 29500 cents
function priceToCents(price: string | undefined): number | null {
  if (!price) return null;
  const num = Number(String(price).replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return null;
  return Math.round(num * 100);
}

// (removed tier helper) — using per‑item shippingCents now

// Client-side: create Checkout Session then redirect
async function buy(item: InventoryItem) {
  const isOnSale = (item.stock || "").toLowerCase().includes("on sale");
  const cents = priceToCents(isOnSale && item.salePrice ? item.salePrice : item.price);
  if (!cents) return alert("Sorry, this item doesn't have a valid price.");

  const body = {
    name: item.name,
    priceInCents: cents,
    productId: item.id,
    image: item.image?.startsWith("/images/") ? `${location.origin}${item.image}` : undefined,
    shipAmount: typeof item.shippingCents === "number" ? item.shippingCents : (item.category === "cutting-boards" ? 5000 : 1500),
  };

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error("Checkout error:", msg);
    return alert("Checkout failed. Please try again or contact us.");
  }

  const { url } = await res.json();
  if (!url) return alert("No checkout URL returned.");
  window.location.href = url;
}

// Types for items
type InventoryItem = {
  id: number;
  category: string;
  categoryName: string;
  name: string;
  size: string;
  price: string;
  salePrice?: string;
  stock: string;
  image: string;
  description: string;
  shippingCents?: number; // per item shipping control (e.g., 5000 => $50)
};

const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Walnut, Maple, and Padauk End Grain Board",
    size: '18.75" x 19" x 2"',
    price: "$295",
    stock: "In Stock",
    image: "/images/cutting-boards/eg-chess-board.jpeg",
    description: "Classic chess board wood wrapped in with a paduak board and brass feet. Recessed handles make lifting this large board simpler.",
    shippingCents: 4000,
  },
  {
    id: 2,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Walnut & Maple End Grain Board",
    size: '10.1" x 11.5" x 1.1"',
    price: "$85",
    stock: "In Stock",
    image: "/images/cutting-boards/IMG_0809.jpeg",
    description: "End grain board perfect for cutting fresh vegetables.",
    shippingCents: 2000,
  },
  {
    id: 3,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Chaos End Grain Board",
    size: '12.5" x 16" x 1.75"',
    price: "$325",
    salePrice: "$225",
    stock: "On Sale",
    image: "/images/cutting-boards/eg-chaos2.jpeg",
    description: "Cherry, maple, and padauk end grain board with brass feet.",
    shippingCents: 4000,
  },
  {
    id: 4,
    category: "cutting-boards",
    categoryName: "Cutting Boards",
    name: "Walnut & Maple End Grain Board",
    size: '10.1" x 11.5" x 1.1"',
    price: "$85",
    stock: "In Stock",
    image: "/images/cutting-boards/maple-walnut.jpeg",
    description: "End grain board perfect for cutting fresh vegetables.",
    shippingCents: 2000,
  },
  {
    id: 5,
    category: "coasters",
    categoryName: "Coasters",
    name: "Canary Wood Coaster Set",
    size: '4" x 4" (Set of 4)',
    price: "$20",
    stock: "In Stock",
    image: "/images/coasters/canary1.jpeg",
    description: "Set of 4 canary wood coasters.",
    shippingCents: 500,
  },
  {
    id: 6,
    category: "coasters",
    categoryName: "Coasters",
    name: "Canary Wood Coaster Set",
    size: '4" x 4" (Set of 4)',
    price: "$20",
    stock: "In Stock",
    image: "/images/coasters/canary2.jpeg",
    description: "Set of 4 canary wood coasters.",
    shippingCents: 500,
  },
  {
    id: 7,
    category: "coasters",
    categoryName: "Coasters",
    name: "Canary Wood Coaster Set",
    size: '4" x 4" (Set of 4)',
    price: "$20",
    stock: "In Stock",
    image: "/images/coasters/canary3.jpeg",
    description: "Set of 4 canary wood coasters.",
    shippingCents: 500,
  },
  {
    id: 8,
    category: "cheese-boards",
    categoryName: "Cheese Boards",
    name: "Chaos End Grain Cheese Board",
    size: '6" x 8.25" x .75"',
    price: "$85",
    stock: "In Stock",
    image: "/images/cheese-boards/cb-eg-phmp.jpeg",
    description: "Purpleheart and maple end grain cheese board.",
    shippingCents: 1000,
  },
  {
    id: 9,
    category: "cheese-boards",
    categoryName: "Cheese Boards",
    name: "Serving Board",
    size: '6" x 8.25 x .75"',
    price: "$55",
    stock: "In Stock",
    image: "/images/cheese-boards/sb-eg-phmp.jpeg",
    description: "Purpleheart and maple end grain serving board.",
    shippingCents: 1000,
  },
  {
    id: 10,
    category: "furniture",
    categoryName: "Furniture",
    name: "Plant Stand",
    size: '10" x 10"',
    price: "$55",
    stock: "In Stock",
    image: "/images/furniture/plant-stand-short.jpeg",
    description: "Mahogany and purpleheart plant stand.",
    shippingCents: 5000,
  },
  {
    id: 11,
    category: "furniture",
    categoryName: "Furniture",
    name: "Plant Stand",
    size: '10" x 15.5"',
    price: "$75",
    stock: "In Stock",
    image: "/images/furniture/plant-stand-tall.jpeg",
    description: "Mahogany and maple plant stand.",
    shippingCents: 5000,
  },
  {
    id: 12,
    category: "bar-ware",
    categoryName: "Bar Ware",
    name: "Bottle Opener",
    size: '5.25" x .675"',
    price: "$75",
    stock: "In Stock",
    image: "/images/bar-ware/bo-mahog.jpeg",
    description: "Mahogany bottle opener with magnet.",
    shippingCents: 500,
  },
  {
    id: 1201,
    category: "bar-ware",
    categoryName: "Bar Ware",
    name: "Bottle Opener",
    size: '5.25" x .5"',
    price: "$12",
    stock: "In Stock",
    image: "/images/bar-ware/bo-mult1.jpeg",
    description: "Purpleheart, maple, and mahogany bottle opener with magnet.",
    shippingCents: 500,
  },
  {
    id: 1202,
    category: "bar-ware",
    categoryName: "Bar Ware",
    name: "Bottle Opener",
    size: '5.25" x .5"',
    price: "$12",
    stock: "In Stock",
    image: "/images/bar-ware/bo-mult2.jpeg",
    description: "Purpleheart, maple, and mahogany bottle opener with magnet.",
    shippingCents: 500,
  },
  {
    id: 1203,
    category: "bar-ware",
    categoryName: "Bar Ware",
    name: "Bottle Opener",
    size: '5.25" x .5"',
    price: "$12",
    stock: "In Stock",
    image: "/images/bar-ware/bo-mult3.jpeg",
    description: "Purpleheart, maple, and mahogany bottle opener with magnet.",
    shippingCents: 500,
  },
];

const categories = [
  { value: "all", label: "All Items" },
  { value: "cutting-boards", label: "Cutting Boards" },
  { value: "game-boards", label: "Game Boards" },
  { value: "cheese-boards", label: "Cheese Boards" },
  { value: "coasters", label: "Coasters" },
  { value: "outdoor", label: "Outdoor Items" },
  { value: "furniture", label: "Furniture" },
  { value: "barware", label: "Bar Ware" },
];

export default function InventoryPage() {
  const cart = useCart();	
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
                    .map((item) => {
                      const isOnSale = item.stock?.toLowerCase().includes("on sale");
                      const subject = `Interested in ${item.name}`;
                      const priceText = (isOnSale && item.salePrice) ? item.salePrice : item.price;
                      const body = [
                        "Hi Stony Bend Barn,",
                        "",
                        `I'm interested in "${item.name}" (${item.size}) listed at ${priceText}.`,
                        "",
                        "Please let me know availability and next steps.",
                      ].join("\r\n");
                      const mailto = `mailto:info@stonybendbarn.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                      const showBuyNow = item.stock?.toLowerCase().includes("in stock") || isOnSale;

                      return (
                        <Card key={item.id} className="overflow-hidden flex flex-col">
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            {item.image?.startsWith("/images/") ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain"
                                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                                quality={92}
                              />
                            ) : (
                              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                                <span className="px-3 text-sm">Image coming soon</span>
                              </div>
                            )}

                            <Badge className={"absolute top-4 right-4 " + (isOnSale ? SALE_STYLES[SALE_THEME].badge : "bg-secondary text-secondary-foreground")}>
                              {item.stock}
                            </Badge>
                          </div>
                          <CardHeader className="p-3 pb-0 space-y-0">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="font-serif text-xl leading-tight !mt-0 !mb-0">{item.name}</CardTitle>
                            </div>
                            <CardDescription className="mt-1">{item.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 px-3 pt-1 pb-1">
                            <div className="space-y-0.5">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Size:</span>
                                <span className="text-sm font-medium">{item.size}</span>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-sm text-muted-foreground">Price:</span>
                                {isOnSale && item.salePrice ? (
                                  <span className="text-2xl font-bold text-primary">
                                    <span className="line-through text-muted-foreground mr-2">{item.price}</span>
                                    <span className="text-emerald-700">{item.salePrice}</span>
                                  </span>
                                ) : (
                                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                                )}
                              </div>
							  {/*
                              <p className="text-[12px] text-muted-foreground mt-1">Shipping: {((item.shippingCents ?? (item.category === "cutting-boards" ? 5000 : 1500)) / 100).toLocaleString(undefined, { style: "currency", currency: "USD" })} (insured where applicable) · Free local pickup available</p>
							  */}
                            </div>
                          </CardContent>
                          <CardFooter className="p-3 pt-0 gap-2 flex-col sm:flex-row">
							  <Button
								type="button"
								onClick={() => cart.addItem({
								  id: item.id,
								  name: item.name,
								  priceInCents: (isOnSale && item.salePrice ? priceToCents(item.salePrice)! : priceToCents(item.price)!),
								  image: item.image?.startsWith("/images/") ? `${location.origin}${item.image}` : undefined,
								  shippingCents: typeof item.shippingCents === "number" ? item.shippingCents : (item.category === "cutting-boards" ? 5000 : 1500),
								})}
								className="w-full sm:w-auto"
								size="sm"
							  >
								Add to Cart
							  </Button>

							  <Button
								onClick={async () => {
								  const payload = [{
									id: item.id,
									name: item.name,
									priceInCents: (isOnSale && item.salePrice ? priceToCents(item.salePrice)! : priceToCents(item.price)!),
									image: item.image?.startsWith("/images/") ? `${location.origin}${item.image}` : undefined,
									shippingCents: typeof item.shippingCents === "number" ? item.shippingCents : (item.category === "cutting-boards" ? 5000 : 1500),
								  }];
								  const res = await fetch("/api/checkout", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ items: payload }) });
								  const { url } = await res.json();
								  window.location.href = url;
								}}
								variant={isOnSale ? undefined : "outline"}
								className={isOnSale ? "" : "w-full sm:w-auto"}
								size="sm"
							  >
								{isOnSale ? "Buy Now (On Sale)" : "Buy Now"}
							  </Button>
							</CardFooter>
                        </Card>
                      );
                    })}
                </div>

                {inventoryItems.filter((item) => category.value === "all" || item.category === category.value).length === 0 && (
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
  );
}

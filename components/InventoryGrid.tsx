"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Images as ImagesIcon, Package } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";


type Product = {
  id: number;
  name: string;
  category: string;
  size: string;
  price_cents: number;
  sale_price_cents: number | null;
  stock_status: string;
  images: string[] | null;
  description: string;
  shipping_cents: number | null;
};

const categories = [
  { value: "all", label: "All Items" },
  { value: "cutting-boards", label: "Cutting Boards" },
  { value: "game-boards", label: "Game Boards" },
  { value: "cheese-boards", label: "Cheese Boards" },
  { value: "coasters", label: "Coasters" },
  { value: "outdoor", label: "Outdoor Items" },
  { value: "furniture", label: "Furniture" },
  { value: "bar-ware", label: "Bar Ware" },
];

const SALE_STYLES = {
  amber:  { button: "bg-amber-500 text-black hover:bg-amber-600", badge: "bg-amber-500 text-black", price: "text-amber-600" },
};
const SALE_THEME = "amber";

const fmt = (cents: number | null) =>
  cents == null ? "" : (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

function InventoryImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const hasMultiple = images.length > 1;
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      {images[0] ? (
        <Image src={images[0]} alt={alt} fill className="object-contain" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <span className="px-3 text-sm">Image coming soon</span>
        </div>
      )}
      {hasMultiple && (
        <div className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/45 text-white px-1.5 py-0.5 text-[10px]">
          <ImagesIcon className="h-3.5 w-3.5" /> 1/{images.length}
        </div>
      )}
    </div>
  );
}

export default function InventoryGrid({ products }: { products: Product[] }) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent mb-8">
        {categories.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => {
        const filtered = cat.value === "all" ? products : products.filter((p) => p.category === cat.value);

        return (
          <TabsContent key={cat.value} value={cat.value} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((item) => {
                const status = (item.stock_status || "").toLowerCase();
                const isOnSale = status === "on sale";
                const isSold   = status === "sold";
                const isInStock= status === "in stock";
                const canBuy   = isInStock || isOnSale;
				const priceForCart = isOnSale && item.sale_price_cents ? item.sale_price_cents : item.price_cents;
                const images   = item.images ?? [];

                return (
                  <Card key={item.id} className="overflow-hidden flex flex-col">
                    <div className="relative">
                      <InventoryImageCarousel images={images} alt={item.name} />
                      <Badge className={`absolute top-4 right-4 ${isOnSale ? SALE_STYLES[SALE_THEME].badge : "bg-secondary text-secondary-foreground"}`}>
                        {item.stock_status}
                      </Badge>
                    </div>

                    <CardHeader className="p-3 pb-0 space-y-0">
                      <CardTitle className="font-serif text-xl leading-tight">{item.name}</CardTitle>
                      <CardDescription className="mt-1">{item.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 px-3 pt-1 pb-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <span className="text-sm font-medium">{item.size}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        {isOnSale && item.sale_price_cents ? (
                          <span className="text-2xl font-bold">
                            <span className="line-through text-muted-foreground mr-2">{fmt(item.price_cents)}</span>
                            <span className={SALE_STYLES[SALE_THEME].price}>{fmt(item.sale_price_cents)}</span>
                          </span>
                        ) : (
                          <span className="text-2xl font-bold text-primary">{fmt(item.price_cents)}</span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-3 pt-0 gap-2 flex-col sm:flex-row">
					  {isSold ? (
						<Button disabled size="sm" variant="outline">Sold</Button>
					  ) : (
						<div className="w-full flex flex-col sm:flex-row gap-2">
						  <Button
							type="button"
							size="sm"
							className={isOnSale ? `${SALE_STYLES[SALE_THEME].button}` : "w-full sm:w-auto"}
							disabled={!canBuy}
							onClick={async () => {
							  try {
								const res = await fetch("/api/checkout", {
								  method: "POST",
								  headers: { "Content-Type": "application/json" },
								  body: JSON.stringify({ productId: item.id }),
								});
								if (!res.ok) {
								  console.error("Checkout create failed", await res.text());
								  return;
								}
								const { url } = await res.json();
								window.location.href = url;
							  } catch (e) {
								console.error("Checkout error", e);
							  }
							}}
						  >
							{canBuy ? (isOnSale ? "Buy Now (On Sale)" : "Buy Now") : "Sold Out"}
						  </Button>

						  <AddToCartButton
							id={String(item.id)}               // cast number → string
							name={item.name}
							price_cents={priceForCart}
							image={images[0] ?? null}
							disabled={!canBuy}
						  />

						</div>
					  )}
					</CardFooter>
                  </Card>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items currently in stock for this category.</p>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

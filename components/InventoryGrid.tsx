"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Images as ImagesIcon, Package } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import { useState, useCallback, KeyboardEvent, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

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
  available_quantity: number;
  is_quantity_based: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
};

const categories = [
  { value: "all", label: "All Items" },
  { value: "cutting-boards", label: "Cutting Boards" },
  { value: "game-boards", label: "Game Boards" },
  { value: "cheese-boards", label: "Cheese Boards" },
  { value: "coasters", label: "Coasters" },
  { value: "outdoor-items", label: "Outdoor Items" },
  { value: "furniture", label: "Furniture" },
  { value: "bar-ware", label: "Bar Ware" },
  { value: "laser-engraving", label: "Laser Engraving" },
  { value: "barn-finds", label: "Barn Finds!" },
];

const SALE_STYLES = {
  amber:  { button: "bg-amber-500 text-black hover:bg-amber-600", badge: "bg-amber-500 text-black", price: "text-amber-600" },
};
const SALE_THEME = "amber";

const fmt = (cents: number | null) =>
  cents == null ? "" : (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

// (Removed shipping display/discount helpers per request)

function InventoryImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const hasMultiple = safeImages.length > 1;
  const [idx, setIdx] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset index when images array changes
  useEffect(() => {
    setIdx(0);
  }, [safeImages.length]);

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [idx, safeImages[idx]]);

  // wrap around
  const next = useCallback(() => {
    setIdx((i) => (i + 1) % (safeImages.length || 1));
  }, [safeImages.length]);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + (safeImages.length || 1)) % (safeImages.length || 1));
  }, [safeImages.length]);

  // keyboard navigation when the image is focused
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  };

  // Ensure image path starts with / for absolute paths
  const getImageSrc = (imagePath: string) => {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-muted rounded-md"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {safeImages.length && safeImages[idx] ? (
        imageError ? (
          // Fallback to regular img tag ONLY if Next.js Image fails
          <img
            src={getImageSrc(safeImages[idx])}
            alt={`${alt} - Image ${idx + 1}`}
            className="w-full h-full object-contain select-none"
            style={{ position: 'absolute', inset: 0 }}
            onError={() => {
              console.error('Image failed to load even with fallback:', getImageSrc(safeImages[idx]))
            }}
            onLoad={() => {
              setImageLoaded(true)
              setImageError(false)
            }}
          />
        ) : (
          <Image
            key={`${idx}-${getImageSrc(safeImages[idx])}`}               // force re-render when image or index changes
            src={getImageSrc(safeImages[idx])}
            alt={`${alt} - Image ${idx + 1}`}
            fill
            className="object-contain select-none"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={false}
            unoptimized={safeImages[idx]?.includes('metal_inset')}
            onError={(e) => {
              console.error('Next.js Image failed, falling back to regular img:', getImageSrc(safeImages[idx]), e)
              setImageError(true)
            }}
            onLoad={() => {
              setImageLoaded(true)
              setImageError(false)
            }}
          />
        )
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <span className="px-3 text-sm">Image coming soon</span>
        </div>
      )}

      {hasMultiple && (
        <>
          {/* counter badge */}
          <div className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/45 text-white px-1.5 py-0.5 text-[10px]">
            <ImagesIcon className="h-3.5 w-3.5" /> {idx + 1}/{safeImages.length}
          </div>

          {/* prev/next buttons */}
          <button
			  type="button"
			  aria-label="Previous image"
			  onClick={prev}
			  className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center
						 h-11 w-11 rounded-full bg-black/45 text-white
						 hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/70
						 shadow-sm backdrop-blur-[2px]"
			>
			  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
			</button>
          <button
			  type="button"
			  aria-label="Next image"
			  onClick={next}
			  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center
						 h-11 w-11 rounded-full bg-black/45 text-white
						 hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/70
						 shadow-sm backdrop-blur-[2px]"
			>
			  <ChevronRight className="h-6 w-6" aria-hidden="true" />
			</button>

          {/* dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


export default function InventoryGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const productIdParam = searchParams?.get("product") || null;
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Find the product by ID to determine its category
  const targetProduct = productIdParam 
    ? products.find((p) => String(p.id) === String(productIdParam))
    : null;

  // Set default tab based on product category if product ID is in URL
  const defaultTab = targetProduct ? targetProduct.category : "all";

  // Scroll to product when component mounts if product ID is in URL
  useEffect(() => {
    if (productIdParam) {
      const productRef = productRefs.current[productIdParam];
      if (productRef) {
        // Small delay to ensure DOM is ready and tab is switched
        setTimeout(() => {
          productRef.scrollIntoView({ behavior: "smooth", block: "start" });
          // Highlight the product card briefly
          productRef.classList.add("ring-2", "ring-primary", "ring-offset-2");
          setTimeout(() => {
            productRef.classList.remove("ring-2", "ring-primary", "ring-offset-2");
          }, 2000);
        }, 500);
      }
    }
  }, [productIdParam]);

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent mb-8">
        {categories.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => {
        const filtered = cat.value === "all" ? products : products.filter((p) => p.category === cat.value);
        
        // Within each category, ensure target product appears first when linked from testimonial
        const sortedFiltered = targetProduct && cat.value === targetProduct.category
          ? [...filtered].sort((a, b) => {
              const aIsTarget = String(a.id) === String(productIdParam);
              const bIsTarget = String(b.id) === String(productIdParam);
              if (aIsTarget) return -1;
              if (bIsTarget) return 1;
              return 0; // Maintain original order for non-target products
            })
          : filtered;

        return (
          <TabsContent key={cat.value} value={cat.value} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedFiltered.map((item) => {
                const status = (item.stock_status || "").toLowerCase();
				const hasSalePrice = item.sale_price_cents != null && item.sale_price_cents < item.price_cents;
				const isOnSale = status === "on sale" || hasSalePrice;
                const isSold   = status === "sold";
                const isInStock= status === "in stock";
                const canBuy   = (isInStock || isOnSale) && (!item.is_quantity_based || item.available_quantity > 0);
				const priceForCart = isOnSale && item.sale_price_cents ? item.sale_price_cents : item.price_cents;
                
                // Handle images - Vercel Postgres returns JSONB as parsed JavaScript values
                let images: string[] = []
                if (Array.isArray(item.images)) {
                  images = item.images.filter(img => img && typeof img === 'string')
                } else if (typeof item.images === 'string') {
                  try {
                    const parsed = JSON.parse(item.images)
                    images = Array.isArray(parsed) ? parsed.filter(img => img && typeof img === 'string') : []
                  } catch (e) {
                    images = []
                  }
                }

                const isTargetProduct = productIdParam && String(item.id) === String(productIdParam);
                const itemId = String(item.id);

                return (
                  <Card 
                    key={item.id} 
                    ref={(el) => {
                      if (isTargetProduct) {
                        productRefs.current[itemId] = el;
                      }
                    }}
                    className={`overflow-hidden flex flex-col ${isTargetProduct ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  >
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
                      {/* Stock level display for quantity-based items */}
                      {item.is_quantity_based && (
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-sm text-muted-foreground">Stock:</span>
                          <span className={`text-sm font-medium ${
                            item.available_quantity > 3 ? 'text-green-600' : 
                            item.available_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.available_quantity > 0 ? `${item.available_quantity} available` : 'Sold out'}
                          </span>
                        </div>
                      )}
                      {/* Shipping line intentionally omitted */}
                    </CardContent>

                    <CardFooter className="p-3 pt-0 gap-2 flex-col sm:flex-row">
					  {isSold ? (
						<Button disabled size="sm" variant="outline">Sold</Button>
					  ) : (
						<div className="w-full">
						  <AddToCartButton
							id={String(item.id)}               // cast number → string
							name={item.name}
							price_cents={priceForCart}
							image={images[0] ?? null}
							disabled={!canBuy}
							is_quantity_based={item.is_quantity_based}
							available_quantity={item.available_quantity}
						  />
						</div>
					  )}
					</CardFooter>
                  </Card>
                );
              })}
            </div>

            {sortedFiltered.length === 0 && (
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

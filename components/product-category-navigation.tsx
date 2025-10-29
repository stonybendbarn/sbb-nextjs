"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
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

interface ProductCategoryNavigationProps {
  currentCategory?: string;
  showAllProducts?: boolean;
}

export default function ProductCategoryNavigation({ currentCategory, showAllProducts = true }: ProductCategoryNavigationProps) {
  const pathname = usePathname();
  const isProductsPage = pathname === "/products";

  return (
    <div className="w-full mb-8">
      <div className="flex flex-wrap items-center justify-start gap-2">
        {/* All Products link - only show on category pages */}
        {showAllProducts && (
          <Link
            href="/products"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
              isProductsPage
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            All Products
          </Link>
        )}
        
        {/* Category links */}
        {categories.map((category) => {
          const isActive = currentCategory === category.value;
          return (
            <Link
              key={category.value}
              href={`/products/${category.value}`}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

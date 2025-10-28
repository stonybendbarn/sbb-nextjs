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
      <div className="bg-muted text-muted-foreground inline-flex h-9 w-full items-center justify-start rounded-lg p-[3px] overflow-x-auto flex-wrap gap-2 bg-transparent">
        {/* All Products link - only show on category pages */}
        {showAllProducts && (
          <Link
            href="/products"
            className={cn(
              "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
              isProductsPage
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
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
                "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
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

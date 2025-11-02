// components/testimonials-filter.tsx

"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { value: "all", label: "All Products" },
  { value: "cutting-boards", label: "Cutting Boards" },
  { value: "game-boards", label: "Game Boards" },
  { value: "cheese-boards", label: "Cheese Boards" },
  { value: "coasters", label: "Coasters" },
  { value: "outdoor-items", label: "Outdoor Items" },
  { value: "furniture", label: "Furniture" },
  { value: "bar-ware", label: "Bar Ware" },
  { value: "laser-engraving", label: "Laser Engraving" },
  { value: "montessori", label: "Montessori" },
  { value: "barn-finds", label: "Barn Finds!" },
];

interface TestimonialsFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TestimonialsFilter({ selectedCategory, onCategoryChange }: TestimonialsFilterProps) {
  return (
    <div className="mb-8 flex justify-center">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder="Filter by product category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


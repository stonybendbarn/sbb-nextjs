// components/testimonials-filter.tsx
// Client component for filtering testimonials by category

"use client";

import { Testimonial } from "./testimonials";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "cutting-boards", label: "Cutting Boards" },
  { value: "cheese-boards", label: "Cheese Boards" },
  { value: "coasters", label: "Coasters" },
  { value: "bar-ware", label: "Bar Ware" },
  { value: "furniture", label: "Furniture" },
  { value: "game-boards", label: "Game Boards" },
  { value: "outdoor-items", label: "Outdoor Items" },
  { value: "laser-engraving", label: "Laser Engraving" },
  { value: "montessori", label: "Montessori" },
  { value: "barn-finds", label: "Barn Finds!" },
];

interface TestimonialsFilterProps {
  testimonials: Testimonial[];
  filteredTestimonials: Testimonial[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TestimonialsFilter({ 
  testimonials, 
  filteredTestimonials, 
  selectedCategory,
  onCategoryChange 
}: TestimonialsFilterProps) {
  return (
    <div className="mb-8 max-w-md mx-auto">
      <Label htmlFor="category-filter" className="text-sm font-medium mb-2 block">
        Filter by Product Category
      </Label>
      <Select
        value={selectedCategory}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger id="category-filter">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filteredTestimonials.length !== testimonials.length && (
        <p className="text-sm text-muted-foreground mt-2">
          Showing {filteredTestimonials.length} of {testimonials.length} testimonials
        </p>
      )}
    </div>
  );
}


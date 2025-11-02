// app/testimonials/testimonials-client.tsx
// Client component wrapper for testimonials page with filtering

"use client";

import { useState, useMemo } from "react";
import { Testimonials } from "@/components/testimonials";
import { TestimonialsFilter } from "@/components/testimonials-filter";
import { Testimonial } from "@/components/testimonials";
import { getTestimonialsByCategory } from "@/lib/testimonials-data";

interface TestimonialsClientProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === "all") {
      return initialTestimonials;
    }
    return getTestimonialsByCategory(selectedCategory, initialTestimonials);
  }, [selectedCategory, initialTestimonials]);

  return (
    <>
      <TestimonialsFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* Testimonial count display */}
      <div className="text-center mb-6 text-sm text-muted-foreground">
        Showing {filteredTestimonials.length} of {initialTestimonials.length} testimonial{initialTestimonials.length !== 1 ? "s" : ""}
      </div>

      <Testimonials
        testimonials={filteredTestimonials}
        title=""
        description=""
        variant="carousel"
        showImages={true}
        showProductLink={true}
      />
    </>
  );
}


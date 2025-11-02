// app/testimonials/testimonials-client.tsx
// Client component wrapper for testimonials page with filtering

"use client";

import { useState, useMemo } from "react";
import { Testimonials } from "@/components/testimonials";
import { TestimonialSubmitForm } from "@/components/testimonial-submit-form";
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
      {/* Testimonials Section with Filter */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsFilter
            testimonials={initialTestimonials}
            filteredTestimonials={filteredTestimonials}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <Testimonials
            testimonials={filteredTestimonials}
            title=""
            description=""
            variant="carousel"
          />
        </div>
      </section>

      {/* Submit Testimonial Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialSubmitForm />
        </div>
      </section>
    </>
  );
}


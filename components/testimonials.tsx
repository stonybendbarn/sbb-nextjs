// components/testimonials.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_email?: string;
  testimonial_text: string;
  rating?: number;
  product_id?: string;
  product_name?: string;
  product_category?: string;
  is_featured?: boolean;
  created_at?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  maxDisplay?: number;
  showProductLink?: boolean;
  title?: string;
  description?: string;
  variant?: "default" | "compact" | "grid" | "carousel";
}

export function Testimonials({
  testimonials,
  maxDisplay,
  showProductLink = true,
  title,
  description,
  variant = "default",
}: TestimonialsProps) {
  // Filter approved testimonials and limit display
  const displayTestimonials = testimonials
    .filter((t) => t.is_featured !== false)
    .slice(0, maxDisplay || testimonials.length);

  if (displayTestimonials.length === 0) {
    return null;
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderProductLink = (testimonial: Testimonial) => {
    if (!showProductLink) return null;

    // If product_id exists, link to inventory page (where individual products are shown)
    // Otherwise, link to category page if category exists
    if (testimonial.product_id) {
      return (
        <div className="mt-3 pt-3 border-t border-border">
          <Link
            href={`/inventory?product=${testimonial.product_id}`}
            className="text-sm text-primary hover:underline"
          >
            View {testimonial.product_name || "Product"} →
          </Link>
        </div>
      );
    }

    if (testimonial.product_category) {
      // Handle category slug conversion
      let categorySlug = testimonial.product_category.toLowerCase();
      // If it's already a slug (e.g., "furniture"), use it as-is
      // If it's a display name (e.g., "Furniture"), convert to slug
      if (!categorySlug.includes("-")) {
        categorySlug = categorySlug.replace(/\s+/g, "-");
      }
      
      return (
        <div className="mt-3 pt-3 border-t border-border">
          <Link
            href={`/products/${categorySlug}`}
            className="text-sm text-primary hover:underline"
          >
            View {testimonial.product_name || testimonial.product_category} →
          </Link>
        </div>
      );
    }

    return null;
  };

  if (variant === "compact") {
    return (
      <div className="space-y-4">
        {displayTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Quote className="h-6 w-6 text-primary/50 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-muted-foreground italic mb-3 leading-relaxed">
                    "{testimonial.testimonial_text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.customer_name}
                      </p>
                      {testimonial.product_name && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.product_name}
                        </p>
                      )}
                    </div>
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "carousel") {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }, []);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }, [checkScrollButtons, displayTestimonials.length]);

    const scroll = (direction: "left" | "right") => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Calculate card width including gap for accurate scrolling
      const firstCard = container.children[0] as HTMLElement;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const scrollAmount = cardWidth + gap;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    };

    return (
      <div>
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="relative">
          {/* Left Chevron */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="Previous testimonials"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </button>
          )}

          {/* Scrollable Container - Shows 3 at a time, scrolls one at a time */}
          <div className="overflow-hidden md:px-12">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 md:snap-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {displayTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="flex flex-col w-[85vw] sm:w-[45vw] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start md:snap-none hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-muted-foreground italic mb-4 flex-1 leading-relaxed">
                      "{testimonial.testimonial_text}"
                    </p>
                    <div className="space-y-2">
                      {renderStars(testimonial.rating)}
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.customer_name}
                        </p>
                        {testimonial.product_name && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.product_name}
                          </p>
                        )}
                      </div>
                      {renderProductLink(testimonial)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Chevron */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="Next testimonials"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div>
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6 flex-1 flex flex-col">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground italic mb-4 flex-1 leading-relaxed">
                  "{testimonial.testimonial_text}"
                </p>
                <div className="space-y-2">
                  {renderStars(testimonial.rating)}
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.customer_name}
                    </p>
                    {testimonial.product_name && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.product_name}
                      </p>
                    )}
                  </div>
                  {renderProductLink(testimonial)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div>
      {(title || description) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6 max-w-4xl mx-auto">
        {displayTestimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="border-l-4 border-l-primary hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-6">
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-muted-foreground italic mb-4 leading-relaxed text-lg">
                "{testimonial.testimonial_text}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {testimonial.customer_name}
                  </p>
                  {testimonial.product_name && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.product_name}
                    </p>
                  )}
                </div>
                {renderStars(testimonial.rating)}
              </div>
              {renderProductLink(testimonial)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


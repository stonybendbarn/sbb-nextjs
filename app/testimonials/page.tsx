// app/testimonials/page.tsx

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TestimonialsClient } from "./testimonials-client";
import { fetchTestimonials } from "@/lib/testimonials-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Testimonials | Stony Bend Barn",
  description:
    "Read what our customers have to say about our handcrafted woodworking pieces. Real reviews from satisfied customers.",
  keywords: "testimonials, reviews, customer feedback, Stony Bend Barn, woodworking reviews",
};

export default async function TestimonialsPage() {
  const testimonials = await fetchTestimonials();

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Customer Testimonials
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              See what our customers have to say about our handcrafted woodworking pieces
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials with Filter and Submit Form */}
      <TestimonialsClient initialTestimonials={testimonials} />

      <Footer />
    </div>
  );
}


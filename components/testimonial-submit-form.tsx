// components/testimonial-submit-form.tsx
// Form component for customers to submit testimonials

"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const categories = [
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

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_location: string;
  testimonial_text: string;
  rating: number | null;
  product_name: string;
  product_category: string;
}

export function TestimonialSubmitForm() {
  const [formData, setFormData] = useState<FormData>({
    customer_name: "",
    customer_email: "",
    customer_location: "",
    testimonial_text: "",
    rating: null,
    product_name: "",
    product_category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.rating) {
      setStatus({
        type: "error",
        message: "Please select a rating.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email || undefined,
          customer_location: formData.customer_location || undefined,
          testimonial_text: formData.testimonial_text,
          rating: formData.rating,
          product_name: formData.product_name || undefined,
          product_category: formData.product_category || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Thank you for your testimonial! It will be reviewed before being published.",
        });
        // Reset form
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_location: "",
          testimonial_text: "",
          rating: null,
          product_name: "",
          product_category: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to submit testimonial. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>
          We'd love to hear about your experience with our products. Your testimonial will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {status.type && (
            <Alert variant={status.type}>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_name">Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="customer_email">Email</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customer_location">Location (optional)</Label>
            <Input
              id="customer_location"
              value={formData.customer_location}
              onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
              placeholder="City, State"
            />
          </div>

          <div>
            <Label htmlFor="testimonial_text">Testimonial *</Label>
            <Textarea
              id="testimonial_text"
              value={formData.testimonial_text}
              onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
              required
              rows={4}
              placeholder="Tell us about your experience..."
            />
          </div>

          <div>
            <Label>Rating *</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      formData.rating && rating <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold text-sm">Product Information (optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g., End Grain Cutting Board"
                />
              </div>
              <div>
                <Label htmlFor="product_category">Product Category</Label>
                <Select
                  value={formData.product_category || undefined}
                  onValueChange={(value) => setFormData({ ...formData, product_category: value || "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


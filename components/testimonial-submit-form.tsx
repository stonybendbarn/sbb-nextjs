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
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        customer_location: formData.customer_location.trim() || undefined,
        testimonial_text: formData.testimonial_text.trim(),
        rating: formData.rating || undefined,
        product_name: formData.product_name.trim() || undefined,
        product_category: formData.product_category || undefined,
      };

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit testimonial");
      }

      // Success - reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_location: "",
        testimonial_text: "",
        rating: null,
        product_name: "",
        product_category: "",
      });
      setStatus({
        type: "success",
        message: data.message || "Thank you for your testimonial! It will be reviewed before being published.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit testimonial. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating: formData.rating === rating ? null : rating });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Share Your Experience</CardTitle>
        <CardDescription>
          We'd love to hear about your experience with Stony Bend Barn. Your testimonial will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.type && (
          <Alert
            className={`mb-6 ${
              status.type === "success"
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <AlertDescription
              className={
                status.type === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }
            >
              {status.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customer_name">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                required
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="customer_email">Your Email (Optional)</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customer_location">Your Location (Optional)</Label>
            <Input
              id="customer_location"
              value={formData.customer_location}
              onChange={(e) =>
                setFormData({ ...formData, customer_location: e.target.value })
              }
              placeholder="e.g., Wake Forest, NC"
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground mt-1">
              City, State (optional - helps us show testimonials from different locations)
            </p>
          </div>

          <div>
            <Label htmlFor="testimonial_text">
              Your Testimonial <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="testimonial_text"
              value={formData.testimonial_text}
              onChange={(e) =>
                setFormData({ ...formData, testimonial_text: e.target.value })
              }
              required
              placeholder="Tell us about your experience..."
              rows={6}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Share your thoughts about our products or service
            </p>
          </div>

          <div>
            <Label>Rating (Optional)</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  disabled={isSubmitting}
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  aria-label={`Rate ${rating} stars`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      formData.rating && formData.rating >= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
              {formData.rating && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.rating} {formData.rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="product_category">Product Category (Optional)</Label>
              <Select
                value={formData.product_category || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, product_category: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
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
            </div>
            <div>
              <Label htmlFor="product_name">Product Name (Optional)</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) =>
                  setFormData({ ...formData, product_name: e.target.value })
                }
                placeholder="e.g., Dining Room Table"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


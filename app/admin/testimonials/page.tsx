"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AdminNavigation } from "@/components/admin-navigation";
import { Footer } from "@/components/footer";
import { Plus, Edit, Trash2, Star, MessageSquare } from "lucide-react";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_email?: string;
  testimonial_text: string;
  rating?: number;
  product_id?: string;
  product_name?: string;
  product_category?: string;
  is_featured: boolean;
  is_approved: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const categories = [
  '',
  'cutting-boards',
  'cheese-boards', 
  'coasters',
  'bar-ware',
  'furniture',
  'game-boards',
  'outdoor-items',
  'laser-engraving',
  'montessori',
  'barn-finds'
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    testimonial_text: '',
    rating: '',
    product_id: '',
    product_name: '',
    product_category: '',
    is_featured: false,
    is_approved: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        rating: formData.rating ? parseInt(formData.rating) : null,
        display_order: parseInt(formData.display_order.toString()) || 0,
      };

      const url = editingTestimonial 
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : '/api/admin/testimonials';
      
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
        resetForm();
        fetchTestimonials();
      } else {
        const error = await response.json();
        alert(`Failed to save testimonial: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name || '',
      customer_email: testimonial.customer_email || '',
      testimonial_text: testimonial.testimonial_text || '',
      rating: testimonial.rating?.toString() || '',
      product_id: testimonial.product_id || '',
      product_name: testimonial.product_name || '',
      product_category: testimonial.product_category || '',
      is_featured: testimonial.is_featured || false,
      is_approved: testimonial.is_approved !== false,
      display_order: testimonial.display_order || 0,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Testimonial deleted successfully');
        fetchTestimonials();
      } else {
        const error = await response.json();
        alert(`Failed to delete testimonial: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      testimonial_text: '',
      rating: '',
      product_id: '',
      product_name: '',
      product_category: '',
      is_featured: false,
      is_approved: true,
      display_order: 0,
    });
    setEditingTestimonial(null);
    setShowAddForm(false);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminNavigation />
        <div className="pt-24 pb-12 md:pb-16 bg-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminNavigation />

      <section className="pt-24 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Manage Testimonials
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4">
              Add, edit, and manage customer testimonials
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Add/Edit Form */}
            {showAddForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </CardTitle>
                  <CardDescription>
                    Fill in the details below to {editingTestimonial ? 'update' : 'add'} a testimonial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="customer_name">Customer Name *</Label>
                        <Input
                          id="customer_name"
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer_email">Customer Email</Label>
                        <Input
                          id="customer_email"
                          type="email"
                          value={formData.customer_email}
                          onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="testimonial_text">Testimonial Text *</Label>
                      <Textarea
                        id="testimonial_text"
                        value={formData.testimonial_text}
                        onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="rating">Rating (1-5)</Label>
                        <Select
                          value={formData.rating || undefined}
                          onValueChange={(value) => setFormData({ ...formData, rating: value || "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={formData.display_order}
                          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    {/* Product Linking */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="font-semibold">Product Linking (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="product_id">Product ID</Label>
                          <Input
                            id="product_id"
                            value={formData.product_id}
                            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                            placeholder="e.g., abc-123"
                          />
                        </div>
                        <div>
                          <Label htmlFor="product_name">Product Name</Label>
                          <Input
                            id="product_name"
                            value={formData.product_name}
                            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                            placeholder="e.g., Dining Room Table"
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
                              {categories.filter(c => c).map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat.replace(/-/g, ' ')}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                        />
                        <Label htmlFor="is_featured">Featured</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_approved"
                          checked={formData.is_approved}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_approved: checked as boolean })}
                        />
                        <Label htmlFor="is_approved">Approved</Label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={formLoading}>
                        {formLoading ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Testimonials List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                All Testimonials ({testimonials.length})
              </h2>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              )}
            </div>

            {testimonials.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No testimonials yet. Add your first testimonial above!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{testimonial.customer_name}</h3>
                            {renderStars(testimonial.rating)}
                            {testimonial.is_featured && (
                              <Badge className="bg-primary">Featured</Badge>
                            )}
                            {!testimonial.is_approved && (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground italic mb-3 leading-relaxed">
                            "{testimonial.testimonial_text}"
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {testimonial.product_name && (
                              <span>Product: <strong>{testimonial.product_name}</strong></span>
                            )}
                            {testimonial.product_category && (
                              <span>Category: <strong>{testimonial.product_category}</strong></span>
                            )}
                            <span>Order: {testimonial.display_order}</span>
                            {testimonial.customer_email && (
                              <span>Email: {testimonial.customer_email}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(testimonial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(testimonial.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


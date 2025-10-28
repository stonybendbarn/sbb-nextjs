"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Save, Package } from "lucide-react";

interface Product {
  id?: string;
  name: string;
  category: string;
  size: string;
  price_cents: number;
  sale_price_cents: number | null;
  stock_status: string;
  images: string[] | null;
  description: string;
  shipping_cents: number | null;
  available_quantity: number;
  is_quantity_based: boolean;
  inc_products_page: boolean;
  estimated_weight_lbs: number | null;
  length_inches: number | null;
  width_inches: number | null;
  height_inches: number | null;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  updated_at?: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  loading?: boolean;
}

const categories = [
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

const stockStatuses = [
  'In Stock',
  'On Sale', 
  'Sold Out',
  'Sold',
  'Discontinued'
];

export default function ProductForm({ product, onSave, onCancel, loading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    category: '',
    size: '',
    price_cents: 0,
    sale_price_cents: null,
    stock_status: 'In Stock',
    images: [],
    description: '',
    shipping_cents: null,
    available_quantity: 1,
    is_quantity_based: false,
    inc_products_page: false,
    estimated_weight_lbs: null,
    length_inches: null,
    width_inches: null,
    height_inches: null,
    ...product
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        size: product.size || '',
        price_cents: product.price_cents || 0,
        sale_price_cents: product.sale_price_cents || null,
        stock_status: product.stock_status || 'In Stock',
        images: product.images || [],
        description: product.description || '',
        shipping_cents: product.shipping_cents || null,
        available_quantity: product.available_quantity || 1,
        is_quantity_based: product.is_quantity_based || false,
        inc_products_page: (product as any).inc_products_page || false,
        estimated_weight_lbs: product.estimated_weight_lbs || null,
        length_inches: product.length_inches || null,
        width_inches: product.width_inches || null,
        height_inches: product.height_inches || null,
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        seo_keywords: product.seo_keywords || '',
        seo_meta_title: product.seo_meta_title || '',
        seo_meta_description: product.seo_meta_description || '',
        ...product
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price_cents || formData.price_cents <= 0) {
      newErrors.price_cents = 'Price must be greater than 0';
    }

    if (formData.sale_price_cents && formData.sale_price_cents >= formData.price_cents) {
      newErrors.sale_price_cents = 'Sale price must be less than regular price';
    }

    if (formData.is_quantity_based && (!formData.available_quantity || formData.available_quantity <= 0)) {
      newErrors.available_quantity = 'Available quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const formatPrice = (cents: number) => (cents / 100).toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD" 
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
        <CardDescription>
          {product ? 'Update product information' : 'Enter the details for your new product'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category || undefined} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="e.g., 12x8 inches, Custom, etc."
              />
            </div>

            <div>
              <Label htmlFor="stock_status">Stock Status</Label>
              <Select value={formData.stock_status || undefined} onValueChange={(value) => handleInputChange('stock_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {stockStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_cents">Regular Price (cents) *</Label>
              <Input
                id="price_cents"
                type="number"
                value={formData.price_cents}
                onChange={(e) => handleInputChange('price_cents', parseInt(e.target.value) || 0)}
                placeholder="e.g., 5000 for $50.00"
                className={errors.price_cents ? 'border-red-500' : ''}
              />
              {formData.price_cents > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(formData.price_cents)}
                </p>
              )}
              {errors.price_cents && <p className="text-sm text-red-500 mt-1">{errors.price_cents}</p>}
            </div>

            <div>
              <Label htmlFor="sale_price_cents">Sale Price (cents)</Label>
              <Input
                id="sale_price_cents"
                type="number"
                value={formData.sale_price_cents || ''}
                onChange={(e) => handleInputChange('sale_price_cents', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Optional sale price"
                className={errors.sale_price_cents ? 'border-red-500' : ''}
              />
              {formData.sale_price_cents && formData.sale_price_cents > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(formData.sale_price_cents)}
                </p>
              )}
              {errors.sale_price_cents && <p className="text-sm text-red-500 mt-1">{errors.sale_price_cents}</p>}
            </div>
          </div>

          {/* Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_quantity_based"
                checked={formData.is_quantity_based}
                onCheckedChange={(checked) => handleInputChange('is_quantity_based', checked)}
              />
              <Label htmlFor="is_quantity_based">Quantity-based inventory</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inc_products_page"
                checked={formData.inc_products_page}
                onCheckedChange={(checked) => handleInputChange('inc_products_page', checked)}
              />
              <Label htmlFor="inc_products_page">Show on category page</Label>
            </div>

            {formData.is_quantity_based && (
              <div>
                <Label htmlFor="available_quantity">Available Quantity *</Label>
                <Input
                  id="available_quantity"
                  type="number"
                  value={formData.available_quantity}
                  onChange={(e) => handleInputChange('available_quantity', parseInt(e.target.value) || 0)}
                  placeholder="Enter available quantity"
                  className={errors.available_quantity ? 'border-red-500' : ''}
                />
                {errors.available_quantity && <p className="text-sm text-red-500 mt-1">{errors.available_quantity}</p>}
              </div>
            )}
          </div>

          {/* Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_cents">Shipping Cost (cents)</Label>
              <Input
                id="shipping_cents"
                type="number"
                value={formData.shipping_cents || ''}
                onChange={(e) => handleInputChange('shipping_cents', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Optional shipping cost"
              />
              {formData.shipping_cents && formData.shipping_cents > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(formData.shipping_cents)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="estimated_weight_lbs">Weight (lbs)</Label>
              <Input
                id="estimated_weight_lbs"
                type="number"
                step="0.1"
                value={formData.estimated_weight_lbs || ''}
                onChange={(e) => handleInputChange('estimated_weight_lbs', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Estimated weight"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <Label className="text-base font-semibold">Dimensions (inches)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <Label htmlFor="length_inches">Length</Label>
                <Input
                  id="length_inches"
                  type="number"
                  step="0.1"
                  value={formData.length_inches || ''}
                  onChange={(e) => handleInputChange('length_inches', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Length in inches"
                />
              </div>
              <div>
                <Label htmlFor="width_inches">Width</Label>
                <Input
                  id="width_inches"
                  type="number"
                  step="0.1"
                  value={formData.width_inches || ''}
                  onChange={(e) => handleInputChange('width_inches', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Width in inches"
                />
              </div>
              <div>
                <Label htmlFor="height_inches">Height</Label>
                <Input
                  id="height_inches"
                  type="number"
                  step="0.1"
                  value={formData.height_inches || ''}
                  onChange={(e) => handleInputChange('height_inches', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Height in inches"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={4}
            />
          </div>

          {/* SEO Fields */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">SEO Settings (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              These fields help search engines understand your product better. Leave blank to use auto-generated content.
            </p>
            
            <div>
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="Custom title for search engines"
              />
            </div>

            <div>
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="Extended description for search engines"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="seo_keywords">SEO Keywords</Label>
              <Input
                id="seo_keywords"
                value={formData.seo_keywords}
                onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                placeholder="handcrafted, custom, hardwood, artisan"
              />
            </div>

            <div>
              <Label htmlFor="seo_meta_title">Meta Title</Label>
              <Input
                id="seo_meta_title"
                value={formData.seo_meta_title}
                onChange={(e) => handleInputChange('seo_meta_title', e.target.value)}
                placeholder="Custom meta title for HTML head"
              />
            </div>

            <div>
              <Label htmlFor="seo_meta_description">Meta Description</Label>
              <Textarea
                id="seo_meta_description"
                value={formData.seo_meta_description}
                onChange={(e) => handleInputChange('seo_meta_description', e.target.value)}
                placeholder="Custom meta description for HTML head"
                rows={2}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label className="text-base font-semibold">Product Images</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <Button type="button" onClick={addImage} variant="outline">
                  Add Image
                </Button>
              </div>
              
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="text-sm truncate flex-1">{image}</span>
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

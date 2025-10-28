"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminNavigation } from "@/components/admin-navigation";
import { Footer } from "@/components/footer";
import { Plus, Search, Edit, Trash2, Package, Filter } from "lucide-react";
import ProductForm from "@/components/ProductForm";

interface Product {
  id: string;
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
  updated_at: string;
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, statusFilter, pagination.page]);


  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Failed to delete product: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select products to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return;

    try {
      const deletePromises = Array.from(selectedProducts).map(id => 
        fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      alert('Products deleted successfully');
      setSelectedProducts(new Set());
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete products');
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectAllProducts = () => {
    setSelectedProducts(new Set(products.map(p => p.id)));
  };

  const clearSelection = () => {
    setSelectedProducts(new Set());
  };

  const handleSaveProduct = async (productData: any) => {
    setFormLoading(true);
    
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setShowAddForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Failed to save product: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const formatPrice = (cents: number) => (cents / 100).toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD" 
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminNavigation />
        <div className="pt-24 pb-12 md:pb-16 bg-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Loading products...</p>
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
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
                Product Management
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Manage your product inventory
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Product Form Modal */}
            {(showAddForm || editingProduct) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancelForm}
                    loading={formLoading}
                  />
                </div>
              </div>
            )}
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search Products</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryFilter || undefined} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Stock Status</Label>
                    <Select value={statusFilter || undefined} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {stockStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('');
                        setStatusFilter('');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Operations */}
            {products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Operations</CardTitle>
                  <CardDescription>
                    Select multiple products to perform bulk actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button 
                      onClick={selectAllProducts}
                      variant="outline"
                      size="sm"
                    >
                      Select All
                    </Button>
                    <Button 
                      onClick={clearSelection}
                      variant="outline"
                      size="sm"
                    >
                      Clear Selection
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  
                  {selectedProducts.size > 0 && (
                    <div className="flex gap-4">
                      <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products ({pagination.total})</h2>
              <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products List */}
            {products.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No products found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className={selectedProducts.has(product.id) ? 'ring-2 ring-blue-500' : ''}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedProducts.has(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription>
                              {product.category} • {product.size}
                            </CardDescription>
                            <div className="flex gap-2 mt-2">
                              <Badge variant={product.stock_status === 'In Stock' ? 'default' : 'secondary'}>
                                {product.stock_status}
                              </Badge>
                              {product.sale_price_cents && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  On Sale
                                </Badge>
                              )}
                              {product.is_quantity_based && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  Qty: {product.available_quantity}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Updated: {formatDate(product.updated_at)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              onClick={() => setEditingProduct(product)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {product.description && (
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="ml-2 font-semibold">{formatPrice(product.price_cents)}</span>
                        </div>
                        {product.sale_price_cents && (
                          <div>
                            <span className="text-muted-foreground">Sale Price:</span>
                            <span className="ml-2 font-semibold text-orange-600">{formatPrice(product.sale_price_cents)}</span>
                          </div>
                        )}
                        {product.shipping_cents && (
                          <div>
                            <span className="text-muted-foreground">Shipping:</span>
                            <span className="ml-2 font-semibold">{formatPrice(product.shipping_cents)}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <span className="ml-2 font-mono text-xs">{product.id}</span>
                        </div>
                      </div>

                      {product.images && product.images.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Images: </span>
                          <span className="text-sm">{product.images.length} image{product.images.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNavigation } from "@/components/admin-navigation";
import { Footer } from "@/components/footer";
import { ShoppingCart, Package, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/orders');
        if (!response.ok) {
          window.location.href = '/admin/login';
          return;
        }
        setLoading(false);
      } catch (error) {
        window.location.href = '/admin/login';
      }
    };

    checkAuth();
  }, []);

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
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Admin Dashboard
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4">
              Manage your business operations
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orders Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                    Order Management
                  </CardTitle>
                  <CardDescription>
                    View and manage customer orders, track shipments, and send notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• View all customer orders</li>
                    <li>• Track order status and shipping</li>
                    <li>• Send shipping notifications</li>
                    <li>• Batch operations for multiple orders</li>
                  </ul>
                  <Link href="/admin/orders">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Manage Orders
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Products Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-green-600" />
                    Product Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, and manage your product inventory and catalog
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Add new products to your catalog</li>
                    <li>• Edit existing product information</li>
                    <li>• Manage inventory and pricing</li>
                    <li>• Organize products by category</li>
                  </ul>
                  <Link href="/admin/products">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Manage Products
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Use the navigation bar above to quickly switch between Orders and Products management.
                    All changes are saved automatically and will be reflected on your website immediately.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


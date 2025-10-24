"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminNavigation } from "@/components/admin-navigation";
import { Footer } from "@/components/footer";

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_address: any;
  items: any[];
  status: string;
  tracking_number?: string;
  email_sent_at?: string;
  email_status?: string;
  email_tracking_number?: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [batchSending, setBatchSending] = useState(false);
  const [batchTrackingNumber, setBatchTrackingNumber] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendShippingNotification = async (orderId: string) => {
    setSending(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const trackingNumber = trackingNumbers[orderId];
      const response = await fetch('/api/send-shipping-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingNumber })
      });

      if (response.ok) {
        alert('Shipping notification sent successfully!');
        setTrackingNumbers(prev => ({ ...prev, [orderId]: '' }));
        fetchOrders(); // Refresh to show updated email status
      } else {
        const error = await response.json();
        alert(`Failed to send notification: ${error.error}`);
      }
    } catch (error) {
      console.error('Error sending shipping notification:', error);
      alert('Failed to send shipping notification');
    } finally {
      setSending(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Batch selection functions
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const selectAllOrders = () => {
    const pendingOrders = orders.filter(order => order.status === 'pending' && !order.email_sent_at);
    setSelectedOrders(new Set(pendingOrders.map(order => order.id)));
  };

  const clearSelection = () => {
    setSelectedOrders(new Set());
  };

  const sendBatchShippingNotification = async () => {
    if (selectedOrders.size === 0) {
      alert('Please select at least one order');
      return;
    }

    setBatchSending(true);
    
    try {
      const response = await fetch('/api/send-batch-shipping-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderIds: Array.from(selectedOrders), 
          trackingNumber: batchTrackingNumber 
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Batch shipping notification sent successfully! Processed ${result.results?.length || 0} customer(s).`);
        setBatchTrackingNumber('');
        setSelectedOrders(new Set());
        fetchOrders(); // Refresh to show updated email status
      } else {
        alert(`Failed to send batch notification: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending batch shipping notification:', error);
      alert('Failed to send batch shipping notification');
    } finally {
      setBatchSending(false);
    }
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
            <p>Loading orders...</p>
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
            <div className="mb-6">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
                Order Management
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                View and manage customer orders
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Batch Controls */}
            {orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Batch Operations</CardTitle>
                  <CardDescription>
                    Select multiple orders to send consolidated shipping notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button 
                      onClick={selectAllOrders}
                      variant="outline"
                      size="sm"
                    >
                      Select All Pending
                    </Button>
                    <Button 
                      onClick={clearSelection}
                      variant="outline"
                      size="sm"
                    >
                      Clear Selection
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  
                  {selectedOrders.size > 0 && (
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label htmlFor="batch-tracking">Tracking Number (Optional)</Label>
                        <Input
                          id="batch-tracking"
                          placeholder="Enter tracking number"
                          value={batchTrackingNumber}
                          onChange={(e) => setBatchTrackingNumber(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={sendBatchShippingNotification}
                        disabled={batchSending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {batchSending ? 'Sending...' : 'Send Consolidated Email'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No orders found</p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className={selectedOrders.has(order.id) ? 'ring-2 ring-blue-500' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                          disabled={order.email_sent_at !== null}
                        />
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>
                            {order.customer_name} ({order.customer_email})
                          </CardDescription>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={order.status === 'shipped' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                            {order.email_sent_at ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Email Sent
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                No Email
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                        {order.email_sent_at && (
                          <p className="text-xs text-muted-foreground">
                            Email: {formatDate(order.email_sent_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Items Purchased:</h4>
                      <div className="space-y-1">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} (Qty: {item.quantity})</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              ID: {item.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="ml-2 font-semibold">{formatPrice(order.subtotal_cents)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="ml-2 font-semibold">{formatPrice(order.shipping_cents)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="ml-2 font-semibold text-lg">{formatPrice(order.total_cents)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address:</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shipping_address.line1}</p>
                        {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <Label htmlFor={`tracking-${order.id}`}>Tracking Number (Optional)</Label>
                          <Input
                            id={`tracking-${order.id}`}
                            placeholder="Enter tracking number"
                            value={trackingNumbers[order.id] || ''}
                            onChange={(e) => setTrackingNumbers(prev => ({
                              ...prev,
                              [order.id]: e.target.value
                            }))}
                          />
                        </div>
                        <Button
                          onClick={() => sendShippingNotification(order.id)}
                          disabled={sending[order.id]}
                        >
                          {sending[order.id] ? 'Sending...' : 'Mark as Shipped'}
                        </Button>
                      </div>
                    )}

                    {order.tracking_number && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tracking Number:</span>
                        <span className="ml-2 font-mono">{order.tracking_number}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
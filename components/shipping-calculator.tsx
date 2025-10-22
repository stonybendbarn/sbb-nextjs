"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingCalculatorProps {
  productIds: string[];
  onShippingCalculated: (cost: number, address: any) => void;
}

interface ShippingResult {
  cost: number;
  service: string;
  days: number;
  breakdown: {
    shipping: number;
    packaging: number;
    total: number;
  };
  fallback?: boolean;
}

export default function ShippingCalculator({ productIds, onShippingCalculated }: ShippingCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingResult, setShippingResult] = useState<ShippingResult | null>(null);
  const [address, setAddress] = useState({
    name: "",
    street1: "",
    city: "",
    state: "",
    zip: "",
    country: "US"
  });

  const handleCalculateShipping = async () => {
    if (!address.zip || !address.city || !address.state) {
      alert("Please fill in at least ZIP code, city, and state");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds,
          customerAddress: address
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShippingResult(data.shipping);
        onShippingCalculated(data.shipping.cost, address);
      } else {
        alert('Failed to calculate shipping: ' + data.error);
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      alert('Failed to calculate shipping. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="mt-4">
        <Button 
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full"
        >
          📦 Calculate Shipping Cost
        </Button>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Get an accurate shipping quote before checkout.
        </p>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Calculate Shipping</CardTitle>
        <CardDescription>
          Enter your address to get an accurate shipping cost.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code *</Label>
            <Input
              id="zip"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              placeholder="12345"
              required
            />
          </div>
          <div>
            <Label htmlFor="street1">Street Address</Label>
            <Input
              id="street1"
              value={address.street1}
              onChange={(e) => setAddress({ ...address, street1: e.target.value })}
              placeholder="123 Main St"
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="Raleigh"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              placeholder="NC"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleCalculateShipping}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Calculating..." : "Calculate Shipping"}
          </Button>
          <Button 
            onClick={() => setIsOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
        </div>

        {shippingResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Shipping Cost
            </h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                ${shippingResult.cost}
              </div>
              <div className="text-sm text-green-600 mt-1">
                Shipping Cost
              </div>
            </div>
            {shippingResult.fallback && (
              <p className="text-xs text-green-600 mt-2">
                Using estimated rates (Shippo API unavailable)
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Shippo shipping integration for Stony Bend Barn
export interface ShippingRequest {
  address_from: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  address_to: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  parcels: Array<{
    length: string;
    width: string;
    height: string;
    weight: string;
    mass_unit: string;
    distance_unit: string;
  }>;
}

export interface ShippingRate {
  amount: string;
  currency: string;
  servicelevel: {
    name: string;
  };
  estimated_days: number;
  provider: string;
}

export interface ShippingResponse {
  rates: ShippingRate[];
}

export class ShippoShipping {
  private apiKey: string;
  private fromAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fromAddress = {
      name: "Stony Bend Barn",
      street1: "123 Main St", // Update with your real address
      city: "Wake Forest",
      state: "NC",
      zip: "27587",
      country: "US"
    };
  }

  /**
   * Calculate shipping cost for a single product
   */
  async calculateShipping(
    product: {
      weight_oz: number;
      length_inches: number;
      width_inches: number;
      height_inches: number;
    },
    customerAddress: {
      name: string;
      street1: string;
      city: string;
      state: string;
      zip: string;
      country?: string;
    },
    orderValue: number = 0
  ): Promise<{
    cost: number;
    service: string;
    days: number;
    insurance?: number;
  }> {
    const request: ShippingRequest = {
      address_from: this.fromAddress,
      address_to: {
        ...customerAddress,
        country: customerAddress.country || "US"
      },
      parcels: [{
        length: product.length_inches.toString(),
        width: product.width_inches.toString(),
        height: product.height_inches.toString(),
        weight: (product.weight_oz / 16).toString(), // Convert oz to lbs
        mass_unit: "lb",
        distance_unit: "in"
      }]
    };

    try {
      const response = await fetch('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Shippo API error: ${response.status}`);
      }

      const data: ShippingResponse = await response.json();
      
      if (!data.rates || data.rates.length === 0) {
        throw new Error('No shipping rates available');
      }

      // Find the best "standard" shipping option
      // Priority: Ground Advantage > Priority Mail > others
      let bestRate = data.rates.find(rate => 
        rate.servicelevel.name.toLowerCase().includes('ground advantage')
      );
      
      if (!bestRate) {
        bestRate = data.rates.find(rate => 
          rate.servicelevel.name.toLowerCase().includes('priority mail') &&
          !rate.servicelevel.name.toLowerCase().includes('express')
        );
      }
      
      if (!bestRate) {
        // Fallback to cheapest option
        bestRate = data.rates.reduce((cheapest, current) => 
          parseFloat(current.amount) < parseFloat(cheapest.amount) ? current : cheapest
        );
      }

      const cost = parseFloat(bestRate.amount);
      
      // Calculate insurance for orders over $100
      let insurance = 0;
      if (orderValue > 100) {
        // Round up to next $100 increment
        insurance = Math.ceil(orderValue / 100) * 100;
      }

      return {
        cost,
        service: bestRate.servicelevel.name,
        days: bestRate.estimated_days,
        insurance: insurance > 0 ? insurance : undefined
      };

    } catch (error) {
      console.error('Shippo shipping calculation error:', error);
      throw new Error('Unable to calculate shipping cost');
    }
  }

  /**
   * Calculate combined shipping for multiple products
   */
  async calculateCombinedShipping(
    products: Array<{
      weight_oz: number;
      length_inches: number;
      width_inches: number;
      height_inches: number;
    }>,
    customerAddress: {
      name: string;
      street1: string;
      city: string;
      state: string;
      zip: string;
      country?: string;
    },
    orderValue: number = 0
  ): Promise<{
    cost: number;
    service: string;
    days: number;
    insurance?: number;
  }> {
    if (products.length === 0) {
      return { cost: 0, service: 'No items', days: 0 };
    }

    if (products.length === 1) {
      return this.calculateShipping(products[0], customerAddress, orderValue);
    }

    // For multiple items, calculate combined dimensions and weight
    const totalWeight = products.reduce((sum, p) => sum + p.weight_oz, 0);
    const maxLength = Math.max(...products.map(p => p.length_inches));
    const maxWidth = Math.max(...products.map(p => p.width_inches));
    const totalHeight = products.reduce((sum, p) => sum + p.height_inches, 0);

    const combinedProduct = {
      weight_oz: totalWeight,
      length_inches: maxLength,
      width_inches: maxWidth,
      height_inches: totalHeight
    };

    return this.calculateShipping(combinedProduct, customerAddress, orderValue);
  }

  /**
   * Get fallback shipping cost (when API fails)
   */
  getFallbackShipping(category: string): number {
    const fallbackRates = {
      'cutting-boards': 1500,  // $15.00
      'cheese-boards': 800,    // $8.00
      'coasters': 500,         // $5.00
      'bar-ware': 600,         // $6.00
      'furniture': 2500,       // $25.00
      'default': 1000          // $10.00
    };

    return fallbackRates[category as keyof typeof fallbackRates] || fallbackRates.default;
  }
}

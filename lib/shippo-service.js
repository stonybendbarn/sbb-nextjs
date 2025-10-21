// Shippo shipping service for Stony Bend Barn
// Simple implementation with $5 packaging and dollar rounding

const SHIPPO_API_KEY = process.env.SHIPPO_API;

const FROM_ADDRESS = {
  name: "Stony Bend Barn",
  street1: "123 Main St", // Update with your real address
  city: "Wake Forest", 
  state: "NC",
  zip: "27587",
  country: "US"
};

const PACKAGING_COST = 5.00; // $5 for all orders

/**
 * Calculate shipping cost using Shippo API
 */
async function calculateShippoShipping(products, customerAddress, orderValue = 0) {
  if (!SHIPPO_API_KEY) {
    throw new Error('Shippo API key not configured');
  }

  try {
    // Calculate combined package dimensions and weight
    const totalWeight = products.reduce((sum, p) => sum + p.weight_oz, 0);
    const maxLength = Math.max(...products.map(p => p.length_inches));
    const maxWidth = Math.max(...products.map(p => p.width_inches));
    const totalHeight = products.reduce((sum, p) => sum + p.height_inches, 0);

    const shippingRequest = {
      address_from: FROM_ADDRESS,
      address_to: {
        name: customerAddress.name || "Customer",
        street1: customerAddress.street1 || customerAddress.line1 || "123 Main St",
        city: customerAddress.city,
        state: customerAddress.state,
        zip: customerAddress.postal_code || customerAddress.zip,
        country: customerAddress.country || "US"
      },
      parcels: [{
        length: maxLength.toString(),
        width: maxWidth.toString(), 
        height: totalHeight.toString(),
        weight: (totalWeight / 16).toString(), // Convert oz to lbs
        mass_unit: "lb",
        distance_unit: "in"
      }]
    };

    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shippingRequest)
    });

    if (!response.ok) {
      throw new Error(`Shippo API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.rates || data.rates.length === 0) {
      throw new Error('No shipping rates available');
    }

    // Find the best "standard" shipping option (Ground Advantage preferred)
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

    const shippingCost = parseFloat(bestRate.amount);
    
    // Add packaging cost
    const totalCost = shippingCost + PACKAGING_COST;
    
    // Round to nearest dollar
    const finalCost = Math.round(totalCost);
    
    return {
      cost: finalCost,
      service: bestRate.servicelevel.name,
      days: bestRate.estimated_days,
      breakdown: {
        shipping: shippingCost,
        packaging: PACKAGING_COST,
        total: finalCost
      }
    };

  } catch (error) {
    console.error('Shippo shipping calculation error:', error);
    throw new Error('Unable to calculate shipping cost');
  }
}

/**
 * Get fallback shipping cost (your current system)
 */
function getFallbackShipping(category) {
  const fallbackRates = {
    'cutting-boards': 5000,   // $50.00
    'cheese-boards': 2500,     // $25.00
    'coasters': 1200,          // $12.00
    'bar-ware': 1500,          // $15.00
    'furniture': 15000,        // $150.00
    'default': 2000            // $20.00
  };

  return fallbackRates[category] || fallbackRates.default;
}

module.exports = {
  calculateShippoShipping,
  getFallbackShipping
};

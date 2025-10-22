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
    const maxLength = Math.max(...products.map(p => parseFloat(p.length_inches)));
    const maxWidth = Math.max(...products.map(p => parseFloat(p.width_inches)));
    const totalHeight = products.reduce((sum, p) => sum + parseFloat(p.height_inches), 0);

    console.log('Product dimensions:', products.map(p => ({
      length: p.length_inches,
      width: p.width_inches, 
      height: p.height_inches
    })));
    console.log('Combined dimensions:', { maxLength, maxWidth, totalHeight });

    // Add 2" to each dimension for packaging (bubble wrap, peanuts, box walls)
    const packagedLength = maxLength + 2;
    const packagedWidth = maxWidth + 2;
    const packagedHeight = totalHeight + 2;

    console.log('Packaged dimensions:', { packagedLength, packagedWidth, packagedHeight });

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
        length: parseFloat(packagedLength.toString()),
        width: parseFloat(packagedWidth.toString()), 
        height: parseFloat(packagedHeight.toString()),
        weight: parseFloat((totalWeight / 16).toString()), // Convert oz to lbs
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

    console.log('Shippo API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shippo API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        request: shippingRequest
      });
      throw new Error(`Shippo API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Shippo API response data:', JSON.stringify(data, null, 2));
    
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
    
    // Use passed order value for insurance calculation
    const totalOrderValue = orderValue;
    
    // Add packaging cost
    let totalCost = shippingCost + PACKAGING_COST;
    
    // Add insurance for orders over $100 (in $100 increments, rounded UP)
    if (totalOrderValue > 10000) { // $100.00 in cents
      const insuranceIncrements = Math.ceil(totalOrderValue / 10000); // Round UP to next $100 increment
      const insuranceCost = insuranceIncrements * 100; // $1 per $100 of value
      totalCost += insuranceCost;
      console.log(`Adding insurance: $${insuranceCost} for order value $${totalOrderValue / 100}`);
    }
    
    // Round to nearest dollar
    const finalCost = Math.round(totalCost);
    
    return {
      cost: finalCost,
      service: bestRate.servicelevel.name,
      days: bestRate.estimated_days,
      breakdown: {
        shipping: shippingCost,
        packaging: PACKAGING_COST,
        insurance: totalOrderValue > 10000 ? Math.ceil(totalOrderValue / 10000) * 100 : 0,
        total: finalCost
      }
    };

  } catch (error) {
    console.error('Shippo shipping calculation error:', error);
    console.log('Falling back to estimated rates');
    // Fallback to estimated rates
    return getFallbackShipping(products, customerAddress);
  }
}

/**
 * Get fallback shipping cost (your current system)
 */
function getFallbackShipping(products, customerAddress) {
  // Simple fallback based on total weight
  const totalWeight = products.reduce((sum, p) => sum + p.weight_oz, 0);
  
  let baseRate = 1200; // $12.00 base rate
  
  // Add weight-based pricing
  if (totalWeight > 80) { // Over 5 lbs
    baseRate = 2000; // $20.00
  } else if (totalWeight > 48) { // Over 3 lbs
    baseRate = 1500; // $15.00
  }
  
  // Add packaging cost
  const totalCost = baseRate + PACKAGING_COST;
  
  // Round to nearest dollar
  const finalCost = Math.round(totalCost / 100);
  
  return {
    cost: finalCost,
    service: 'Standard Shipping',
    days: 5,
    fallback: true,
    breakdown: {
      shipping: baseRate / 100,
      packaging: PACKAGING_COST,
      total: finalCost
    }
  };
}

module.exports = {
  calculateShippoShipping,
  getFallbackShipping
};

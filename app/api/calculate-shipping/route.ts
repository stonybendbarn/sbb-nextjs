import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { calculateShippoShipping } from "@/lib/shippo-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productIds, customerAddress } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Product IDs are required" }, { status: 400 });
    }

    if (!customerAddress || !customerAddress.zip) {
      return NextResponse.json({ error: "Customer address with ZIP code is required" }, { status: 400 });
    }

    // Get products with shipping dimensions
    const { rows } = await sql`
      SELECT
        id,
        name,
        category,
        estimated_weight_lbs,
        length_inches,
        width_inches,
        height_inches
      FROM products
      WHERE id = ANY(${productIds})
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // Prepare products for Shippo calculation (actual dimensions, no padding yet)
    const productsForShipping = rows.map(row => ({
      weight_oz: (row.estimated_weight_lbs || 0) * 16, // Convert lbs to oz
      length_inches: row.length_inches || 0, // Actual dimensions
      width_inches: row.width_inches || 0,   // Actual dimensions
      height_inches: row.height_inches || 0, // Actual dimensions
      shipping_class: 'standard'
    }));

    try {
      console.log('Calculating shipping for:', {
        products: productsForShipping,
        address: customerAddress
      });
      
      // Calculate total order value for insurance
      const totalOrderValue = rows.reduce((sum, row) => {
        const price = row.sale_price_cents || row.price_cents || 0;
        return sum + price;
      }, 0);

      // Calculate shipping using Shippo
      const shippoResult = await calculateShippoShipping(
        productsForShipping,
        customerAddress,
        totalOrderValue
      );

      return NextResponse.json({
        success: true,
        shipping: {
          cost: shippoResult.cost,
          service: shippoResult.service,
          days: shippoResult.days,
          breakdown: shippoResult.breakdown
        }
      });

    } catch (shippoError) {
      console.error('Shippo calculation failed:', shippoError);
      
      // Fallback to category-based rates
      const fallbackRates = {
        'cutting-boards': 5000,   // $50.00
        'cheese-boards': 2500,    // $25.00
        'coasters': 1200,         // $12.00
        'bar-ware': 1500,         // $15.00
        'furniture': 15000,       // $150.00
        'default': 2000           // $20.00
      };

      let totalFallbackCost = 0;
      for (const row of rows) {
        const categoryRate = fallbackRates[row.category as keyof typeof fallbackRates] || fallbackRates.default;
        totalFallbackCost += categoryRate;
      }

      return NextResponse.json({
        success: true,
        shipping: {
          cost: Math.round(totalFallbackCost / 100), // Convert cents to dollars
          service: "Estimated Shipping",
          days: 5,
          breakdown: {
            shipping: totalFallbackCost / 100,
            packaging: 5.00,
            total: Math.round(totalFallbackCost / 100)
          },
          fallback: true
        }
      });
    }

  } catch (error) {
    console.error('Shipping calculation error:', error);
    return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 });
  }
}

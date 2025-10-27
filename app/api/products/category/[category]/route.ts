import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;

    const result = await sql`
      SELECT 
        id,
        name,
        category,
        size,
        description,
        price_cents,
        sale_price_cents,
        stock_status,
        images,
        shipping_cents
      FROM products
      WHERE category = ${category}
        AND inc_products_page = true
      ORDER BY price_cents DESC
    `;

    return NextResponse.json({ products: result.rows });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Fetch all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // For now, let's simplify and get all products, then filter in the application
    // This avoids the complex dynamic SQL issues
    const { rows } = await sql`
      SELECT 
        id, name, category, size, price_cents, sale_price_cents, stock_status,
        images, description, shipping_cents, available_quantity, is_quantity_based, inc_products_page,
        estimated_weight_lbs, length_inches, width_inches, height_inches,
        updated_at
      FROM products 
      ORDER BY 
        CASE category
          WHEN 'cutting-boards' THEN 1
          WHEN 'cheese-boards' THEN 2
          WHEN 'coasters' THEN 3
          WHEN 'bar-ware' THEN 4
          WHEN 'laser-engraving' THEN 5
          WHEN 'furniture' THEN 6
          ELSE 7
        END,
        name ASC
    `;

    // Apply filters in JavaScript
    let filteredProducts = rows;

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.stock_status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return NextResponse.json({ 
      products: paginatedProducts, 
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      name,
      category,
      size,
      price_cents,
      sale_price_cents,
      stock_status = 'In Stock',
      images = [],
      description,
      shipping_cents,
      available_quantity = 1,
      is_quantity_based = false,
      inc_products_page = false,
      estimated_weight_lbs,
      length_inches,
      width_inches,
      height_inches
    } = body;

    // Validate required fields
    if (!name || !category || !price_cents) {
      return NextResponse.json({ 
        error: "Missing required fields: name, category, and price_cents are required" 
      }, { status: 400 });
    }

    // Get the next ID by finding the max ID and adding 1
    const maxIdResult = await sql`
      SELECT COALESCE(MAX(CAST(id AS INTEGER)), 0) as max_id FROM products
    `
    const nextId = (parseInt(maxIdResult.rows[0].max_id) + 1).toString()

    const { rows } = await sql`
      INSERT INTO products (
        id, name, category, size, price_cents, sale_price_cents, stock_status,
        images, description, shipping_cents, available_quantity, is_quantity_based, inc_products_page,
        estimated_weight_lbs, length_inches, width_inches, height_inches
      ) VALUES (
        ${nextId}, ${name}, ${category}, ${size || ''}, ${price_cents}, ${sale_price_cents || null},
        ${stock_status}, ${JSON.stringify(images)}, ${description || ''}, ${shipping_cents || null},
        ${available_quantity}, ${is_quantity_based}, ${inc_products_page}, ${estimated_weight_lbs || null},
        ${length_inches || null}, ${width_inches || null}, ${height_inches || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ product: rows[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

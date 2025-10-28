import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Fetch single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rows } = await sql`
      SELECT 
        id, name, category, size, price_cents, sale_price_cents, stock_status,
        images, description, shipping_cents, available_quantity, is_quantity_based, inc_products_page,
        estimated_weight_lbs, length_inches, width_inches, height_inches,
        seo_title, seo_description, seo_keywords, seo_meta_title, seo_meta_description,
        updated_at
      FROM products 
      WHERE id = ${params.id}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: rows[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT: Update product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    const {
      name,
      category,
      size,
      price_cents,
      sale_price_cents,
      stock_status,
      images,
      description,
      shipping_cents,
      available_quantity,
      is_quantity_based,
      inc_products_page,
      estimated_weight_lbs,
      length_inches,
      width_inches,
      height_inches,
      seo_title,
      seo_description,
      seo_keywords,
      seo_meta_title,
      seo_meta_description
    } = body;

    // Validate required fields
    if (!name || !category || !price_cents) {
      return NextResponse.json({ 
        error: "Missing required fields: name, category, and price_cents are required" 
      }, { status: 400 });
    }

    const { rows } = await sql`
      UPDATE products SET
        name = ${name},
        category = ${category},
        size = ${size || ''},
        price_cents = ${price_cents},
        sale_price_cents = ${sale_price_cents || null},
        stock_status = ${stock_status || 'In Stock'},
        images = ${JSON.stringify(images || [])},
        description = ${description || ''},
        shipping_cents = ${shipping_cents || null},
        available_quantity = ${available_quantity || 1},
        is_quantity_based = ${is_quantity_based || false},
        inc_products_page = ${inc_products_page || false},
        estimated_weight_lbs = ${estimated_weight_lbs || null},
        length_inches = ${length_inches || null},
        width_inches = ${width_inches || null},
        height_inches = ${height_inches || null},
        seo_title = ${seo_title || null},
        seo_description = ${seo_description || null},
        seo_keywords = ${seo_keywords || null},
        seo_meta_title = ${seo_meta_title || null},
        seo_meta_description = ${seo_meta_description || null},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: rows[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE: Delete product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rows } = await sql`
      DELETE FROM products 
      WHERE id = ${params.id}
      RETURNING id, name
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully", product: rows[0] });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

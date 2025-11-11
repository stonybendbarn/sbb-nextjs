// app/api/events/route.ts

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// GET: Fetch all events for public display
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id, title, date, time, location, address, description,
        type, image, spots, price,
        created_at, updated_at
      FROM events
      ORDER BY date ASC, created_at DESC
    `;

    return NextResponse.json({ events: rows });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}


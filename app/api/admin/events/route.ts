// app/api/admin/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// GET: Fetch all events
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id, title, date, time, location, address, description,
        type, image, spots, price,
        created_at, updated_at
      FROM events
      ORDER BY date DESC, created_at DESC
    `;

    return NextResponse.json({ events: rows });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST: Create a new event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      date, // YYYYMMDD format
      time,
      location,
      address,
      description,
      type,
      image,
      spots,
      price,
    } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    // Validate date format (YYYYMMDD)
    if (!/^\d{8}$/.test(date)) {
      return NextResponse.json(
        { error: "Date must be in YYYYMMDD format (e.g., 20251208)" },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO events (
        title, date, time, location, address, description,
        type, image, spots, price
      ) VALUES (
        ${title},
        ${date},
        ${time || null},
        ${location || null},
        ${address || null},
        ${description || null},
        ${type || null},
        ${image || null},
        ${spots || null},
        ${price || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ event: rows[0] });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}


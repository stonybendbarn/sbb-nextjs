// app/api/admin/events/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// PUT: Update an event
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const {
      title,
      date,
      time,
      location,
      address,
      description,
      type,
      image,
      spots,
      price,
    } = body;

    // Validate date format if provided
    if (date && !/^\d{8}$/.test(date)) {
      return NextResponse.json(
        { error: "Date must be in YYYYMMDD format (e.g., 20251208)" },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      UPDATE events
      SET
        title = COALESCE(${title}, title),
        date = COALESCE(${date}, date),
        time = COALESCE(${time}, time),
        location = COALESCE(${location}, location),
        address = COALESCE(${address}, address),
        description = COALESCE(${description}, description),
        type = COALESCE(${type}, type),
        image = COALESCE(${image}, image),
        spots = COALESCE(${spots}, spots),
        price = COALESCE(${price}, price),
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: rows[0] });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE: Delete an event
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rows } = await sql`
      DELETE FROM events
      WHERE id = ${params.id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}


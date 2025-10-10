// app/api/custom-orders/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, method: "POST", echo: body });
}

export async function GET() {
  // Make it obvious GET isn't allowed so we can see it in a browser.
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}

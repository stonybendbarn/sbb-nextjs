import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = typeof req.body === "string" ? safeParse(req.body) : (req.body ?? {});
    return res.status(200).json({ ok: true, route: "/api/ping", method: "POST", echo: body });
  }
  return res.status(200).json({ ok: true, route: "/api/ping", method: "GET" });
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}

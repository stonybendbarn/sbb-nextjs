import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const body = typeof req.body === "string" ? safeParse(req.body) : (req.body ?? {});
    const { firstName, lastName, email } = body as { firstName?: string; lastName?: string; email?: string };

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ ok: false, error: "Missing firstName, lastName, or email" });
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.ORDER_EMAIL!,
      reply_to: email,
      subject: `New Custom Order from ${firstName} ${lastName}`,
      text: `New order request from ${firstName} ${lastName} (${email})`,
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}

import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, website } = await req.json();

    // Honeypot: bots fill this hidden field
    if (website) return NextResponse.json({ ok: true });

    if (typeof email !== "string" || email.length > 254 || !EMAIL.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Where the emails go (a form service, a Google Sheet script, or your database later)
    const hook = process.env.WAITLIST_WEBHOOK_URL;
    if (!hook) {
      return NextResponse.json({ error: "Not open yet" }, { status: 503 });
    }

    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "landing",
        at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Could not save" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { resumeId, category, template } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "Missing resume id" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            // Comes back in the webhook, so we know which resume was paid for
            checkout_data: {
              custom: { resume_id: resumeId, category, template },
            },
            product_options: {
              redirect_url: `${siteUrl}/success?rid=${resumeId}`,
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: "variants", id: process.env.LEMONSQUEEZY_VARIANT_ID },
            },
          },
        },
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Lemon Squeezy error:", JSON.stringify(json));
      return NextResponse.json({ error: "Could not create checkout" }, { status: 502 });
    }

    return NextResponse.json({ url: json.data.attributes.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
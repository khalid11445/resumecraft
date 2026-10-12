import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { examples } from "@/lib/examples";

// Development helper: writes an example image straight into public/examples.
// It refuses to run in production.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const name = String(form.get("name") ?? "");
    const lang = form.get("lang") === "fr" ? "fr" : "en";

    // Only the known example ids are accepted, so no other file can be written
    const ex = examples.find((e) => e.id === name);
    if (!ex || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const filename = lang === "fr" ? `${ex.id}-fr.png` : `${ex.id}.png`;
    const dir = path.join(process.cwd(), "public", "examples");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, filename),
      Buffer.from(await file.arrayBuffer())
    );

    return NextResponse.json({ ok: true, filename });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save the image" }, { status: 500 });
  }
}
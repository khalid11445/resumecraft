import Link from "next/link";
import { categories } from "@/lib/categories";

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">Choose your profession</h1>
      <p className="mt-2 text-gray-600">
        Pick a category and we'll start you with the right layout and sections.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/builder/${c.id}`}
            className="rounded-lg border border-gray-300 p-5 transition hover:border-blue-500 hover:shadow"
          >
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            <p className="mt-3 text-xs text-gray-500">
              Sections: {c.recommendedSections.join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
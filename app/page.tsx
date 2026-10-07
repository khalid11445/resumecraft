import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Resumes built for your profession
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Pick your field, edit with a live preview, and download a clean,
          professional PDF in minutes.
        </p>
        <Link
          href="/templates"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Build my resume
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold">Choose your profession</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/builder/${c.id}`}
              className="rounded-lg border border-gray-300 p-5 transition hover:border-blue-500 hover:shadow"
            >
              <h3 className="font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
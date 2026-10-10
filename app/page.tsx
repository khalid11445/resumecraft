import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";
import PricingSection from "@/components/site/PricingSection";

const steps = [
  {
    n: "01",
    title: "Choose your profession",
    text: "Each field starts with the right sections and example content.",
  },
  {
    n: "02",
    title: "Edit with a live preview",
    text: "Type on the left and watch your resume update on the right.",
  },
  {
    n: "03",
    title: "Download your PDF",
    text: "Switch templates anytime without retyping a single word.",
  },
];

const homeExamples = [
  "nurse-modern.png",
  "tech-modern.png",
  "banking-compact.png",
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">
            Professional resume builder
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
            Resumes that look as good as your experience
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300">
            Choose your profession, edit with a live preview, and download a
            clean, elegant PDF in minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/templates"
              className="rounded-md bg-amber-300 px-7 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-200"
            >
              Build my resume
            </Link>
            <Link
              href="#professions"
              className="rounded-md border border-slate-600 px-7 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              See professions
            </Link>
          </div>
        </div>
      </section>

      {/* Professions */}
      <section id="professions" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Made for your profession
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/builder/${c.id}`}
                className="rounded-lg border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.description}</p>
                <p className="mt-4 text-xs font-medium text-amber-700">
                  Start building →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="text-sm font-semibold text-amber-700">{s.n}</p>
                <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Resumes made with our templates
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {homeExamples.map((file) => (
              <div
                key={file}
                className="relative aspect-[210/297] overflow-hidden rounded-md border border-slate-200"
              >
                <Image
                  src={`/examples/${file}`}
                  alt="Example resume"
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/examples"
              className="text-sm font-semibold text-amber-700 hover:underline"
            >
              See all examples
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />
    </main>
  );
}
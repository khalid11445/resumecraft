import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Resume examples" };

const examples = [
  { file: "banking-compact.png", profession: "Banking", style: "Compact" },
  { file: "nurse-elegant.png", profession: "Nurse", style: "Elegant" },
  { file: "nurse-modern.png", profession: "Nurse", style: "Modern" },
  { file: "student-classic.png", profession: "Student", style: "Classic" },
  { file: "teacher-elegant.png", profession: "Teacher", style: "Elegant" },
  { file: "tech-modern.png", profession: "Technology", style: "Modern" },
];

export default function ExamplesPage() {
  return (
    <main className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-center text-3xl font-semibold text-slate-900">
          Resume examples
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600">
          Real resumes made with our templates. Each profession has its own
          color, and you can change it.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex, i) => (
            <div key={ex.file}>
              <div className="relative aspect-[210/297] w-full overflow-hidden rounded-md border border-slate-200 bg-white">
                <Image
                  src={`/examples/${ex.file}`}
                  alt={`${ex.profession} resume, ${ex.style} template`}
                  fill
                  loading={i < 3 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
                  className="object-contain"
                />
              </div>
              <h2 className="mt-3 font-semibold text-slate-900">
                {ex.profession}
              </h2>
              <p className="text-sm text-slate-600">{ex.style} template</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/templates"
            className="inline-block rounded-md bg-slate-900 px-7 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Build my resume
          </Link>
        </div>
      </div>
    </main>
  );
}
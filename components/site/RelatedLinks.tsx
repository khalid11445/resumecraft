import Link from "next/link";
import { Lang } from "@/lib/labels";
import { hrefFor, linkById } from "@/lib/sitelinks";

// For each page, the pages worth visiting next
const SUGGEST: Record<string, string[]> = {
  builder: ["examples", "stage", "letter", "tracker"],
  examples: ["builder", "stage", "interview", "tracker"],
  stage: ["letter", "builder", "interview", "tracker"],
  letter: ["stage", "builder", "interview", "tracker"],
  tracker: ["interview", "builder", "letter", "stage"],
  interview: ["tracker", "builder", "letter", "stage"],
  crm: ["pipeline", "messages", "team", "teamplans"],
  pricing: ["builder", "crm", "teamplans", "tracker"],
};

export default function RelatedLinks({
  lang,
  current,
}: {
  lang: Lang;
  current: keyof typeof SUGGEST | string;
}) {
  const ids = SUGGEST[current] ?? SUGGEST.builder;
  const links = ids
    .map((id) => linkById(id))
    .filter((l): l is NonNullable<typeof l> => !!l);

  return (
    <section className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          {lang === "fr" ? "Pour aller plus loin" : "Keep going"}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <Link
              key={l.id}
              href={hrefFor(l.href, lang)}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
            >
              <p className="font-semibold text-slate-900">{l.title[lang]}</p>
              <p className="mt-1 text-sm text-slate-600">{l.desc[lang]}</p>
              <p className="mt-3 text-xs font-semibold text-blue-600">
                {lang === "fr" ? "Ouvrir" : "Open"}{" "}
                <span className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { Lang } from "@/lib/labels";

const T = {
  en: {
    title: "Choose your profession",
    text: "Pick a category and we'll start you with the right layout and sections.",
    sections: "Sections",
  },
  fr: {
    title: "Choisissez votre métier",
    text: "Choisissez une catégorie : nous vous proposons les bonnes sections et un contenu de départ.",
    sections: "Sections",
  },
};

export default function TemplatesView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const base = lang === "fr" ? "/fr" : "";

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">{t.title}</h1>
      <p className="mt-2 text-gray-600">{t.text}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getCategories(lang).map((c) => (
          <Link
            key={c.id}
            href={`${base}/builder/${c.id}`}
            className="rounded-lg border border-gray-300 p-5 transition hover:border-blue-500 hover:shadow"
          >
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            <p className="mt-3 text-xs text-gray-500">
              {t.sections} : {c.recommendedSections.join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
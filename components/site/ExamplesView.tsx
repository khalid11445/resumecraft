import Image from "next/image";
import Link from "next/link";
import { examples, exampleImage, builderLink, exampleLabel } from "@/lib/examples";
import { Lang } from "@/lib/labels";

const T = {
  en: {
    title: "Resume examples",
    text: "Different professions, layouts, and colors. Click any design to open it in the builder and make it yours. All names and details are samples.",
    use: "Use this design →",
  },
  fr: {
    title: "Exemples de CV",
    text: "Différents métiers, modèles et couleurs. Cliquez sur un design pour l'ouvrir dans le créateur et le faire vôtre. Tous les noms et détails sont fictifs.",
    use: "Utiliser ce design →",
  },
};

export default function ExamplesView({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">{t.title}</h1>
      <p className="mt-3 max-w-xl text-slate-600">{t.text}</p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((ex) => (
          <Link key={ex.id} href={builderLink(ex, lang)} className="group block">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
              <Image
                src={exampleImage(ex.id, lang)}
                alt={exampleLabel(ex, lang)}
                width={1190}
                height={1684}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-900">
              {exampleLabel(ex, lang)}
            </p>
            <p className="text-xs font-medium text-amber-700">{t.use}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
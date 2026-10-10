import Link from "next/link";

// Edit this array to change plans, prices and currency.
// Prices are placeholders: payments come later.
const CURRENCY = "$";

type Plan = {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Create your first resume and try it out.",
    features: [
      "2 resume templates",
      "Change the color for your profession",
      "Export as a PNG image",
    ],
    cta: "Start for free",
    href: "/templates",
  },
  {
    name: "Single template",
    price: 4,
    period: "per template",
    description: "Found a template you love? Buy it on its own.",
    features: [
      "1 premium template of your choice",
      "PDF without watermark",
      "High-quality PNG export",
    ],
    cta: "Pick a template",
    href: "/templates",
  },
  {
    name: "All templates",
    price: 9,
    period: "per month",
    description: "Every template, for applying to several jobs.",
    features: [
      "All premium templates",
      "A4 and US Letter formats",
      "New templates included",
    ],
    cta: "Get all templates",
    href: "/templates",
    highlighted: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-semibold text-slate-900">
          Simple pricing for every resume template
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600">
          Start for free. Pay only if you want a premium template or access to
          all of them.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? "flex flex-col rounded-lg border border-slate-900 bg-slate-900 p-6 text-white"
                  : "flex flex-col rounded-lg border border-slate-200 bg-white p-6"
              }
            >
              <h3
                className={
                  plan.highlighted
                    ? "font-semibold text-white"
                    : "font-semibold text-slate-900"
                }
              >
                {plan.name}
              </h3>
              <p
                className={
                  plan.highlighted
                    ? "mt-2 text-sm text-slate-300"
                    : "mt-2 text-sm text-slate-600"
                }
              >
                {plan.description}
              </p>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tabular-nums">
                  {CURRENCY}
                  {plan.price}
                </span>
                <span
                  className={
                    plan.highlighted
                      ? "text-sm text-slate-300"
                      : "text-sm text-slate-600"
                  }
                >
                  {plan.period}
                </span>
              </p>

              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className={
                        plan.highlighted ? "text-amber-300" : "text-amber-700"
                      }
                    >
                      ✓
                    </span>
                    <span
                      className={
                        plan.highlighted ? "text-slate-200" : "text-slate-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={
                  plan.highlighted
                    ? "mt-8 rounded-md bg-amber-300 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-amber-200"
                    : "mt-8 rounded-md border border-slate-300 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 hover:border-slate-900"
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
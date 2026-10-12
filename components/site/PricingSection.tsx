import Link from "next/link";

// Change the price here: it is the only place you need to edit.
// It must match the amount you set in your checkout (app/api/checkout).
const PRICE = "$4.99";

const plans = [
  {
    name: "Build",
    price: "Free",
    note: "No account needed",
    description: "Create and perfect your resume before you pay anything.",
    features: [
      "Choose your profession and template",
      "Edit directly on the resume",
      "Drag lines to reorder them",
      "Change the color",
    ],
    cta: "Start building",
    highlighted: false,
  },
  {
    name: "Download",
    price: PRICE,
    note: "One-time payment per resume",
    description: "Happy with your resume? Pay once and download it.",
    features: [
      "Everything in Build",
      "Download your resume as a PDF",
      "Pay only when you are ready",
    ],
    cta: "Build my resume",
    highlighted: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-semibold text-slate-900">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600">
          Build and edit your resume for free. You only pay when you download
          it.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
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

              <p className="mt-6 text-4xl font-semibold tabular-nums">
                {plan.price}
              </p>
              <p
                className={
                  plan.highlighted
                    ? "mt-1 text-xs text-slate-300"
                    : "mt-1 text-xs text-slate-500"
                }
              >
                {plan.note}
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
                href="/templates"
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
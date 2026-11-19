import { ReactNode } from "react";
import { Lang } from "@/lib/labels";

export function AppFrame({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 truncate text-[11px] font-medium text-slate-500">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// Fades an element in. The space is kept, so nothing jumps on the screen.
function Reveal({
  show,
  children,
  className = "",
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const M = {
  en: {
    board: {
      cols: ["Sourced", "Interview", "Offer", "Hired"],
      people: [
        { n: "Samira A.", r: "Nurse" },
        { n: "Youssef B.", r: "Accountant" },
        { n: "Nadia E.", r: "Teacher" },
        { n: "Omar H.", r: "Developer" },
      ],
    },
    profile: {
      name: "Samira Alaoui",
      role: "Nurse · Casablanca",
      docs: "Documents",
      file: "CV_Samira_Alaoui.pdf",
      notes: "Notes",
      note: "Available from March. Prefers day shifts.",
      author: "You · today",
      tasks: "Tasks",
      task: "Call back on Thursday",
      due: "Thu",
    },
    message: {
      pick: "Template",
      tpl: "Interview invitation",
      rawHello: "Hello {{first_name}},",
      hello: "Hello Samira,",
      line1: "We would like to invite you to an interview for the Nurse position.",
      line2: "Date and time: [date and time]",
      wa: "Open in WhatsApp",
      sent: "Nothing is sent for you: you press send.",
    },
    team: {
      title: "Team",
      members: [
        ["Nadia", "Owner (you)"],
        ["Karim", "Admin"],
        ["Leila", "Member"],
      ],
      invite: "Invitation link",
      expires: "Expires in 7 days",
      copy: "Copy link",
      wa: "WhatsApp",
      task: "Send the contract draft",
      assigned: "Assigned to Karim",
      done: "Done",
    },
  },
  fr: {
    board: {
      cols: ["Sourcé", "Entretien", "Offre", "Embauché"],
      people: [
        { n: "Samira A.", r: "Infirmière" },
        { n: "Youssef B.", r: "Comptable" },
        { n: "Nadia E.", r: "Enseignante" },
        { n: "Omar H.", r: "Développeur" },
      ],
    },
    profile: {
      name: "Samira Alaoui",
      role: "Infirmière · Casablanca",
      docs: "Documents",
      file: "CV_Samira_Alaoui.pdf",
      notes: "Notes",
      note: "Disponible dès mars. Préfère les gardes de jour.",
      author: "Vous · aujourd'hui",
      tasks: "Tâches",
      task: "Rappeler jeudi",
      due: "Jeu",
    },
    message: {
      pick: "Modèle",
      tpl: "Invitation à un entretien",
      rawHello: "Bonjour {{first_name}},",
      hello: "Bonjour Samira,",
      line1: "Nous souhaitons vous inviter à un entretien pour le poste d'infirmière.",
      line2: "Date et heure : [date et heure]",
      wa: "Ouvrir dans WhatsApp",
      sent: "Rien n'est envoyé à votre place : vous appuyez sur envoyer.",
    },
    team: {
      title: "Équipe",
      members: [
        ["Nadia", "Propriétaire (vous)"],
        ["Karim", "Admin"],
        ["Leila", "Membre"],
      ],
      invite: "Lien d'invitation",
      expires: "Expire dans 7 jours",
      copy: "Copier le lien",
      wa: "WhatsApp",
      task: "Envoyer le projet de contrat",
      assigned: "Assignée à Karim",
      done: "Terminée",
    },
  },
};

// step: 0 to 3. The first candidate moves one column at each step.
export function BoardMock({ lang, step }: { lang: Lang; step: number }) {
  const m = M[lang].board;
  const s = Math.min(Math.max(step, 0), 3);
  const positions = [s, 0, 1, 2];

  return (
    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3">
      {m.cols.map((col, ci) => {
        const here = m.people
          .map((p, pi) => ({ p, pi }))
          .filter(({ pi }) => positions[pi] === ci);
        return (
          <div key={col} className="min-h-[9.5rem] rounded-xl bg-slate-100 p-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
              <span className="truncate">{col}</span>
              <span className="rounded-full bg-white px-1.5 text-slate-500">
                {here.length}
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {here.map(({ p, pi }) => (
                <div
                  key={p.n}
                  className={`rounded-lg bg-white p-2 shadow-sm transition-all duration-500 ${
                    pi === 0 ? "shadow-md ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[8px] font-bold text-white">
                      {initials(p.n)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-slate-900">
                        {p.n}
                      </p>
                      <p className="truncate text-[9px] text-slate-500">{p.r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProfileMock({ lang, step }: { lang: Lang; step: number }) {
  const m = M[lang].profile;
  return (
    <div className="bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
          {initials(m.name)}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{m.name}</p>
          <p className="text-[11px] text-slate-500">{m.role}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {m.docs}
          </p>
          <Reveal show={step >= 1} className="mt-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2">
              <span className="rounded bg-red-100 px-1 text-[8px] font-bold text-red-700">
                PDF
              </span>
              <span className="truncate text-[10px] text-slate-700">{m.file}</span>
            </div>
          </Reveal>
        </div>

        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {m.notes}
          </p>
          <Reveal show={step >= 2} className="mt-2">
            <div className="rounded-lg bg-slate-50 p-2">
              <p className="text-[10px] text-slate-800">{m.note}</p>
              <p className="mt-1 text-[9px] text-slate-400">{m.author}</p>
            </div>
          </Reveal>
        </div>

        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {m.tasks}
          </p>
          <Reveal show={step >= 3} className="mt-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2">
              <span className="h-3 w-3 rounded border border-slate-300 bg-white" />
              <span className="flex-1 text-[10px] text-slate-800">{m.task}</span>
              <span className="rounded-full bg-amber-100 px-1.5 text-[8px] font-bold text-amber-800">
                {m.due}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export function MessageMock({ lang, step }: { lang: Lang; step: number }) {
  const m = M[lang].message;
  return (
    <div className="bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-[10px]">
        <span className="font-bold uppercase tracking-wider text-slate-500">
          {m.pick}
        </span>
        <span className="rounded-md bg-white px-2 py-1 font-semibold text-slate-800 shadow-sm">
          {m.tpl} ▾
        </span>
      </div>

      <div className="mt-2 rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[11px] font-semibold text-slate-900">
          {step >= 1 ? m.hello : m.rawHello}
        </p>
        <p className="mt-2 text-[11px] text-slate-700">{m.line1}</p>
        <p className="mt-2 text-[11px] font-semibold text-amber-700">{m.line2}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-3 py-1.5 text-[11px] font-semibold text-white transition-all duration-500 ${
            step >= 2 ? "bg-green-600 shadow-lg ring-2 ring-green-300" : "bg-green-500"
          }`}
        >
          {m.wa}
        </span>
        <Reveal show={step >= 3}>
          <span className="text-[10px] font-medium text-slate-600">✓ {m.sent}</span>
        </Reveal>
      </div>
    </div>
  );
}

export function TeamMock({ lang, step }: { lang: Lang; step: number }) {
  const m = M[lang].team;
  return (
    <div className="bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {m.title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {m.members.map(([name, role]) => (
          <li
            key={name}
            className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[8px] font-bold text-white">
                {initials(name)}
              </span>
              <span className="text-[11px] font-semibold text-slate-900">{name}</span>
            </span>
            <span className="rounded-full bg-slate-100 px-2 text-[9px] font-semibold text-slate-600">
              {role}
            </span>
          </li>
        ))}
      </ul>

      <Reveal show={step >= 1} className="mt-3">
        <div className="rounded-lg bg-white p-2 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-800">{m.invite}</p>
          <p className="text-[9px] text-slate-500">{m.expires}</p>
          <div className="mt-1.5 flex gap-1.5">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-700">
              {m.copy}
            </span>
            <span className="rounded bg-green-600 px-2 py-0.5 text-[9px] font-semibold text-white">
              {m.wa}
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal show={step >= 2} className="mt-2">
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center rounded border text-[8px] font-bold transition-all duration-500 ${
              step >= 3
                ? "border-green-600 bg-green-600 text-white"
                : "border-slate-300 bg-white text-transparent"
            }`}
          >
            ✓
          </span>
          <span
            className={`flex-1 text-[10px] ${
              step >= 3 ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {m.task}
          </span>
          <span className="text-[9px] font-semibold text-blue-700">
            {step >= 3 ? m.done : m.assigned}
          </span>
        </div>
      </Reveal>
    </div>
  );
}
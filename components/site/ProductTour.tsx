"use client";

import { useEffect, useRef, useState } from "react";
import { Lang } from "@/lib/labels";
import {
  AppFrame,
  BoardMock,
  MessageMock,
  ProfileMock,
  TeamMock,
} from "@/components/site/Mockups";

const STEPS = 4; // moments inside one scene
const STEP_MS = 1500;

type SceneId = "pipeline" | "profile" | "message" | "team";
const SCENES: SceneId[] = ["pipeline", "profile", "message", "team"];

const T = {
  en: {
    label: "Product tour",
    play: "Play",
    pause: "Pause",
    restart: "Restart",
    note: "Illustration with sample data. Not real people.",
    scenes: {
      pipeline: {
        tab: "Pipeline",
        frame: "ResumeCraft · Nurse, Clinique Atlas",
        title: "See every search at a glance",
        text: "Move candidates from sourced to hired. The whole team sees the same board.",
        bullets: [
          "Drag cards, or use a menu on your phone",
          "One board per job",
        ],
      },
      profile: {
        tab: "Candidate",
        frame: "ResumeCraft · Samira Alaoui",
        title: "One page per candidate",
        text: "Contact details, the CV, notes and follow-up tasks, all together.",
        bullets: [
          "Attach CVs in PDF or Word",
          "Notes show who wrote them",
          "Tasks with due dates",
        ],
      },
      message: {
        tab: "Messages",
        frame: "ResumeCraft · Message",
        title: "Messages in seconds",
        text: "Pick a template and the candidate's details fill in. Open it in WhatsApp or email, then press send yourself.",
        bullets: [
          "Shared templates for the whole team",
          "Missing details stay visible as [brackets]",
        ],
      },
      team: {
        tab: "Team",
        frame: "ResumeCraft · Team",
        title: "Built for teams",
        text: "Invite colleagues with a link, give them a role and assign tasks.",
        bullets: [
          "Owner, admin and member roles",
          "Start free, upgrade when you need more",
        ],
      },
    },
  },
  fr: {
    label: "Visite du produit",
    play: "Lecture",
    pause: "Pause",
    restart: "Recommencer",
    note: "Illustration avec des données d'exemple. Ce ne sont pas de vraies personnes.",
    scenes: {
      pipeline: {
        tab: "Pipeline",
        frame: "ResumeCraft · Infirmier, Clinique Atlas",
        title: "Voyez chaque recherche d'un coup d'œil",
        text: "Faites avancer les candidats de sourcé à embauché. Toute l'équipe voit le même tableau.",
        bullets: [
          "Glissez les cartes, ou utilisez un menu sur téléphone",
          "Un tableau par offre",
        ],
      },
      profile: {
        tab: "Candidat",
        frame: "ResumeCraft · Samira Alaoui",
        title: "Une page par candidat",
        text: "Coordonnées, CV, notes et tâches de suivi, réunis au même endroit.",
        bullets: [
          "Joignez des CV en PDF ou Word",
          "Les notes indiquent leur auteur",
          "Des tâches avec échéance",
        ],
      },
      message: {
        tab: "Messages",
        frame: "ResumeCraft · Message",
        title: "Des messages en quelques secondes",
        text: "Choisissez un modèle et les informations du candidat se remplissent. Ouvrez-le dans WhatsApp ou par email, puis envoyez-le vous-même.",
        bullets: [
          "Des modèles partagés pour toute l'équipe",
          "Les informations manquantes restent visibles entre [crochets]",
        ],
      },
      team: {
        tab: "Équipe",
        frame: "ResumeCraft · Équipe",
        title: "Pensé pour les équipes",
        text: "Invitez vos collègues avec un lien, donnez-leur un rôle et assignez des tâches.",
        bullets: [
          "Rôles propriétaire, admin et membre",
          "Démarrez gratuitement, passez à Pro quand il le faut",
        ],
      },
    },
  },
};

export default function ProductTour({ lang }: { lang: Lang }) {
  const t = T[lang];
  const total = SCENES.length * STEPS;

  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Starts on its own, unless the visitor asked their system for less motion
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) setPlaying(true);
  }, []);

  // Runs only while the tour is on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    const id = setInterval(() => setPos((p) => (p + 1) % total), STEP_MS);
    return () => clearInterval(id);
  }, [playing, visible, total]);

  const sceneIndex = Math.floor(pos / STEPS);
  const step = pos % STEPS;
  const sceneId = SCENES[sceneIndex];
  const s = t.scenes[sceneId];

  const mock =
    sceneId === "pipeline" ? (
      <BoardMock lang={lang} step={step} />
    ) : sceneId === "profile" ? (
      <ProfileMock lang={lang} step={step} />
    ) : sceneId === "message" ? (
      <MessageMock lang={lang} step={step} />
    ) : (
      <TeamMock lang={lang} step={step} />
    );

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={t.label}
      className="overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-2xl sm:p-8"
    >
      <div className="grid items-center gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            {s.tab}
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight">{s.title}</h3>
          <p className="mt-3 text-sm text-slate-300">{s.text}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-amber-300">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              {playing ? `⏸ ${t.pause}` : `▶ ${t.play}`}
            </button>
            <button
              type="button"
              onClick={() => setPos(0)}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              ↺ {t.restart}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <AppFrame title={s.frame}>{mock}</AppFrame>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {SCENES.map((id, i) => {
          const fill =
            i < sceneIndex ? 100 : i === sceneIndex ? ((step + 1) / STEPS) * 100 : 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPos(i * STEPS)}
              aria-current={i === sceneIndex}
              className="text-left"
            >
              <span
                className={`block text-[11px] font-semibold ${
                  i === sceneIndex ? "text-white" : "text-slate-500"
                }`}
              >
                {t.scenes[id].tab}
              </span>
              <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/15">
                <span
                  className="block h-1 rounded-full bg-amber-300 transition-all duration-700"
                  style={{ width: `${fill}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-500">{t.note}</p>
    </div>
  );
}
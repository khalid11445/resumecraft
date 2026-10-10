"use client";

import {
  CSSProperties,
  DragEvent,
  Fragment,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Path, UseFormReturn } from "react-hook-form";
import { ResumeData } from "@/lib/resume-schema";

type TemplateId = "elegant" | "bold" | "timeline" | "modern" | "classic" | "compact";

const LIVE_IDS: string[] = ["elegant", "bold", "timeline", "modern", "classic", "compact"];
export const isLiveTemplate = (id: string) => LIVE_IDS.includes(id);

const GOLD = "#b08d57";
const GRAY = "#5f6b7a";
const LINE = "#d9dee5";
const SANS = "Helvetica, Arial, sans-serif";
const SERIF = '"Times New Roman", Times, serif';
const PAGE_PX = (595.28 * 96) / 72; // A4 width in CSS pixels

const BULLET = "\u2022";
const DOT = "\u00b7";
const DASH = "\u2014";
const GRIP = "\u22ee\u22ee";
const X = "\u2715";

type SetFn = (path: string, value: unknown) => void;
type Job = ResumeData["experience"][number];
type Edu = ResumeData["education"][number];

const newId = () => Math.random().toString(36).slice(2, 9);

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function focusLater(key: string) {
  setTimeout(() => {
    document.querySelector<HTMLElement>(`[data-key="${key}"]`)?.focus();
  }, 60);
}

/* ---------- Page settings per template ---------- */

const PAGE: Record<TemplateId, CSSProperties> = {
  elegant: { padding: "44pt 48pt", fontSize: "9.5pt", fontFamily: SANS, color: "#2b2f36", lineHeight: 1.5 },
  bold: { padding: "36pt", fontSize: "9.5pt", fontFamily: SANS, color: "#1f2937", lineHeight: 1.45 },
  timeline: { padding: "44pt 46pt", fontSize: "9.5pt", fontFamily: SANS, color: "#1f2937", lineHeight: 1.5 },
  modern: { padding: 0, display: "flex", fontSize: "10pt", fontFamily: SANS, color: "#222", lineHeight: 1.45 },
  classic: { padding: "44pt", fontSize: "10.5pt", fontFamily: SERIF, color: "#1f1f1f", lineHeight: 1.4 },
  compact: { padding: "30pt 36pt", fontSize: "9pt", fontFamily: SANS, color: "#1a1a1a", lineHeight: 1.4 },
};

const SEC_MB: Record<TemplateId, string> = {
  elegant: "20pt",
  timeline: "18pt",
  bold: "18pt",
  classic: "16pt",
  compact: "12pt",
  modern: "22pt",
};

const ITEM_MB: Record<TemplateId, string> = {
  elegant: "12pt",
  timeline: "0pt",
  bold: "11pt",
  classic: "10pt",
  compact: "7pt",
  modern: "12pt",
};

const SUMMARY_TITLE: Record<TemplateId, string> = {
  elegant: "Profile",
  timeline: "Profile",
  bold: "About me",
  classic: "Professional Summary",
  compact: "Summary",
  modern: "Profile",
};

const ROW: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

/* ---------- Drag and drop (native, no library) ---------- */

function useSortable(kind: string, onMove: (from: number, to: number) => void) {
  const mime = `application/x-resume-${kind}`;
  const [over, setOver] = useState<number | null>(null);

  const handle = (i: number): HTMLAttributes<HTMLSpanElement> => ({
    draggable: true,
    onDragStart: (e) => {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(mime, String(i));
      const row = e.currentTarget.closest("[data-sortable]");
      if (row) e.dataTransfer.setDragImage(row, 20, 10);
    },
    onDragEnd: () => setOver(null),
  });

  const item = (i: number) => ({
    "data-sortable": "",
    onDragOver: (e: DragEvent<HTMLElement>) => {
      if (!e.dataTransfer.types.includes(mime)) return;
      e.preventDefault();
      e.stopPropagation();
      setOver(i);
    },
    onDrop: (e: DragEvent<HTMLElement>) => {
      if (!e.dataTransfer.types.includes(mime)) return;
      e.preventDefault();
      e.stopPropagation();
      setOver(null);
      const from = Number(e.dataTransfer.getData(mime));
      if (Number.isInteger(from) && from !== i) onMove(from, i);
    },
  });

  const ring = (i: number) => (over === i ? "ring-2 ring-sky-400 rounded-sm" : "");

  return { handle, item, ring };
}

/* ---------- Editable text: click, type, the form updates ---------- */

function Editable({
  value,
  onChange,
  placeholder,
  block = false,
  className = "",
  style,
  onEnter,
  fieldKey,
  onDark = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  block?: boolean;
  className?: string;
  style?: CSSProperties;
  onEnter?: () => void;
  fieldKey?: string;
  onDark?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  // Keep the text in sync, but never touch it while the user is typing in it
  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if ((el.textContent ?? "") !== value) el.textContent = value;
  });

  const tone = onDark
    ? "hover:bg-white/15 focus:bg-white/20 focus:ring-white/60 empty:before:text-white/50"
    : "hover:bg-sky-50 focus:bg-sky-50 focus:ring-sky-400 empty:before:text-gray-400";

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      data-key={fieldKey}
      className={`${
        block ? "block" : "inline-block min-w-[2ch]"
      } rounded-sm outline-none focus:ring-1 empty:before:content-[attr(data-placeholder)] ${tone} ${className}`}
      style={{ whiteSpace: "pre-wrap", ...style }}
      onInput={(e) => {
        const el = e.currentTarget;
        const text = (el.textContent ?? "").replace(/\u00a0/g, " ");
        if (!text) el.innerHTML = "";
        onChange(text);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (onEnter) onEnter();
          else e.currentTarget.blur();
        }
      }}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain").replace(/\s*\n\s*/g, " ");
        document.execCommand("insertText", false, text);
      }}
    />
  );
}

/* ---------- Grip + remove button shown on hover ---------- */

const SHOW = {
  job: "group-hover/job:opacity-100",
  edu: "group-hover/edu:opacity-100",
  line: "group-hover/line:opacity-100",
  sec: "group-hover/sec:opacity-100",
} as const;

function Handle({
  show,
  handleProps,
  onRemove,
  dark = false,
}: {
  show: keyof typeof SHOW;
  handleProps: HTMLAttributes<HTMLSpanElement>;
  onRemove: () => void;
  dark?: boolean;
}) {
  const grip = dark ? "text-white/60 hover:text-white" : "text-gray-300 hover:text-gray-700";
  const rm = dark ? "text-white/60 hover:text-white" : "text-gray-300 hover:text-red-600";
  return (
    <>
      <span
        {...handleProps}
        title="Drag to reorder"
        className={`absolute -left-5 top-0 cursor-grab select-none text-[13px] leading-[1.4] opacity-0 active:cursor-grabbing ${grip} ${SHOW[show]}`}
      >
        {GRIP}
      </span>
      <button
        type="button"
        onClick={onRemove}
        title="Remove"
        className={`absolute -right-5 top-0 text-[12px] leading-[1.4] opacity-0 ${rm} ${SHOW[show]}`}
      >
        {X}
      </button>
    </>
  );
}

const addBtn = "mt-1 text-[11px] text-gray-400 hover:text-sky-700";
const addBtnDark = "mt-1 text-[11px] text-white/60 hover:text-white";
const addInBlock =
  "mt-1 text-[11px] opacity-0 focus:opacity-100 group-hover/blk:opacity-100";

/* ---------- A list of lines (bullets, items): edit, add, remove, reorder ---------- */

function LineItems({
  values,
  onChange,
  kind,
  fieldPrefix,
  bulletColor,
  showBullet = true,
  placeholder,
  addLabel,
  dark = false,
  textStyle,
  gap = "3pt",
}: {
  values: string[];
  onChange: (next: string[]) => void;
  kind: string;
  fieldPrefix: string;
  bulletColor?: string;
  showBullet?: boolean;
  placeholder: string;
  addLabel: string;
  dark?: boolean;
  textStyle?: CSSProperties;
  gap?: string;
}) {
  const sort = useSortable(kind, (f, t) => onChange(moveItem(values, f, t)));

  return (
    <>
      {values.map((value, i) => (
        <div
          key={i}
          {...sort.item(i)}
          className={`relative flex group/line ${sort.ring(i)}`}
          style={{ marginTop: gap }}
        >
          <Handle
            show="line"
            dark={dark}
            handleProps={sort.handle(i)}
            onRemove={() => onChange(values.filter((_, j) => j !== i))}
          />
          {showBullet ? (
            <span style={{ width: "10pt", color: bulletColor }}>{BULLET}</span>
          ) : null}
          <Editable
            block
            className="flex-1"
            onDark={dark}
            style={textStyle}
            value={value}
            placeholder={placeholder}
            fieldKey={`${fieldPrefix}-${i}`}
            onChange={(v) => {
              const next = [...values];
              next[i] = v;
              onChange(next);
            }}
            onEnter={() => {
              const next = [...values];
              next.splice(i + 1, 0, "");
              onChange(next);
              focusLater(`${fieldPrefix}-${i + 1}`);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className={`${dark ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-sky-700"} ${addInBlock}`}
        onClick={() => {
          onChange([...values, ""]);
          focusLater(`${fieldPrefix}-${values.length}`);
        }}
      >
        + {addLabel}
      </button>
    </>
  );
}

/* ---------- Section titles (same look as each PDF template) ---------- */

function Title({
  v,
  accent,
  children,
}: {
  v: TemplateId;
  accent: string;
  children: ReactNode;
}) {
  switch (v) {
    case "elegant":
      return (
        <>
          <div
            style={{
              fontWeight: 700,
              fontSize: "9pt",
              color: accent,
              textTransform: "uppercase",
              letterSpacing: "2.5pt",
            }}
          >
            {children}
          </div>
          <div
            style={{
              width: "28pt",
              height: "1.5pt",
              background: GOLD,
              marginTop: "4pt",
              marginBottom: "10pt",
            }}
          />
        </>
      );
    case "timeline":
      return (
        <div
          style={{
            fontWeight: 700,
            fontSize: "10pt",
            letterSpacing: "2.5pt",
            textTransform: "uppercase",
            color: accent,
            marginBottom: "12pt",
          }}
        >
          {children}
        </div>
      );
    case "bold":
      return (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8pt" }}>
          <div style={{ width: "4pt", height: "13pt", background: accent, marginRight: "8pt" }} />
          <div
            style={{
              fontWeight: 700,
              fontSize: "10.5pt",
              letterSpacing: "1.5pt",
              textTransform: "uppercase",
              color: "#111827",
            }}
          >
            {children}
          </div>
        </div>
      );
    case "classic":
      return (
        <div
          style={{
            fontWeight: 700,
            fontSize: "11pt",
            letterSpacing: "1.5pt",
            textTransform: "uppercase",
            color: accent,
            borderBottom: "0.5pt solid #999",
            paddingBottom: "3pt",
            marginBottom: "8pt",
          }}
        >
          {children}
        </div>
      );
    case "compact":
      return (
        <div
          style={{
            fontWeight: 700,
            fontSize: "9pt",
            letterSpacing: "1.2pt",
            textTransform: "uppercase",
            color: accent,
            background: "#f1f5f9",
            padding: "3pt 6pt",
            marginBottom: "6pt",
          }}
        >
          {children}
        </div>
      );
    default:
      return (
        <div
          style={{
            fontWeight: 700,
            fontSize: "12pt",
            letterSpacing: "1pt",
            textTransform: "uppercase",
            color: accent,
            borderBottom: `1pt solid ${accent}`,
            paddingBottom: "3pt",
            marginBottom: "10pt",
          }}
        >
          {children}
        </div>
      );
  }
}

/* ---------- The resume ---------- */

type Props = {
  form: UseFormReturn<ResumeData>;
  data: ResumeData;
  accent: string;
  templateId: string;
};

const contactKeys = [
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["linkedin", "LinkedIn"],
  ["website", "Website"],
] as const;

export default function LiveResume({ form, data, accent, templateId }: Props) {
  const v = (isLiveTemplate(templateId) ? templateId : "elegant") as TemplateId;

  const set: SetFn = (path, value) =>
    form.setValue(path as Path<ResumeData>, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });

  const experience = data.experience ?? [];
  const education = data.education ?? [];
  const skills = data.skills ?? [];
  const customSections = data.customSections ?? [];
  const p = data.personal;

  const jobs = useSortable("job", (f, t) => set("experience", moveItem(experience, f, t)));
  const edus = useSortable("edu", (f, t) => set("education", moveItem(education, f, t)));
  const skillSort = useSortable("skill", (f, t) => set("skills", moveItem(skills, f, t)));
  const secs = useSortable("sec", (f, t) =>
    set("customSections", moveItem(customSections, f, t))
  );

  // Fit the A4 page to the width of the panel
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageH, setPageH] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const page = pageRef.current;
    if (!wrap || !page) return;
    const update = () => {
      const s = Math.min(1.5, Math.max(0.3, (wrap.clientWidth - 48) / PAGE_PX));
      setScale(s);
      setPageH(page.offsetHeight * s);
    };
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(page);
    update();
    return () => ro.disconnect();
  }, []);

  /* ----- small helpers (plain functions, not components, so typing never loses focus) ----- */

  const E = (
    path: string,
    value: string | undefined,
    ph: string,
    style?: CSSProperties,
    block = false,
    dark = false
  ) => (
    <Editable
      value={value ?? ""}
      placeholder={ph}
      block={block}
      onDark={dark}
      style={style}
      onChange={(val) => set(path, val)}
    />
  );

  const cval = (k: (typeof contactKeys)[number][0]) => (p[k] as string | undefined) ?? "";
  const contactEl = (
    k: (typeof contactKeys)[number][0],
    ph: string,
    style?: CSSProperties,
    block = false,
    dark = false
  ) => E(`personal.${k}`, cval(k), ph, style, block, dark);

  const sepEl = (s: string) => <span style={{ whiteSpace: "pre" }}>{s}</span>;

  const photo = (size: number, style: CSSProperties) =>
    p.photo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.photo}
        alt=""
        style={{
          width: `${size}pt`,
          height: `${size}pt`,
          borderRadius: `${size / 2}pt`,
          objectFit: "cover",
          ...style,
        }}
      />
    ) : null;

  const dates = (prefix: string, s?: string, e?: string, phEnd = "Present") => (
    <>
      {E(`${prefix}.startDate`, s, "Start")}
      {" - "}
      {E(`${prefix}.endDate`, e, phEnd)}
    </>
  );

  const sec = (title: ReactNode, children: ReactNode) => (
    <div style={{ marginBottom: SEC_MB[v] }}>
      <Title v={v} accent={accent}>
        {title}
      </Title>
      {children}
    </div>
  );

  const bulletColor: Record<TemplateId, string | undefined> = {
    elegant: GOLD,
    bold: accent,
    timeline: accent,
    classic: undefined,
    compact: undefined,
    modern: undefined,
  };

  /* ----- header per template ----- */

  const header = () => {
    switch (v) {
      case "timeline":
        return (
          <div style={{ marginBottom: "22pt" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                {E("personal.fullName", p.fullName, "Full name", { fontSize: "27pt", lineHeight: 1.15, fontWeight: 700, color: "#111827" }, true)}
                {E("personal.jobTitle", p.jobTitle, "Job title", { fontSize: "10pt", lineHeight: 1.2, color: accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5pt", marginTop: "8pt" }, true)}
              </div>
              {photo(74, { marginLeft: "16pt" })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "12pt" }}>
              {contactKeys.map(([k, ph]) => (
                <Fragment key={k}>
                  {contactEl(k, ph, { fontSize: "8.5pt", color: "#6b7280", marginRight: "14pt" })}
                </Fragment>
              ))}
            </div>
          </div>
        );

      case "bold":
        return (
          <>
            <div
              style={{
                margin: "-36pt -36pt 0",
                background: accent,
                padding: "26pt 36pt",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                {E("personal.fullName", p.fullName, "Full name", { fontSize: "26pt", lineHeight: 1.15, fontWeight: 700, color: "#ffffff" }, true, true)}
                {E("personal.jobTitle", p.jobTitle, "Job title", { fontSize: "10.5pt", lineHeight: 1.2, color: "#f3f4f6", marginTop: "7pt", letterSpacing: "1.5pt", textTransform: "uppercase" }, true, true)}
              </div>
              {photo(78, { marginLeft: "16pt", border: "2.5pt solid #ffffff" })}
            </div>
            <div
              style={{
                margin: "0 -36pt 20pt",
                background: "#f3f4f6",
                padding: "8pt 36pt",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {contactKeys.map(([k, ph]) => (
                <Fragment key={k}>
                  {contactEl(k, ph, { fontSize: "8.5pt", color: "#4b5563", marginRight: "16pt" })}
                </Fragment>
              ))}
            </div>
          </>
        );

      case "classic": {
        let seen = false;
        return (
          <div
            style={{
              textAlign: "center",
              marginBottom: "18pt",
              paddingBottom: "12pt",
              borderBottom: `1.5pt solid ${accent}`,
            }}
          >
            {photo(70, { display: "block", margin: "0 auto 8pt" })}
            {E("personal.fullName", p.fullName, "Full name", { fontWeight: 700, fontSize: "24pt", lineHeight: 1.2, letterSpacing: "2pt", textTransform: "uppercase", color: accent }, true)}
            {E("personal.jobTitle", p.jobTitle, "Job title", { fontStyle: "italic", fontSize: "12.5pt", lineHeight: 1.2, color: "#444", marginTop: "6pt" }, true)}
            <div style={{ fontSize: "9.5pt", color: "#444", marginTop: "8pt" }}>
              {contactKeys.map(([k, ph]) => {
                const has = cval(k).trim() !== "";
                const withSep = has && seen;
                if (has) seen = true;
                return (
                  <Fragment key={k}>
                    {withSep ? sepEl("  |  ") : null}
                    {contactEl(k, ph)}
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      }

      case "compact":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "14pt",
              paddingBottom: "10pt",
              borderBottom: `1.5pt solid ${accent}`,
            }}
          >
            {photo(54, { marginRight: "12pt" })}
            <div style={{ flex: 1 }}>
              {E("personal.fullName", p.fullName, "Full name", { fontSize: "19pt", lineHeight: 1.2, fontWeight: 700, color: accent }, true)}
              {E("personal.jobTitle", p.jobTitle, "Job title", { fontSize: "10pt", lineHeight: 1.2, color: "#555", marginTop: "4pt" }, true)}
            </div>
            <div style={{ textAlign: "right" }}>
              {contactKeys.map(([k, ph]) => (
                <Fragment key={k}>
                  {contactEl(k, ph, { fontSize: "8.5pt", color: "#555", lineHeight: 1.5 }, true)}
                </Fragment>
              ))}
            </div>
          </div>
        );

      default:
        // elegant
        return (
          <div style={{ marginBottom: "24pt" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                {E("personal.fullName", p.fullName, "Full name", { fontFamily: SERIF, fontSize: "30pt", lineHeight: 1.2, color: accent, letterSpacing: "1pt" }, true)}
                {E("personal.jobTitle", p.jobTitle, "Job title", { fontSize: "9.5pt", lineHeight: 1.2, color: GOLD, textTransform: "uppercase", letterSpacing: "3pt", marginTop: "10pt" }, true)}
              </div>
              {photo(72, { marginLeft: "16pt" })}
            </div>
            <div style={{ height: "1px", background: LINE, marginTop: "14pt", marginBottom: "8pt" }} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {contactKeys.map(([k, ph]) => (
                <Fragment key={k}>
                  {contactEl(k, ph, { fontSize: "8.5pt", color: GRAY, marginRight: "14pt" })}
                </Fragment>
              ))}
            </div>
          </div>
        );
    }
  };

  /* ----- one job / one education entry per template ----- */

  const itemWrap = (
    kind: "job" | "edu",
    i: number,
    sort: ReturnType<typeof useSortable>,
    onRemove: () => void,
    children: ReactNode
  ) => (
    <div
      key={i}
      {...sort.item(i)}
      className={`relative ${kind === "job" ? "group/job group/blk" : "group/edu"} ${sort.ring(i)}`}
      style={
        v === "timeline"
          ? { paddingLeft: "18pt", paddingBottom: "12pt" }
          : { marginBottom: ITEM_MB[v] }
      }
    >
      <Handle show={kind} handleProps={sort.handle(i)} onRemove={onRemove} />
      {v === "timeline" ? (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1.5pt", background: accent }} />
          <div style={{ position: "absolute", left: "-3.75pt", top: "2pt", width: "9pt", height: "9pt", borderRadius: "4.5pt", background: accent }} />
        </>
      ) : null}
      {children}
    </div>
  );

  const renderJob = (job: Job, i: number) => {
    const pre = `experience.${i}`;
    const bullets = (
      <LineItems
        values={job.bullets ?? []}
        kind={`bullet-${i}`}
        fieldPrefix={`b-${i}`}
        bulletColor={bulletColor[v]}
        placeholder="Describe what you did"
        addLabel="Add bullet point"
        gap={v === "compact" ? "2pt" : "3pt"}
        onChange={(next) => set(`${pre}.bullets`, next)}
      />
    );

    switch (v) {
      case "bold":
        return (
          <>
            <div style={ROW}>
              {E(`${pre}.role`, job.role, "Role", { fontWeight: 700, fontSize: "10.5pt", color: "#111827" })}
              <span style={{ fontSize: "8.5pt", color: "#6b7280", whiteSpace: "nowrap" }}>
                {dates(pre, job.startDate, job.endDate)}
              </span>
            </div>
            <div style={{ color: accent, fontWeight: 700, marginTop: "1pt" }}>
              {E(`${pre}.company`, job.company, "Company")}
              {`  ${DOT}  `}
              {E(`${pre}.location`, job.location, "Location")}
            </div>
            {bullets}
          </>
        );

      case "timeline":
        return (
          <>
            <div style={{ fontSize: "8.5pt", color: accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1pt" }}>
              {dates(pre, job.startDate, job.endDate)}
            </div>
            {E(`${pre}.role`, job.role, "Role", { fontWeight: 700, fontSize: "10.5pt", color: "#111827", marginTop: "2pt" }, true)}
            <div style={{ color: "#6b7280", marginTop: "1pt" }}>
              {E(`${pre}.company`, job.company, "Company")}
              {`  ${DOT}  `}
              {E(`${pre}.location`, job.location, "Location")}
            </div>
            {bullets}
          </>
        );

      case "classic":
        return (
          <>
            <div style={ROW}>
              {E(`${pre}.company`, job.company, "Company", { fontWeight: 700 })}
              <span style={{ color: "#555", whiteSpace: "nowrap" }}>
                {dates(pre, job.startDate, job.endDate)}
              </span>
            </div>
            <div style={ROW}>
              {E(`${pre}.role`, job.role, "Role", { fontStyle: "italic", color: "#444" })}
              {E(`${pre}.location`, job.location, "Location", { color: "#555" })}
            </div>
            {bullets}
          </>
        );

      case "compact":
        return (
          <>
            <div style={ROW}>
              <span>
                {E(`${pre}.role`, job.role, "Role", { fontWeight: 700 })}
                {`  ${DASH}  `}
                {E(`${pre}.company`, job.company, "Company")}
              </span>
              <span style={{ color: "#666", whiteSpace: "nowrap" }}>
                {dates(pre, job.startDate, job.endDate)}
              </span>
            </div>
            {E(`${pre}.location`, job.location, "Location", { color: "#666" }, true)}
            {bullets}
          </>
        );

      case "modern":
        return (
          <>
            <div style={ROW}>
              {E(`${pre}.role`, job.role, "Role", { fontWeight: 700 })}
              <span style={{ color: "#666", whiteSpace: "nowrap" }}>
                {dates(pre, job.startDate, job.endDate)}
              </span>
            </div>
            <div style={{ color: "#666" }}>
              {E(`${pre}.company`, job.company, "Company")}
              {", "}
              {E(`${pre}.location`, job.location, "Location")}
            </div>
            {bullets}
          </>
        );

      default:
        // elegant
        return (
          <>
            <div style={ROW}>
              {E(`${pre}.role`, job.role, "Role", { fontWeight: 700, fontSize: "10.5pt", color: accent })}
              <span style={{ fontSize: "8.5pt", color: GRAY, whiteSpace: "nowrap" }}>
                {dates(pre, job.startDate, job.endDate)}
              </span>
            </div>
            <div style={{ fontStyle: "italic", color: GRAY, marginTop: "1pt" }}>
              {E(`${pre}.company`, job.company, "Company")}
              {`  ${DOT}  `}
              {E(`${pre}.location`, job.location, "Location")}
            </div>
            {bullets}
          </>
        );
    }
  };

  const renderEdu = (ed: Edu, i: number) => {
    const pre = `education.${i}`;
    const school = (style: CSSProperties) => E(`${pre}.school`, ed.school, "School", style);
    const degree = (style: CSSProperties, block = true) => E(`${pre}.degree`, ed.degree, "Degree", style, block);
    const details = (style: CSSProperties) => E(`${pre}.details`, ed.details, "Details (optional)", style, true);

    switch (v) {
      case "bold":
        return (
          <>
            <div style={ROW}>
              {school({ fontWeight: 700, fontSize: "10.5pt", color: "#111827" })}
              <span style={{ fontSize: "8.5pt", color: "#6b7280", whiteSpace: "nowrap" }}>
                {dates(pre, ed.startDate, ed.endDate, "End")}
              </span>
            </div>
            {degree({ color: accent, fontWeight: 700, marginTop: "1pt" })}
            {details({ color: "#6b7280" })}
          </>
        );

      case "timeline":
        return (
          <>
            <div style={{ fontSize: "8.5pt", color: accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1pt" }}>
              {dates(pre, ed.startDate, ed.endDate, "End")}
            </div>
            {E(`${pre}.school`, ed.school, "School", { fontWeight: 700, fontSize: "10.5pt", color: "#111827", marginTop: "2pt" }, true)}
            {degree({ color: "#6b7280", marginTop: "1pt" })}
            {details({ color: "#6b7280", marginTop: "1pt" })}
          </>
        );

      case "classic":
        return (
          <>
            <div style={ROW}>
              {school({ fontWeight: 700 })}
              <span style={{ color: "#555", whiteSpace: "nowrap" }}>
                {dates(pre, ed.startDate, ed.endDate, "End")}
              </span>
            </div>
            {degree({ fontStyle: "italic", color: "#444" })}
            {details({ color: "#555" })}
          </>
        );

      case "compact":
        return (
          <>
            <div style={ROW}>
              <span>
                {school({ fontWeight: 700 })}
                {`  ${DASH}  `}
                {degree({}, false)}
              </span>
              <span style={{ color: "#666", whiteSpace: "nowrap" }}>
                {dates(pre, ed.startDate, ed.endDate, "End")}
              </span>
            </div>
            {details({ color: "#666" })}
          </>
        );

      case "modern":
        return (
          <>
            <div style={ROW}>
              {school({ fontWeight: 700 })}
              <span style={{ color: "#666", whiteSpace: "nowrap" }}>
                {dates(pre, ed.startDate, ed.endDate, "End")}
              </span>
            </div>
            {degree({})}
            {details({ color: "#666" })}
          </>
        );

      default:
        // elegant
        return (
          <>
            <div style={ROW}>
              {school({ fontWeight: 700, fontSize: "10.5pt", color: accent })}
              <span style={{ fontSize: "8.5pt", color: GRAY, whiteSpace: "nowrap" }}>
                {dates(pre, ed.startDate, ed.endDate, "End")}
              </span>
            </div>
            {degree({ fontStyle: "italic", color: GRAY, marginTop: "1pt" })}
            {details({ color: GRAY, marginTop: "1pt" })}
          </>
        );
    }
  };

  /* ----- blocks ----- */

  const jobsBlock = () => (
    <>
      {experience.map((job, i) =>
        itemWrap("job", i, jobs, () => set("experience", experience.filter((_, j) => j !== i)), renderJob(job, i))
      )}
      <button
        type="button"
        className={addBtn}
        onClick={() =>
          set("experience", [
            ...experience,
            { id: newId(), role: "", company: "", location: "", startDate: "", endDate: "Present", bullets: [] },
          ])
        }
      >
        + Add job
      </button>
    </>
  );

  const eduBlock = () => (
    <>
      {education.map((ed, i) =>
        itemWrap("edu", i, edus, () => set("education", education.filter((_, j) => j !== i)), renderEdu(ed, i))
      )}
      <button
        type="button"
        className={addBtn}
        onClick={() =>
          set("education", [
            ...education,
            { id: newId(), school: "", degree: "", startDate: "", endDate: "", details: "" },
          ])
        }
      >
        + Add education
      </button>
    </>
  );

  const SKILL_SEP: Partial<Record<TemplateId, string>> = {
    timeline: "   /   ",
    classic: "  \u00b7  ",
    compact: "  |  ",
  };

  const chipWrap: Partial<Record<TemplateId, CSSProperties>> = {
    elegant: { border: `0.75pt solid ${LINE}`, borderRadius: "2pt", padding: "2.5pt 7pt 2.5pt 4pt", marginRight: "5pt", marginBottom: "5pt", gap: "3pt" },
    bold: { background: "#eef0f3", borderRadius: "3pt", padding: "3pt 8pt 3pt 4pt", marginRight: "5pt", marginBottom: "5pt", gap: "3pt" },
  };
  const chipText: Partial<Record<TemplateId, CSSProperties>> = {
    elegant: { fontSize: "8.5pt", color: accent },
    bold: { fontSize: "8.5pt", color: accent, fontWeight: 700 },
  };

  const skillsBlock = () => {
    const chips = v === "elegant" || v === "bold";
    return (
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {skills.map((s, i) => (
          <Fragment key={i}>
            {!chips && i > 0 ? sepEl(SKILL_SEP[v] ?? "  ") : null}
            <div
              {...skillSort.item(i)}
              className={`group/skill relative flex items-center ${skillSort.ring(i)}`}
              style={chipWrap[v] ?? { gap: "2pt" }}
            >
              <span
                {...skillSort.handle(i)}
                title="Drag to reorder"
                className={`cursor-grab select-none text-gray-300 hover:text-gray-700 ${
                  chips ? "" : "opacity-0 group-hover/skill:opacity-100"
                }`}
              >
                {"\u22ee"}
              </span>
              <Editable
                value={s}
                placeholder="Skill"
                fieldKey={`s-${i}`}
                style={chipText[v]}
                onChange={(val) => {
                  const next = [...skills];
                  next[i] = val;
                  set("skills", next);
                }}
                onEnter={() => {
                  set("skills", [...skills, ""]);
                  focusLater(`s-${skills.length}`);
                }}
              />
              <button
                type="button"
                title="Remove"
                onClick={() => set("skills", skills.filter((_, j) => j !== i))}
                className="text-[10px] text-gray-300 opacity-0 hover:text-red-600 group-hover/skill:opacity-100"
              >
                {X}
              </button>
            </div>
          </Fragment>
        ))}
        <button
          type="button"
          className={`${addBtn} ml-1`}
          onClick={() => {
            set("skills", [...skills, ""]);
            focusLater(`s-${skills.length}`);
          }}
        >
          + Add skill
        </button>
      </div>
    );
  };

  const addSection = (dark: boolean) => (
    <button
      type="button"
      className={dark ? addBtnDark : addBtn}
      onClick={() =>
        set("customSections", [...customSections, { id: newId(), title: "Certifications", items: [] }])
      }
    >
      + Add section
    </button>
  );

  const extrasBlocks = () =>
    customSections.map((cs, i) => (
      <div
        key={i}
        {...secs.item(i)}
        className={`relative group/sec group/blk ${secs.ring(i)}`}
        style={{ marginBottom: SEC_MB[v] }}
      >
        <Handle
          show="sec"
          handleProps={secs.handle(i)}
          onRemove={() => set("customSections", customSections.filter((_, j) => j !== i))}
        />
        <Title v={v} accent={accent}>
          {E(`customSections.${i}.title`, cs.title, "Section title")}
        </Title>
        <LineItems
          values={cs.items ?? []}
          kind={`item-${i}`}
          fieldPrefix={`i-${i}`}
          bulletColor={bulletColor[v]}
          placeholder="Item"
          addLabel="Add item"
          onChange={(next) => set(`customSections.${i}.items`, next)}
        />
      </div>
    ));

  /* ----- layouts ----- */

  const sideTitle = (children: ReactNode) => (
    <div
      style={{
        fontSize: "10pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "1pt",
        marginTop: "22pt",
        marginBottom: "8pt",
        color: "#ffffff",
      }}
    >
      {children}
    </div>
  );

  const sideText: CSSProperties = { fontSize: "9pt", color: "#f3f4f6" };

  const modernLayout = () => (
    <>
      <div
        style={{
          width: "34%",
          background: accent,
          color: "#ffffff",
          padding: "26pt",
          boxSizing: "border-box",
        }}
      >
        {photo(92, { display: "block", margin: "0 auto 16pt", border: "2pt solid #ffffff" })}
        {E("personal.fullName", p.fullName, "Full name", { fontSize: "20pt", lineHeight: 1.2, fontWeight: 700, color: "#ffffff" }, true, true)}
        {E("personal.jobTitle", p.jobTitle, "Job title", { fontSize: "11pt", lineHeight: 1.2, color: "#e5e7eb", marginTop: "8pt", marginBottom: "20pt" }, true, true)}

        {sideTitle("Contact")}
        {contactKeys.map(([k, ph]) => (
          <Fragment key={k}>
            {contactEl(k, ph, { ...sideText, marginBottom: "4pt" }, true, true)}
          </Fragment>
        ))}

        {sideTitle("Skills")}
        <div className="group/blk">
          <LineItems
            dark
            showBullet={false}
            values={skills}
            kind="skillline"
            fieldPrefix="s"
            placeholder="Skill"
            addLabel="Add skill"
            textStyle={sideText}
            gap="4pt"
            onChange={(next) => set("skills", next)}
          />
        </div>

        {customSections.map((cs, i) => (
          <div
            key={i}
            {...secs.item(i)}
            className={`relative group/sec group/blk ${secs.ring(i)}`}
          >
            <Handle
              dark
              show="sec"
              handleProps={secs.handle(i)}
              onRemove={() => set("customSections", customSections.filter((_, j) => j !== i))}
            />
            {sideTitle(
              E(`customSections.${i}.title`, cs.title, "Section title", undefined, false, true)
            )}
            <LineItems
              dark
              showBullet={false}
              values={cs.items ?? []}
              kind={`item-${i}`}
              fieldPrefix={`i-${i}`}
              placeholder="Item"
              addLabel="Add item"
              textStyle={sideText}
              gap="4pt"
              onChange={(next) => set(`customSections.${i}.items`, next)}
            />
          </div>
        ))}
        <div style={{ marginTop: "12pt" }}>{addSection(true)}</div>
      </div>

      <div style={{ width: "66%", padding: "32pt", boxSizing: "border-box" }}>
        {sec(SUMMARY_TITLE.modern, E("summary", data.summary, "Write a short summary about yourself", undefined, true))}
        {sec("Experience", jobsBlock())}
        {sec("Education", eduBlock())}
      </div>
    </>
  );

  const standardLayout = () => (
    <>
      {header()}
      {sec(SUMMARY_TITLE[v], E("summary", data.summary, "Write a short summary about yourself", undefined, true))}
      {sec(v === "classic" ? "Professional Experience" : "Experience", jobsBlock())}
      {sec("Education", eduBlock())}
      {sec("Skills", skillsBlock())}
      {extrasBlocks()}
      {addSection(false)}
    </>
  );

  return (
    <div ref={wrapRef} className="h-full w-full overflow-y-auto bg-gray-100 p-4">
      <p className="mb-3 text-center text-xs text-gray-500">
        Click any text to edit it. Drag {GRIP} to reorder. Page breaks in the PDF may differ slightly.
      </p>

      <div style={{ width: PAGE_PX * scale, height: pageH, margin: "0 auto" }}>
        <div
          ref={pageRef}
          className="bg-white shadow-md"
          style={{
            width: "595.28pt",
            minHeight: "841.89pt",
            boxSizing: "border-box",
            ...PAGE[v],
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {v === "modern" ? modernLayout() : standardLayout()}
        </div>
      </div>
    </div>
  );
}
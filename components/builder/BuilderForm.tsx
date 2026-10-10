"use client";

import { DragEvent, HTMLAttributes, useRef, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/resume-schema";
import { getSuggestions, bulletsFor } from "@/lib/suggestions";
import { summariesFor } from "@/lib/summaries";

const input =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm text-black bg-white";
const inputLocked =
  "w-full rounded border border-gray-200 px-3 py-2 text-sm text-gray-500 bg-gray-100";
const label = "block text-xs font-semibold text-gray-600 mb-1";
const card = "rounded border border-gray-200 p-3 mb-3 bg-gray-50";
const addBtn = "text-sm font-medium text-blue-600 hover:text-blue-800 mb-4";
const removeBtn = "text-xs text-red-600 hover:text-red-800";
const h2 = "text-lg font-bold text-black mt-6 mb-3";
const chip =
  "rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:border-blue-500 hover:text-blue-700";
const ideaBtn =
  "rounded border border-dashed border-gray-300 bg-white px-2 py-1 text-left text-xs text-gray-700 hover:border-blue-500 hover:bg-blue-50";
const errText = "mt-1 text-xs text-red-600";
const checkRow = "mt-1 flex items-center gap-2 text-xs text-gray-600";
const grip =
  "cursor-grab select-none px-1 text-base leading-none text-gray-400 hover:text-gray-700 active:cursor-grabbing";
const moveBtn =
  "rounded px-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30";

const isPresent = (s?: string) => !s || !s.trim() || /^present$/i.test(s.trim());

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// Native drag and drop for a list: a handle to grab and a row to drop on
function useReorder(onMove: (from: number, to: number) => void) {
  const dragFrom = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handle = (i: number): HTMLAttributes<HTMLSpanElement> => ({
    draggable: true,
    onDragStart: (e: DragEvent<HTMLSpanElement>) => {
      dragFrom.current = i;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(i));
      const row = e.currentTarget.closest("[data-reorder-item]");
      if (row) e.dataTransfer.setDragImage(row, 16, 16);
    },
    onDragEnd: () => {
      dragFrom.current = null;
      setOverIndex(null);
    },
  });

  const item = (i: number) => ({
    "data-reorder-item": "",
    onDragOver: (e: DragEvent<HTMLElement>) => {
      if (dragFrom.current === null) return;
      e.preventDefault();
      setOverIndex(i);
    },
    onDrop: (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      const from = dragFrom.current;
      dragFrom.current = null;
      setOverIndex(null);
      if (from !== null && from !== i) onMove(from, i);
    },
  });

  const ring = (i: number) => (overIndex === i ? "ring-2 ring-blue-400" : "");

  return { handle, item, ring };
}

// Grip + up/down buttons (the buttons also work on touch screens)
function ReorderBar({
  title,
  index,
  count,
  handleProps,
  onMove,
}: {
  title: string;
  index: number;
  count: number;
  handleProps: HTMLAttributes<HTMLSpanElement>;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span
          {...handleProps}
          className={grip}
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          ⋮⋮
        </span>
        <span className="text-xs font-semibold text-gray-500">{title}</span>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className={moveBtn}
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          type="button"
          className={moveBtn}
          disabled={index === count - 1}
          onClick={() => onMove(index, index + 1)}
          aria-label="Move down"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

// One editable line per item, each draggable
function LineList({
  values,
  onChange,
  addLabel,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  addLabel: string;
}) {
  const r = useReorder((from, to) => onChange(moveItem(values, from, to)));

  return (
    <div>
      {values.map((value, i) => (
        <div
          key={i}
          {...r.item(i)}
          className={`mb-1 flex items-center gap-1 rounded ${r.ring(i)}`}
        >
          <span
            {...r.handle(i)}
            className={grip}
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            ⋮⋮
          </span>
          <input
            className={input}
            value={value}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className={moveBtn}
            disabled={i === 0}
            onClick={() => onChange(moveItem(values, i, i - 1))}
            aria-label="Move line up"
          >
            ▲
          </button>
          <button
            type="button"
            className={moveBtn}
            disabled={i === values.length - 1}
            onClick={() => onChange(moveItem(values, i, i + 1))}
            aria-label="Move line down"
          >
            ▼
          </button>
          <button
            type="button"
            className={removeBtn}
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            aria-label="Remove line"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800"
        onClick={() => onChange([...values, ""])}
      >
        + {addLabel}
      </button>
    </div>
  );
}

// Skills as chips you can drag to change the order
function SkillChips({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (next: string[]) => void;
}) {
  const clean = skills.filter((s) => s.trim());
  const r = useReorder((from, to) => onChange(moveItem(clean, from, to)));
  if (clean.length < 2) return null;

  return (
    <>
      <p className="mt-3 text-xs text-gray-500">Drag a skill to change the order</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {clean.map((s, i) => (
          <span
            key={`${s}-${i}`}
            {...r.item(i)}
            className={`inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white py-1 pl-1 pr-2 text-xs text-gray-700 ${r.ring(i)}`}
          >
            <span
              {...r.handle(i)}
              className={grip}
              title="Drag to reorder"
              aria-label="Drag to reorder"
            >
              ⋮⋮
            </span>
            {s}
            <button
              type="button"
              className="text-gray-400 hover:text-red-600"
              onClick={() => onChange(clean.filter((_, j) => j !== i))}
              aria-label={`Remove ${s}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </>
  );
}

// Crops the picture to a centered square and shrinks it (keeps the data small)
function resizeToSquare(file: File, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image"));
    };
    img.src = url;
  });
}

export default function BuilderForm({
  form,
  categoryId,
}: {
  form: UseFormReturn<ResumeData>;
  categoryId: string;
}) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const experience = useFieldArray({ control, name: "experience" });
  const education = useFieldArray({ control, name: "education" });
  const sections = useFieldArray({ control, name: "customSections" });

  const expDrag = useReorder((from, to) => experience.move(from, to));
  const eduDrag = useReorder((from, to) => education.move(from, to));
  const secDrag = useReorder((from, to) => sections.move(from, to));

  const newId = () => Math.random().toString(36).slice(2, 9);

  const sug = getSuggestions(categoryId);
  const jobTitle = watch("personal.jobTitle") ?? "";
  const photo = watch("personal.photo");
  const skills = watch("skills") ?? [];
  const summaryIdeas = summariesFor(categoryId, jobTitle);

  const [wantPhoto, setWantPhoto] = useState(Boolean(photo));
  const [photoError, setPhotoError] = useState("");
  const [currentJobs, setCurrentJobs] = useState<Record<string, boolean>>({});
  const [currentEdu, setCurrentEdu] = useState<Record<string, boolean>>({});

  const have = skills.map((s) => s.trim().toLowerCase());
  const missingSkills = sug.skills.filter((s) => !have.includes(s.toLowerCase()));

  return (
    <div className="p-4">
      {/* Personal */}
      <h2 className={h2}>Personal info</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Full name</label>
          <input className={input} {...register("personal.fullName")} />
          {errors.personal?.fullName?.message ? (
            <p className={errText}>{errors.personal.fullName.message}</p>
          ) : null}
        </div>
        <div>
          <label className={label}>Job title</label>
          <input className={input} {...register("personal.jobTitle")} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input className={input} {...register("personal.email")} />
          {errors.personal?.email?.message ? (
            <p className={errText}>{errors.personal.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className={label}>Phone</label>
          <input className={input} {...register("personal.phone")} />
        </div>
        <div>
          <label className={label}>Location</label>
          <input className={input} {...register("personal.location")} />
        </div>
        <div>
          <label className={label}>LinkedIn</label>
          <input className={input} {...register("personal.linkedin")} />
        </div>
        <div className="col-span-2">
          <label className={label}>Website</label>
          <input className={input} {...register("personal.website")} />
        </div>
      </div>

      {/* Photo */}
      <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-black">
          <input
            type="checkbox"
            checked={wantPhoto}
            onChange={(e) => {
              setWantPhoto(e.target.checked);
              if (!e.target.checked) {
                setValue("personal.photo", "", { shouldDirty: true });
                setPhotoError("");
              }
            }}
          />
          Add a photo
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Common in many countries, but usually not recommended on resumes for
          the US, Canada, and the UK. Your photo stays in your browser.
        </p>
        {wantPhoto && (
          <div className="mt-3 flex items-center gap-3">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt="Your photo"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await resizeToSquare(file, 320);
                  setValue("personal.photo", url, { shouldDirty: true });
                  setPhotoError("");
                } catch (err) {
                  setPhotoError(
                    err instanceof Error ? err.message : "Could not load the photo"
                  );
                }
                e.target.value = "";
              }}
            />
          </div>
        )}
        {photoError ? <p className={errText}>{photoError}</p> : null}
      </div>

      <p className="mt-4 text-xs text-gray-500">Suggested titles (click to use)</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {sug.titles.map((t) => (
          <button
            key={t}
            type="button"
            className={chip}
            onClick={() => setValue("personal.jobTitle", t, { shouldDirty: true })}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Summary */}
      <h2 className={h2}>Summary</h2>
      <textarea rows={4} className={input} {...register("summary")} />
      <p className="mt-3 text-xs text-gray-500">
        Suggested summaries: click to use, then replace the [brackets]
      </p>
      <div className="mt-1 flex flex-col gap-1">
        {summaryIdeas.map((s) => (
          <button
            key={s}
            type="button"
            className={ideaBtn}
            onClick={() => setValue("summary", s, { shouldDirty: true })}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Experience */}
      <h2 className={h2}>Experience</h2>
      {experience.fields.map((field, i) => {
        const bullets = watch(`experience.${i}.bullets`) ?? [];
        const role = watch(`experience.${i}.role`) ?? "";
        const endValue = watch(`experience.${i}.endDate`) ?? "";
        const isCurrent = currentJobs[field.id] ?? isPresent(endValue);
        const ideas = bulletsFor(categoryId, role || jobTitle)
          .filter((b) => !bullets.includes(b))
          .slice(0, 5);

        return (
          <div
            key={field.id}
            {...expDrag.item(i)}
            className={`${card} ${expDrag.ring(i)}`}
          >
            <ReorderBar
              title={`Job ${i + 1}`}
              index={i}
              count={experience.fields.length}
              handleProps={expDrag.handle(i)}
              onMove={experience.move}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Role</label>
                <input className={input} {...register(`experience.${i}.role`)} />
              </div>
              <div>
                <label className={label}>Company</label>
                <input className={input} {...register(`experience.${i}.company`)} />
              </div>
              <div>
                <label className={label}>Start</label>
                <input className={input} {...register(`experience.${i}.startDate`)} />
              </div>
              <div>
                <label className={label}>End</label>
                <input
                  className={isCurrent ? inputLocked : input}
                  readOnly={isCurrent}
                  placeholder="Present"
                  {...register(`experience.${i}.endDate`)}
                />
                <label className={checkRow}>
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => {
                      setCurrentJobs((m) => ({ ...m, [field.id]: e.target.checked }));
                      setValue(
                        `experience.${i}.endDate`,
                        e.target.checked ? "Present" : "",
                        { shouldDirty: true }
                      );
                    }}
                  />
                  I currently work here
                </label>
              </div>
              <div className="col-span-2">
                <label className={label}>Location</label>
                <input className={input} {...register(`experience.${i}.location`)} />
              </div>
              <div className="col-span-2">
                <label className={label}>Bullet points (drag ⋮⋮ to reorder)</label>
                <LineList
                  values={bullets}
                  addLabel="Add bullet point"
                  onChange={(next) =>
                    setValue(`experience.${i}.bullets`, next, { shouldDirty: true })
                  }
                />
              </div>

              {ideas.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">
                    Suggested bullet points: click to add, then replace the
                    [brackets] with your real details
                  </p>
                  <div className="mt-1 flex flex-col gap-1">
                    {ideas.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={ideaBtn}
                        onClick={() =>
                          setValue(
                            `experience.${i}.bullets`,
                            [...bullets.filter((x) => x.trim()), b],
                            { shouldDirty: true }
                          )
                        }
                      >
                        + {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`${removeBtn} mt-3`}
              onClick={() => experience.remove(i)}
            >
              Remove job
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className={addBtn}
        onClick={() =>
          experience.append({
            id: newId(),
            role: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "Present",
            bullets: [],
          })
        }
      >
        + Add job
      </button>

      {/* Education */}
      <h2 className={h2}>Education</h2>
      {education.fields.map((field, i) => {
        const endValue = watch(`education.${i}.endDate`) ?? "";
        const isStudying =
          currentEdu[field.id] ?? /^present$/i.test(endValue.trim());

        return (
          <div
            key={field.id}
            {...eduDrag.item(i)}
            className={`${card} ${eduDrag.ring(i)}`}
          >
            <ReorderBar
              title={`Education ${i + 1}`}
              index={i}
              count={education.fields.length}
              handleProps={eduDrag.handle(i)}
              onMove={education.move}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={label}>School</label>
                <input className={input} {...register(`education.${i}.school`)} />
              </div>
              <div className="col-span-2">
                <label className={label}>Degree</label>
                <input className={input} {...register(`education.${i}.degree`)} />
              </div>
              <div>
                <label className={label}>Start</label>
                <input className={input} {...register(`education.${i}.startDate`)} />
              </div>
              <div>
                <label className={label}>End</label>
                <input
                  className={isStudying ? inputLocked : input}
                  readOnly={isStudying}
                  placeholder="Present"
                  {...register(`education.${i}.endDate`)}
                />
                <label className={checkRow}>
                  <input
                    type="checkbox"
                    checked={isStudying}
                    onChange={(e) => {
                      setCurrentEdu((m) => ({ ...m, [field.id]: e.target.checked }));
                      setValue(
                        `education.${i}.endDate`,
                        e.target.checked ? "Present" : "",
                        { shouldDirty: true }
                      );
                    }}
                  />
                  I&apos;m still studying here
                </label>
              </div>
            </div>
            <button
              type="button"
              className={`${removeBtn} mt-3`}
              onClick={() => education.remove(i)}
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className={addBtn}
        onClick={() =>
          education.append({
            id: newId(),
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
            details: "",
          })
        }
      >
        + Add education
      </button>

      {/* Skills */}
      <h2 className={h2}>Skills</h2>
      <label className={label}>Separate with commas</label>
      <input
        className={input}
        value={skills.join(", ")}
        onChange={(e) =>
          setValue(
            "skills",
            e.target.value.split(",").map((s) => s.trimStart()),
            { shouldDirty: true }
          )
        }
      />
      <SkillChips
        skills={skills}
        onChange={(next) => setValue("skills", next, { shouldDirty: true })}
      />
      {missingSkills.length > 0 && (
        <>
          <p className="mt-3 text-xs text-gray-500">
            Suggested skills (click to add)
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {missingSkills.map((s) => (
              <button
                key={s}
                type="button"
                className={chip}
                onClick={() =>
                  setValue("skills", [...skills.filter((x) => x.trim()), s], {
                    shouldDirty: true,
                  })
                }
              >
                + {s}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Custom sections */}
      <h2 className={h2}>Extra sections</h2>
      {sections.fields.map((field, i) => {
        const items = watch(`customSections.${i}.items`) ?? [];
        return (
          <div
            key={field.id}
            {...secDrag.item(i)}
            className={`${card} ${secDrag.ring(i)}`}
          >
            <ReorderBar
              title={`Section ${i + 1}`}
              index={i}
              count={sections.fields.length}
              handleProps={secDrag.handle(i)}
              onMove={sections.move}
            />
            <label className={label}>Section title</label>
            <input
              className={`${input} mb-3`}
              {...register(`customSections.${i}.title`)}
            />
            <label className={label}>Items (drag ⋮⋮ to reorder)</label>
            <LineList
              values={items}
              addLabel="Add item"
              onChange={(next) =>
                setValue(`customSections.${i}.items`, next, { shouldDirty: true })
              }
            />
            <button
              type="button"
              className={`${removeBtn} mt-3`}
              onClick={() => sections.remove(i)}
            >
              Remove section
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className={addBtn}
        onClick={() =>
          sections.append({ id: newId(), title: "Certifications", items: [] })
        }
      >
        + Add section
      </button>
    </div>
  );
}
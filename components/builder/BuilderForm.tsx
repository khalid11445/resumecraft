"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/resume-schema";
import { getIdeas, bulletIdeas, summaryIdeas } from "@/lib/catalog";
import { Lang } from "@/lib/labels";
import { Ui } from "@/lib/i18n";

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

const isPresent = (s?: string) =>
  !s || !s.trim() || /^(present|présent)$/i.test(s.trim());

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
  t,
  contentLang,
}: {
  form: UseFormReturn<ResumeData>;
  categoryId: string;
  t: Ui;
  contentLang: Lang;
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

  const newId = () => Math.random().toString(36).slice(2, 9);

  const sug = getIdeas(categoryId, contentLang);
  const jobTitle = watch("personal.jobTitle") ?? "";
  const photo = watch("personal.photo");
  const skills = watch("skills") ?? [];
  const summaryOptions = summaryIdeas(categoryId, jobTitle, contentLang);

  const [wantPhoto, setWantPhoto] = useState(Boolean(photo));
  const [photoError, setPhotoError] = useState("");
  const [currentJobs, setCurrentJobs] = useState<Record<string, boolean>>({});
  const [currentEdu, setCurrentEdu] = useState<Record<string, boolean>>({});

  const have = skills.map((s) => s.trim().toLowerCase());
  const missingSkills = sug.skills.filter((s) => !have.includes(s.toLowerCase()));

  return (
    <div className="p-4">
      {/* Personal */}
      <h2 className={h2}>{t.personalInfo}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>{t.fullName}</label>
          <input className={input} {...register("personal.fullName")} />
          {errors.personal?.fullName ? (
            <p className={errText}>{t.nameRequired}</p>
          ) : null}
        </div>
        <div>
          <label className={label}>{t.jobTitle}</label>
          <input className={input} {...register("personal.jobTitle")} />
        </div>
        <div>
          <label className={label}>{t.email}</label>
          <input className={input} {...register("personal.email")} />
          {errors.personal?.email ? (
            <p className={errText}>{t.emailInvalid}</p>
          ) : null}
        </div>
        <div>
          <label className={label}>{t.phone}</label>
          <input className={input} {...register("personal.phone")} />
        </div>
        <div>
          <label className={label}>{t.location}</label>
          <input className={input} {...register("personal.location")} />
        </div>
        <div>
          <label className={label}>{t.linkedin}</label>
          <input className={input} {...register("personal.linkedin")} />
        </div>
        <div className="col-span-2">
          <label className={label}>{t.website}</label>
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
          {t.addPhoto}
        </label>
        <p className="mt-1 text-xs text-gray-500">{t.photoHelp}</p>
        {wantPhoto && (
          <div className="mt-3 flex items-center gap-3">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={t.yourPhoto}
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
                } catch {
                  setPhotoError(t.photoError);
                }
                e.target.value = "";
              }}
            />
          </div>
        )}
        {photoError ? <p className={errText}>{photoError}</p> : null}
      </div>

      <p className="mt-4 text-xs text-gray-500">{t.suggestedTitles}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {sug.titles.map((title) => (
          <button
            key={title}
            type="button"
            className={chip}
            onClick={() =>
              setValue("personal.jobTitle", title, { shouldDirty: true })
            }
          >
            {title}
          </button>
        ))}
      </div>

      {/* Summary */}
      <h2 className={h2}>{t.summary}</h2>
      <textarea rows={4} className={input} {...register("summary")} />
      <p className="mt-3 text-xs text-gray-500">{t.suggestedSummaries}</p>
      <div className="mt-1 flex flex-col gap-1">
        {summaryOptions.map((s) => (
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
      <h2 className={h2}>{t.experience}</h2>
      {experience.fields.map((field, i) => {
        const bullets = watch(`experience.${i}.bullets`) ?? [];
        const role = watch(`experience.${i}.role`) ?? "";
        const endValue = watch(`experience.${i}.endDate`) ?? "";
        const isCurrent = currentJobs[field.id] ?? isPresent(endValue);
        const ideas = bulletIdeas(categoryId, role || jobTitle, contentLang)
          .filter((b) => !bullets.includes(b))
          .slice(0, 5);

        return (
          <div key={field.id} className={card}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>{t.role}</label>
                <input className={input} {...register(`experience.${i}.role`)} />
              </div>
              <div>
                <label className={label}>{t.company}</label>
                <input className={input} {...register(`experience.${i}.company`)} />
              </div>
              <div>
                <label className={label}>{t.start}</label>
                <input className={input} {...register(`experience.${i}.startDate`)} />
              </div>
              <div>
                <label className={label}>{t.end}</label>
                <input
                  className={isCurrent ? inputLocked : input}
                  readOnly={isCurrent}
                  placeholder={t.present}
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
                  {t.currentJob}
                </label>
              </div>
              <div className="col-span-2">
                <label className={label}>{t.location}</label>
                <input className={input} {...register(`experience.${i}.location`)} />
              </div>
              <div className="col-span-2">
                <label className={label}>{t.bullets}</label>
                <textarea
                  rows={3}
                  className={input}
                  value={bullets.join("\n")}
                  onChange={(e) =>
                    setValue(`experience.${i}.bullets`, e.target.value.split("\n"), {
                      shouldDirty: true,
                    })
                  }
                />
              </div>

              {ideas.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">{t.suggestedBullets}</p>
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
              className={removeBtn}
              onClick={() => experience.remove(i)}
            >
              {t.removeJob}
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
        {t.addJob}
      </button>

      {/* Education */}
      <h2 className={h2}>{t.education}</h2>
      {education.fields.map((field, i) => {
        const endValue = watch(`education.${i}.endDate`) ?? "";
        const isStudying =
          currentEdu[field.id] ?? /^(present|présent)$/i.test(endValue.trim());

        return (
          <div key={field.id} className={card}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={label}>{t.school}</label>
                <input className={input} {...register(`education.${i}.school`)} />
              </div>
              <div className="col-span-2">
                <label className={label}>{t.degree}</label>
                <input className={input} {...register(`education.${i}.degree`)} />
              </div>
              <div>
                <label className={label}>{t.start}</label>
                <input className={input} {...register(`education.${i}.startDate`)} />
              </div>
              <div>
                <label className={label}>{t.end}</label>
                <input
                  className={isStudying ? inputLocked : input}
                  readOnly={isStudying}
                  placeholder={t.present}
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
                  {t.stillStudying}
                </label>
              </div>
            </div>
            <button
              type="button"
              className={removeBtn}
              onClick={() => education.remove(i)}
            >
              {t.remove}
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
        {t.addEducation}
      </button>

      {/* Skills */}
      <h2 className={h2}>{t.skills}</h2>
      <label className={label}>{t.skillsHint}</label>
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
      {missingSkills.length > 0 && (
        <>
          <p className="mt-3 text-xs text-gray-500">{t.suggestedSkills}</p>
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
      <h2 className={h2}>{t.extraSections}</h2>
      {sections.fields.map((field, i) => {
        const items = watch(`customSections.${i}.items`) ?? [];
        return (
          <div key={field.id} className={card}>
            <label className={label}>{t.sectionTitle}</label>
            <input
              className={`${input} mb-3`}
              {...register(`customSections.${i}.title`)}
            />
            <label className={label}>{t.itemsPerLine}</label>
            <textarea
              rows={3}
              className={input}
              value={items.join("\n")}
              onChange={(e) =>
                setValue(`customSections.${i}.items`, e.target.value.split("\n"), {
                  shouldDirty: true,
                })
              }
            />
            <button
              type="button"
              className={removeBtn}
              onClick={() => sections.remove(i)}
            >
              {t.removeSection}
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className={addBtn}
        onClick={() =>
          sections.append({ id: newId(), title: t.newSectionTitle, items: [] })
        }
      >
        {t.addSection}
      </button>
    </div>
  );
}
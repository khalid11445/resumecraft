"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/resume-schema";

const input =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm text-black bg-white";
const label = "block text-xs font-semibold text-gray-600 mb-1";
const card = "rounded border border-gray-200 p-3 mb-3 bg-gray-50";
const addBtn =
  "text-sm font-medium text-blue-600 hover:text-blue-800 mb-4";
const removeBtn = "text-xs text-red-600 hover:text-red-800";
const h2 = "text-lg font-bold text-black mt-6 mb-3";

export default function BuilderForm({ form }: { form: UseFormReturn<ResumeData> }) {
  const { register, control, watch, setValue } = form;

  const experience = useFieldArray({ control, name: "experience" });
  const education = useFieldArray({ control, name: "education" });
  const sections = useFieldArray({ control, name: "customSections" });

  const newId = () => Math.random().toString(36).slice(2, 9);

  // Bullets and skills are stored as arrays, but edited as one line per item
  const skills = watch("skills") ?? [];

  return (
    <div className="p-4">
      {/* Personal */}
      <h2 className={h2}>Personal info</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Full name</label>
          <input className={input} {...register("personal.fullName")} />
        </div>
        <div>
          <label className={label}>Job title</label>
          <input className={input} {...register("personal.jobTitle")} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input className={input} {...register("personal.email")} />
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

      {/* Summary */}
      <h2 className={h2}>Summary</h2>
      <textarea rows={4} className={input} {...register("summary")} />

      {/* Experience */}
      <h2 className={h2}>Experience</h2>
      {experience.fields.map((field, i) => {
        const bullets = watch(`experience.${i}.bullets`) ?? [];
        return (
          <div key={field.id} className={card}>
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
                <label className={label}>End (empty = Present)</label>
                <input className={input} {...register(`experience.${i}.endDate`)} />
              </div>
              <div className="col-span-2">
                <label className={label}>Location</label>
                <input className={input} {...register(`experience.${i}.location`)} />
              </div>
              <div className="col-span-2">
                <label className={label}>Bullet points (one per line)</label>
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
            </div>
            <button
              type="button"
              className={removeBtn}
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
            endDate: "",
            bullets: [],
          })
        }
      >
        + Add job
      </button>

      {/* Education */}
      <h2 className={h2}>Education</h2>
      {education.fields.map((field, i) => (
        <div key={field.id} className={card}>
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
              <input className={input} {...register(`education.${i}.endDate`)} />
            </div>
          </div>
          <button
            type="button"
            className={removeBtn}
            onClick={() => education.remove(i)}
          >
            Remove
          </button>
        </div>
      ))}
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

      {/* Custom sections */}
      <h2 className={h2}>Extra sections</h2>
      {sections.fields.map((field, i) => {
        const items = watch(`customSections.${i}.items`) ?? [];
        return (
          <div key={field.id} className={card}>
            <label className={label}>Section title</label>
            <input
              className={`${input} mb-3`}
              {...register(`customSections.${i}.title`)}
            />
            <label className={label}>Items (one per line)</label>
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
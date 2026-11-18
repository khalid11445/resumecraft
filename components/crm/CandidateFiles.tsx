"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCrm } from "@/components/crm/CrmShell";
import { FIL } from "@/components/crm/filesText";
import { FILE_BUCKET } from "@/lib/candfiles";
import { planLimitText } from "@/lib/planlimit";

type FileRow = {
  id: string;
  path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  uploaded_by: string | null;
};
type Kind = "pdf" | "doc" | "docx" | "png" | "jpg";
type Msg = { tone: "ok" | "error"; text: string };

const MAX_BYTES = 5 * 1024 * 1024;

const KINDS: Record<Kind, { mime: string; ext: string }> = {
  pdf: { mime: "application/pdf", ext: "pdf" },
  doc: { mime: "application/msword", ext: "doc" },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: "docx",
  },
  png: { mime: "image/png", ext: "png" },
  jpg: { mime: "image/jpeg", ext: "jpg" },
};

// The type declared by a browser is only a claim, so the first bytes of the
// file are checked too. A .docx is a zip file, so its name must also say .docx.
async function detectKind(file: File): Promise<Kind | null> {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);

  if (starts([0x25, 0x50, 0x44, 0x46])) return "pdf";
  if (starts([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return "doc";
  if (starts([0x50, 0x4b, 0x03, 0x04]) && /\.docx$/i.test(file.name)) return "docx";
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (starts([0xff, 0xd8, 0xff])) return "jpg";
  return null;
}

function cleanName(name: string): string {
  const base = name
    .replace(/[\\/]/g, "_")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return (base || "document").slice(0, 200);
}

function sizeText(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const box = "rounded-xl border border-gray-200 bg-white p-4";
const primary =
  "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50";
const ghost =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50";

export default function CandidateFiles({ candidateId }: { candidateId: string }) {
  const { supabase, orgId, lang, nameOf } = useCrm();
  const f = FIL[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("candidate_files")
      .select("id,path,file_name,mime_type,size_bytes,created_at,uploaded_by")
      .eq("candidate_id", candidateId)
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setFiles([]);
      setMsg({ tone: "error", text: f.failed });
      return;
    }
    setFiles((data ?? []) as FileRow[]);
  }, [supabase, candidateId, orgId, f]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg(null);

    if (file.size === 0 || file.size > MAX_BYTES) {
      setMsg({ tone: "error", text: f.tooBig });
      return;
    }
    const kind = await detectKind(file);
    if (!kind) {
      setMsg({ tone: "error", text: f.badType });
      return;
    }

    const { mime, ext } = KINDS[kind];
    const id = crypto.randomUUID();
    const path = `${orgId}/${candidateId}/${id}.${ext}`;

    setBusy(true);

    // The database row comes first: it carries the permission check and the limits
    const { error: insertError } = await supabase.from("candidate_files").insert({
      id,
      org_id: orgId,
      candidate_id: candidateId,
      path,
      file_name: cleanName(file.name),
      mime_type: mime,
      size_bytes: file.size,
    });
    if (insertError) {
      console.error(insertError);
      setBusy(false);
      setMsg({ tone: "error", text: planLimitText(insertError, lang) ?? f.failed });
      return;
    }

    const { error: uploadError } = await supabase.storage
      .from(FILE_BUCKET)
      .upload(path, file, { contentType: mime, upsert: false });
    if (uploadError) {
      console.error(uploadError);
      await supabase
        .from("candidate_files")
        .delete()
        .eq("id", id)
        .eq("org_id", orgId);
      setBusy(false);
      setMsg({ tone: "error", text: f.failed });
      return;
    }

    setBusy(false);
    setMsg({ tone: "ok", text: f.uploaded });
    await load();
  }

  // A blank tab is opened first, inside the click, so a pop-up blocker lets it through
  async function openFile(row: FileRow) {
    setMsg(null);
    const tab = window.open("", "_blank");
    const { data, error } = await supabase.storage
      .from(FILE_BUCKET)
      .createSignedUrl(row.path, 60);

    if (error || !data?.signedUrl) {
      console.error(error);
      tab?.close();
      setMsg({ tone: "error", text: f.openFailed });
      return;
    }
    if (tab) {
      tab.opener = null;
      tab.location.href = data.signedUrl;
    } else {
      window.location.href = data.signedUrl;
    }
  }

  async function deleteFile(row: FileRow) {
    if (!window.confirm(f.deleteConfirm)) return;
    setMsg(null);

    const { error: removeError } = await supabase.storage
      .from(FILE_BUCKET)
      .remove([row.path]);
    if (removeError) {
      console.error(removeError);
      setMsg({ tone: "error", text: f.deleteFailed });
      return;
    }
    const { error: deleteError } = await supabase
      .from("candidate_files")
      .delete()
      .eq("id", row.id)
      .eq("org_id", orgId);
    if (deleteError) {
      console.error(deleteError);
      setMsg({ tone: "error", text: f.deleteFailed });
      return;
    }
    setFiles((prev) => (prev ?? []).filter((x) => x.id !== row.id));
  }

  return (
    <section className={box}>
      <h2 className="text-sm font-bold text-gray-900">{f.title}</h2>
      <p className="mt-1 text-xs text-gray-500">{f.intro}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          className="hidden"
          onChange={onPick}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={primary}
        >
          {busy ? f.uploading : `+ ${f.upload}`}
        </button>
        <span className="text-xs text-gray-500">{f.hint}</span>
      </div>

      {msg ? (
        <p
          className={`mt-3 rounded-lg p-3 text-sm ${
            msg.tone === "ok"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {msg.text}
        </p>
      ) : null}

      {files === null ? null : files.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{f.empty}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {files.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {row.file_name}
                </p>
                <p className="text-xs text-gray-500">
                  {sizeText(row.size_bytes)} ·{" "}
                  {f.uploadedOn(
                    nameOf(row.uploaded_by),
                    new Date(row.created_at).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => openFile(row)} className={ghost}>
                  {f.open}
                </button>
                <button
                  type="button"
                  onClick={() => deleteFile(row)}
                  className="text-xs font-semibold text-red-700 hover:underline"
                >
                  {f.del}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-gray-400">{f.scanNote}</p>
    </section>
  );
}
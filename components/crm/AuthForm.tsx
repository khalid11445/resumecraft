"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lang } from "@/lib/labels";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { CT } from "@/components/crm/text";

const input =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black";

export default function AuthForm({
  lang,
  mode,
}: {
  lang: Lang;
  mode: "login" | "signup";
}) {
  const t = CT[lang];
  const base = lang === "fr" ? "/fr" : "";
  const router = useRouter();
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "error" | "info"; text: string } | null>(
    null
  );

  // A broken or expired email link sends people back here with ?error=confirm
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "confirm") {
      setMsg({ tone: "error", text: t.confirmError });
    }
  }, [t.confirmError]);

  function goNext() {
    const next = new URLSearchParams(window.location.search).get("next");
    const target = next && /^\/(?!\/)/.test(next) ? next : `${base}/crm`;
    router.replace(target);
    router.refresh();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMsg({ tone: "error", text: t.configError });
      return;
    }
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setMsg({ tone: "error", text: t.badEmail });
      return;
    }
    if (password.length < 8) {
      setMsg({ tone: "error", text: t.weak });
      return;
    }

    setBusy(true);
    setMsg(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: mail,
        password,
      });
      setBusy(false);
      if (error) {
        const notConfirmed = error.message.toLowerCase().includes("confirm");
        setMsg({
          tone: "error",
          text: notConfirmed ? t.notConfirmed : t.badLogin,
        });
        return;
      }
      goNext();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: mail,
      password,
      options: { emailRedirectTo: `${window.location.origin}${base}/crm` },
    });
    setBusy(false);
    if (error) {
      setMsg({ tone: "error", text: t.authError });
      return;
    }
    if (data.session) goNext();
    else setMsg({ tone: "info", text: t.checkEmail });
  }

  const isLogin = mode === "login";

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold text-black">
        {isLogin ? t.loginTitle : t.signupTitle}
      </h1>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm font-semibold text-gray-700">
          {t.email}
          <input
            type="email"
            autoComplete="email"
            className={`${input} mt-1`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          {t.password}
          <input
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={`${input} mt-1`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin ? (
            <span className="mt-1 block text-xs font-normal text-gray-500">
              {t.passwordHint}
            </span>
          ) : null}
        </label>

        {msg ? (
          <p
            className={`rounded p-3 text-sm ${
              msg.tone === "error"
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {msg.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? t.working : isLogin ? t.loginBtn : t.signupBtn}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {isLogin ? t.noAccount : t.haveAccount}{" "}
        <Link
          href={`${base}/${isLogin ? "signup" : "login"}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {isLogin ? t.signupBtn : t.loginBtn}
        </Link>
      </p>

      {!isLogin ? (
        <p className="mt-4 text-xs text-gray-500">
          {t.legalNote}{" "}
          <Link href={`${base}/terms`} className="underline">
            {t.terms}
          </Link>{" "}
          ·{" "}
          <Link href={`${base}/privacy`} className="underline">
            {t.privacy}
          </Link>
        </p>
      ) : null}
    </main>
  );
}
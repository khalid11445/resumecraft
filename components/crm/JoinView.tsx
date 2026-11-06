"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lang } from "@/lib/labels";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { TMT } from "@/components/crm/teamText";

type State = "working" | "done" | "invalid" | "config";

export default function JoinView({ lang }: { lang: Lang }) {
  const m = TMT[lang];
  const base = lang === "fr" ? "/fr" : "";
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = String(params.token ?? "");
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );

  const [state, setState] = useState<State>("working");
  // The invitation is accepted once, even if React runs the effect twice
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!supabase) {
      setState("config");
      return;
    }
    // Real invitation tokens are 64 hexadecimal characters
    if (!/^[0-9a-f]{64}$/.test(token)) {
      setState("invalid");
      return;
    }

    (async () => {
      const { data, error } = await supabase.rpc("accept_invitation", {
        p_token: token,
      });
      if (error || !data) {
        console.error(error);
        setState("invalid");
        return;
      }
      try {
        window.localStorage.setItem("rc_org", String(data));
      } catch {
        // the app will open your first workspace instead
      }
      setState("done");
      setTimeout(() => {
        router.replace(`${base}/crm`);
        router.refresh();
      }, 1200);
    })();
  }, [supabase, token, router, base]);

  const text =
    state === "working"
      ? m.joinWorking
      : state === "done"
        ? m.joinDone
        : state === "config"
          ? m.joinConfig
          : m.joinInvalid;

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <p
        className={`text-sm ${state === "invalid" ? "text-red-700" : "text-gray-700"}`}
      >
        {text}
      </p>
      {state === "invalid" || state === "config" ? (
        <Link
          href={`${base}/crm`}
          className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
        >
          {m.joinGo}
        </Link>
      ) : null}
    </main>
  );
}
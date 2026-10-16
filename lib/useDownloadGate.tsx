"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lang } from "./labels";
import { loadLicense, clearLicense, checkLicense } from "./license-client";
import PaywallModal from "@/components/site/PaywallModal";

type Pass = { active: boolean; expiresAt: string | null };

export function useDownloadGate(ui: Lang) {
  const free = process.env.NEXT_PUBLIC_FREE_DOWNLOAD === "true";
  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState<Pass>({ active: false, expiresAt: null });
  const pending = useRef<null | (() => void | Promise<void>)>(null);

  // On load, quietly check whether a saved code is still valid
  useEffect(() => {
    if (free) return;
    const stored = loadLicense();
    if (!stored) return;

    let alive = true;
    checkLicense(stored).then((r) => {
      if (!alive) return;
      if (r.ok) setPass({ active: true, expiresAt: r.expiresAt ?? null });
      else if (r.reason !== "network" && r.reason !== "server") clearLicense();
    });
    return () => {
      alive = false;
    };
  }, [free]);

  // Runs the download if the visitor has a valid code, otherwise
  // opens the window and runs it right after the code is accepted
  const run = useCallback(
    async (action: () => void | Promise<void>) => {
      if (free) {
        await action();
        return;
      }

      const stored = loadLicense();
      if (stored) {
        const r = await checkLicense(stored);
        if (r.ok) {
          setPass({ active: true, expiresAt: r.expiresAt ?? null });
          await action();
          return;
        }
        if (r.reason !== "network" && r.reason !== "server") {
          clearLicense();
          setPass({ active: false, expiresAt: null });
        }
      }

      pending.current = action;
      setOpen(true);
    },
    [free]
  );

  const modal = open ? (
    <PaywallModal
      ui={ui}
      onClose={() => {
        pending.current = null;
        setOpen(false);
      }}
      onUnlocked={async (expiresAt) => {
        setPass({ active: true, expiresAt });
        setOpen(false);
        const action = pending.current;
        pending.current = null;
        if (action) await action();
      }}
    />
  ) : null;

  return { run, modal, pass, free };
}
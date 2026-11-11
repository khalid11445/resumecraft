"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() || "/";
  const fr = pathname === "/fr" || pathname.startsWith("/fr/");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-black">
        {fr ? "Une erreur est survenue" : "Something went wrong"}
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        {fr
          ? "Nous n'avons pas pu afficher cette page. Réessayez, ou revenez à l'accueil."
          : "We could not show this page. Try again, or go back to the home page."}
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-gray-400">
          {fr ? "Référence" : "Reference"} : {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {fr ? "Réessayer" : "Try again"}
        </button>
        <Link
          href={fr ? "/fr" : "/"}
          className="rounded border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          {fr ? "Accueil" : "Home"}
        </Link>
      </div>
    </main>
  );
}
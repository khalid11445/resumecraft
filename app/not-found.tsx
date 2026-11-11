import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-5xl font-semibold text-slate-300">404</p>
      <h1 className="mt-4 text-2xl font-bold text-black">
        Page not found · Page introuvable
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        This page does not exist or was moved.
        <br />
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Home
        </Link>
        <Link
          href="/fr"
          className="rounded border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Accueil
        </Link>
      </div>
    </main>
  );
}
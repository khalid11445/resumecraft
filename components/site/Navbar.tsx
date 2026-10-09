import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-14 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold text-black">
          Resume<span className="text-blue-600">Craft</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/templates" className="text-gray-700 hover:text-black">
            Templates
          </Link>
          <Link
            href="/templates"
            className="rounded bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
          >
            Build my resume
          </Link>
        </nav>
      </div>
    </header>
  );
}
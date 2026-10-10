import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-14 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-bold text-black sm:text-lg"
        >
          Resume<span className="text-blue-600">Craft</span>
        </Link>
        <nav className="flex items-center gap-3 whitespace-nowrap text-sm sm:gap-6">
          <Link
            href="/templates"
            className="hidden text-gray-700 hover:text-black sm:inline"
          >
            Templates
          </Link>
          <Link href="/examples" className="text-gray-700 hover:text-black">
            Examples
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-black">
            Pricing
          </Link>
          <Link
            href="/templates"
            className="rounded bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700 sm:px-4"
          >
            <span className="sm:hidden">Build</span>
            <span className="hidden sm:inline">Build my resume</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
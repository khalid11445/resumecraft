import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 text-sm text-gray-500">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
       <p>© 2026 ResumeCraft</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-black">Privacy</Link>
          <Link href="/terms" className="hover:text-black">Terms</Link>
          <Link href="/refund" className="hover:text-black">Refunds</Link>
        </div>
      </div>
    </footer>
  );
}
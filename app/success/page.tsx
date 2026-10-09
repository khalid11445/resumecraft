import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Payment received</h1>
      <p className="mt-3 text-gray-600">
        Thank you! Your download will be unlocked here shortly.
      </p>
      <Link href="/templates" className="mt-8 inline-block text-blue-600 underline">
        Back to templates
      </Link>
    </main>
  );
}
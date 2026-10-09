export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-6 space-y-4 text-gray-700">{children}</div>
    </main>
  );
}
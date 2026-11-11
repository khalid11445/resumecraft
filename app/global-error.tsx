"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "6rem 1.5rem",
          textAlign: "center",
          color: "#111",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>
          Something went wrong · Une erreur est survenue
        </h1>
        <p style={{ color: "#555", marginTop: "0.75rem" }}>
          Please try again. · Veuillez réessayer.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.4rem",
            background: "#2563eb",
            color: "#fff",
            border: 0,
            borderRadius: "0.4rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again · Réessayer
        </button>
      </body>
    </html>
  );
}
// app/success/page.tsx
import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string; pid?: string };
}) {
  const sessionId = searchParams?.session_id; // present if we include it in success_url
  const productId = searchParams?.pid;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Thank you! 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Your payment was successful. We’ll email you shortly with details and shipping info.
        </p>

        {sessionId && (
          <p className="mt-2 text-xs text-muted-foreground">
            Ref: <span className="font-mono">{sessionId}</span>
          </p>
        )}
        {productId && (
          <p className="mt-1 text-sm text-muted-foreground">Item ID: {productId}</p>
        )}

        <div className="mt-6">
          <Link href="/inventory" className="underline">Back to Inventory</Link>
        </div>
      </div>
    </main>
  );
}

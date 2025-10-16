// app/success/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const { clear } = useCart();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"checking" | "ok" | "unknown">("checking");
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("unknown");
      return;
    }
    // Minimal client guard: if session_id exists, clear once.
    if (!cleared.current) {
      clear();
      cleared.current = true;
    }
    setStatus("ok");
  }, [sessionId, clear]);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Thank you! 🎉</h1>

      {status === "ok" && (
        <p>Your order was received. We’ll send an email with the details.</p>
      )}
      {status === "unknown" && (
        <p>
          We couldn’t verify a recent checkout. If you completed payment, please
          check your email for a receipt. Otherwise, your cart has not been cleared.
        </p>
      )}

      <div className="pt-4">
        <Button asChild>
          <Link href="/inventory">Back to Inventory</Link>
        </Button>
      </div>
    </main>
  );
}

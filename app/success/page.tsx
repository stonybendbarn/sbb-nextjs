// app/success/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";

export default function SuccessPage() {
  const { clear } = useCart();
  useEffect(() => { clear(); }, [clear]);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Thank you! 🎉</h1>
      <p>Your order was received. We’ll send an email with the details.</p>
      <div className="pt-4">
        <Button asChild><Link href="/inventory">Back to Inventory</Link></Button>
      </div>
    </main>
  );
}

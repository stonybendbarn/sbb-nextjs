// app/cart/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CartContent() {
  const { items, remove, setQty, subtotalCents } = useCart();
  const params = useSearchParams();
  const canceled = params.get("canceled") === "1";

  // prevent false “empty cart” before client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>
        <p>Loading…</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Button asChild><Link href="/inventory">Back to Inventory</Link></Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      {canceled && (
        <div className="rounded-md bg-yellow-100 px-3 py-2 text-sm">
          Checkout was canceled — your items are still in the cart.
        </div>
      )}

      <h1 className="text-2xl font-semibold">Your Cart</h1>

      <ul className="divide-y">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 py-4">
            <div className="relative h-20 w-20 rounded bg-neutral-100 overflow-hidden">
              {i.image && <Image src={i.image} alt={i.name} fill className="object-cover" />}
            </div>

            <div className="flex-1">
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-neutral-600">${(i.price_cents / 100).toFixed(2)}</div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${i.id}`} className="text-sm text-neutral-600">Qty</label>
              <Input
                id={`qty-${i.id}`}
                type="number"
                min={1}
                value={i.quantity}
                onChange={(e) => setQty(i.id, Math.max(1, parseInt(e.target.value || "1", 10)))}
                className="w-20"
              />
            </div>

            <div className="w-24 text-right font-medium">
              ${((i.price_cents * i.quantity) / 100).toFixed(2)}
            </div>

            <Button variant="secondary" onClick={() => remove(i.id)} className="ml-2">
              Remove
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg">
          Subtotal: <span className="font-semibold">${(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" asChild><Link href="/inventory">Continue Shopping</Link></Button>
          <Button
            onClick={async () => {
              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: items.map(i => ({ id: i.id, qty: 1 })) }),
              });
              if (!res.ok) return console.error(await res.text());
              const { url } = await res.json();
              window.location.href = url;
            }}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl p-6"><h1 className="text-2xl font-semibold">Your Cart</h1><p>Loading…</p></main>}>
      <CartContent />
    </Suspense>
  );
}

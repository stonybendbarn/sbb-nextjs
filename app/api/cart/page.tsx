// app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";

function cents(n: number) {
  return (n / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function CartPage() {
  const { items, removeItem, clear, subtotalCents, shippingCents } = useCart();

  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-muted-foreground">
          Cart is empty. <Link className="underline" href="/inventory">Back to inventory</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-3">
            {items.map(it => (
              <div key={it.id} className="flex items-center gap-3 border rounded-lg p-3">
                {it.image ? (
                  <div className="relative h-16 w-16 bg-muted rounded">
                    <Image src={it.image} alt={it.name} fill className="object-contain" />
                  </div>
                ) : <div className="h-16 w-16 bg-muted rounded" />}

                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-muted-foreground">{cents(it.priceInCents)}</div>
                  {typeof it.shippingCents === "number" &&
                    <div className="text-xs text-muted-foreground">Shipping: {cents(it.shippingCents)}</div>}
                </div>

                <Button variant="outline" onClick={() => removeItem(it.id)}>Remove</Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 max-w-md">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{cents(subtotalCents)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping (at checkout)</span><span>{cents(shippingCents)}</span></div>
            <div className="flex justify-between font-semibold text-base">
              <span>Estimated total</span><span>{cents(subtotalCents + shippingCents)}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={clear}>Clear</Button>
              <Button onClick={checkout} className="flex-1">Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

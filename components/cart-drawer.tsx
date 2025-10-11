// components/cart-drawer.tsx
//    Slide over cart UI using shadcn/ui Sheet + Checkout button
// ================================
"use client";
import { useState } from "react";
import { useCart } from "./cart-context";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";

export function CartButton() {
  const { items } = useCart();
  const count = items.length;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full shadow-lg" size="lg">
          <ShoppingCart className="mr-2 h-5 w-5" /> Cart {count > 0 && `(${count})`}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px] sm:w-[520px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <CartContents />
      </SheetContent>
    </Sheet>
  );
}

function cents(n: number) { return (n / 100).toLocaleString(undefined, { style: "currency", currency: "USD" }); }

function CartContents() {
  const { items, removeItem, clear, subtotalCents, shippingCents } = useCart();
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    try {
      setBusy(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Checkout failed. Please try again or contact us.");
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return <p className="mt-6 text-muted-foreground">Your cart is empty. Add a few pieces to continue.</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-2">
        {items.map((it) => (
          <div key={it.id} className="flex gap-3 items-center border rounded-lg p-2">
            {it.image ? (
              <div className="relative h-16 w-16 bg-muted rounded">
                <Image src={it.image} alt={it.name} fill className="object-contain" />
              </div>
            ) : (
              <div className="h-16 w-16 bg-muted rounded" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{it.name}</div>
              <div className="text-sm text-muted-foreground">{cents(it.priceInCents)}</div>
              {typeof it.shippingCents === "number" && (
                <div className="text-xs text-muted-foreground">Shipping: {cents(it.shippingCents)}</div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeItem(it.id)} aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{cents(subtotalCents)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping (at checkout)</span><span>{cents(shippingCents)}</span></div>
        <div className="flex justify-between font-semibold text-base"><span>Estimated total</span><span>{cents(subtotalCents + shippingCents)}</span></div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={clear} disabled={busy}>Clear</Button>
          <Button onClick={checkout} className="flex-1" disabled={busy}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}

// components/cart-context.tsx

"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number | string;
  name: string;
  priceInCents: number;
  image?: string;
  shippingCents?: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number | string) => void;
  clear: () => void;
  subtotalCents: number;
  shippingCents: number; // sum of per‑item shipping
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load/save to localStorage
  useEffect(() => {
    const raw = localStorage.getItem("sbb_cart_v1");
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("sbb_cart_v1", JSON.stringify(items));
  }, [items]);

  const api = useMemo<CartContextValue>(() => ({
    items,
    addItem: (item) => {
      setItems((curr) => {
        // One‑of‑a‑kind: prevent duplicates by id
        if (curr.some((c) => c.id === item.id)) return curr;
        return [...curr, item];
      });
    },
    removeItem: (id) => setItems((curr) => curr.filter((c) => c.id !== id)),
    clear: () => setItems([]),
    subtotalCents: items.reduce((s, it) => s + it.priceInCents, 0),
    shippingCents: items.reduce((s, it) => s + (it.shippingCents ?? 0), 0),
  }), [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

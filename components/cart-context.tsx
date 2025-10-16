// components/cart-context.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;          // DB id (text)
  name: string;
  price_cents: number; // cents (int)
  image?: string | null;
  quantity: number;    // always 1 for one-of-a-kind
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void; // no-op (kept for API compatibility)
  clear: () => void;
  count: number;        // number of unique items
  subtotalCents: number;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "sbb-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Hydrate on first render
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // One-of-a-kind: add only if not already present; force quantity = 1
  const add: CartState["add"] = (item) => {
    setItems((prev) =>
      prev.some((p) => p.id === item.id) ? prev : [...prev, { ...item, quantity: 1 }]
    );
  };

  const remove: CartState["remove"] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  // One-of-a-kind: ignore external qty changes (keep 1)
  const setQty: CartState["setQty"] = (id, _qty) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: 1 } : p)));
  };

  const clear = () => setItems([]);

  // Count = number of unique items (not sum of quantities)
  const count = useMemo(() => items.length, [items]);

  const subtotalCents = useMemo(
    () => items.reduce((n, i) => n + i.price_cents * i.quantity, 0),
    [items]
  );

  const value: CartState = { items, add, remove, setQty, clear, count, subtotalCents };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

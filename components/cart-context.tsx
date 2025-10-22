// components/cart-context.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price_cents: number;
  image?: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "sbb-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // 1) Initialize from localStorage synchronously (client only)
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // 2) Track when we've hydrated so we don't write [] over real data
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Ensure we read once more after mount (covers SSR edge cases)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // 3) Persist ONLY after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  // Allow quantities for quantity-based items, unique for others
  const add: CartState["add"] = (item, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        // If it's quantity-based, allow adding more
        if (item.is_quantity_based) {
          return prev.map(p => p.id === item.id 
            ? { ...p, quantity: Math.min(p.quantity + qty, item.available_quantity || 1) }
            : p
          );
        }
        // For unique items, don't add if already in cart
        return prev;
      }
      // Add new item
      return [...prev, { ...item, quantity: Math.max(1, qty) }];
    });
  };
  const remove: CartState["remove"] = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const setQty: CartState["setQty"] = (id, qty) =>
    setItems(prev => prev.map(p => (p.id === id 
      ? { ...p, quantity: Math.max(1, Math.min(qty, p.available_quantity || 1)) }
      : p
    )));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
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

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;          // DB id (text)
  name: string;
  price_cents: number; // store cents (int)
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
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "sbb-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartState["add"] = (item, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (!existing) return [...prev, { ...item, quantity: Math.max(1, qty) }];
      return prev.map(p =>
        p.id === item.id ? { ...p, quantity: p.quantity + qty } : p
      );
    });
  };

  const remove: CartState["remove"] = (id) =>
    setItems(prev => prev.filter(p => p.id !== id));

  const setQty: CartState["setQty"] = (id, qty) =>
    setItems(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );

  const clear = () => setItems([]);

  const count = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items]
  );

  const value: CartState = { items, add, remove, setQty, clear, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


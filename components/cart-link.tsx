// components/cart-link.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";
import { ShoppingCart } from "lucide-react";

export default function CartLink() {
  const { count } = useCart();

  // avoid SSR hydration mismatch: render count only after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart" // we can wire a drawer later; for now point to /cart (can be a stub)
      className="relative inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
      aria-label="Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="text-sm font-medium">Cart</span>

      <span
        className="absolute -right-2 -top-1 min-w-[1.25rem] rounded-full bg-primary px-1 text-center text-[0.7rem] font-bold text-primary-foreground"
        aria-live="polite"
      >
        {mounted ? count : 0}
      </span>
    </Link>
  );
}

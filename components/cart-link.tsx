// components/cart-link.tsx
"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-context";

export default function CartLink({ className = "" }: { className?: string }) {
  const { items } = useCart();
  const count = items.length;
  return (
    <Link
      href="/cart"
      className={`text-sm font-medium text-foreground/80 hover:text-foreground transition-colors no-underline ${className}`}
    >
      Cart{count ? ` (${count})` : ""}
    </Link>
  );
}

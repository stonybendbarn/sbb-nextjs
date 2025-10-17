// components/add-to-cart-button.tsx
"use client";

import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  name: string;
  price_cents: number;
  image?: string | null;
  disabled?: boolean;
};

export default function AddToCartButton({ id, name, price_cents, image, disabled }: Props) {
  const { add } = useCart();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="w-full sm:w-auto"
      disabled={disabled}
      onClick={() => add({ id, name, price_cents, image })}
    >
      Add to cart
    </Button>
  );
}

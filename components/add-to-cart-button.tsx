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
  is_quantity_based?: boolean;
  available_quantity?: number;
};

export default function AddToCartButton({ id, name, price_cents, image, disabled, is_quantity_based, available_quantity }: Props) {
  const { add } = useCart();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="w-full sm:w-auto"
      disabled={disabled}
      onClick={() => add({ 
        id, 
        name, 
        price_cents, 
        image, 
        is_quantity_based: is_quantity_based || false,
        available_quantity: available_quantity || 1
      })}
    >
      Add to cart
    </Button>
  );
}

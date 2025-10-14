// components/BuyNowButton.tsx
"use client";

export default function BuyNowButton({ productId }: { productId: string }) {
  async function startCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: productId, name: "", priceInCents: 0 }] }), // or your real item shape
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Checkout failed" }));
      alert(error);
      return;
    }

    const { url } = await res.json();
    window.location.href = url; // redirect to Stripe
  }

  return (
    <button onClick={startCheckout} className="btn-primary">
      Buy Now
    </button>
  );
}

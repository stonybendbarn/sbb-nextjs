// components/CardImage.tsx
import Image, { ImageProps } from "next/image";

type CardImageProps = Omit<ImageProps, "fill" | "width" | "height"> & {
  // Square card on homepage
  square?: boolean;
  // Intrinsic size for non-square uses (e.g., product page cards if you want)
  w?: number;
  h?: number;
};

export default function CardImage({
  square = true,
  w = 1200,
  h = 900,
  className = "",
  ...props
}: CardImageProps) {
  if (square) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          {...props}
          fill
          className={`object-cover ${className}`}
          sizes="(min-width:1280px) 320px, (min-width:1024px) 300px, (min-width:640px) 45vw, 92vw"
          quality={92}
        />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl">
      <Image
        {...props}
        width={w}
        height={h}
        className={`w-full h-auto object-cover ${className}`}
        sizes="(min-width:1280px) 600px, (min-width:1024px) 520px, (min-width:640px) 45vw, 92vw"
        quality={92}
      />
    </div>
  );
}

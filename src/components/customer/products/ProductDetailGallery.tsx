import Image from "next/image";

type ProductDetailGalleryProps = {
  imageUrl: string;
  alt: string;
};

export function ProductDetailGallery({
  imageUrl,
  alt,
}: ProductDetailGalleryProps) {
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200/80">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain p-6"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-2 ring-accent ring-offset-2"
          aria-label="Main product image"
          aria-pressed
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-contain p-2"
            sizes="96px"
          />
        </button>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { available, brandOf, onSale, weightLabel, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";
import { GiftTag } from "./gift";

/** Soft tint per group, so the grid reads at a glance: blue diapers, green mama, yellow bundles, pink women… */
export const TINT: Record<string, string> = {
  diapers: "var(--color-sky-3)",
  mama: "var(--color-mint)",
  bundles: "var(--color-sun-2)",
  women: "var(--color-rose-2)",
  wipes: "var(--color-lilac)",
  paper: "var(--color-peach)",
};

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const v = p.variants[0];
  const img = p.images[0];
  const ok = available(p);
  const brand = brandOf(p.brand);
  const choose = p.variants.length > 1;
  return (
    <article className="group card lift relative flex h-full flex-col overflow-hidden">
      <Link href={`/p/${p.slug}`} className="relative block aspect-square overflow-hidden" style={{ background: TINT[p.group] }} tabIndex={-1} aria-hidden>
        <span className="absolute inset-x-[12%] top-[14%] bottom-[10%] rounded-full bg-white/70 blur-xl transition duration-500 group-hover:scale-110" />
        {img && <Image src={img.thumb.src} alt="" fill priority={priority} sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className={`object-contain p-[9%] mix-blend-multiply transition duration-500 group-hover:scale-[1.06] ${ok ? "" : "opacity-50 grayscale"}`} />}
        {p.size && (
          <span className="absolute top-3 left-3 flex flex-col items-center rounded-[16px] bg-white px-2.5 py-1 shadow-[0_6px_16px_-8px_rgb(18_48_90/0.5)]">
            <b className="display text-[22px] leading-none text-sky-2">{p.size.toUpperCase()}</b>
            <span className="text-[11px] font-bold text-ink-2">{weightLabel(p.weight)}</span>
          </span>
        )}
        {!ok && <span className="display absolute right-3 bottom-3 rounded-full bg-white px-3 py-1 text-[13px]">Дууссан</span>}
        {p.promo && ok && <GiftTag className="absolute bottom-3 left-3" />}
        {onSale(p) && ok && !p.promo && <span className="display absolute bottom-3 left-3 rounded-full bg-rose px-3 py-1 text-[13px] text-white">Хямдрал</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {brand && (
          <span className="eyebrow flex items-center gap-1.5 !text-[11.5px]" style={{ color: brand.color === "#f5b31b" ? "#b07c00" : brand.color }}>
            <span className="h-2 w-2 rounded-full" style={{ background: brand.color }} />
            {brand.name}
          </span>
        )}
        <Link href={`/p/${p.slug}`} className="display mt-1 line-clamp-2 text-[17px] leading-snug hover:text-sky-2">
          {p.title}
        </Link>
        {p.pieces && (
          <span className="mt-1 text-[13.5px] text-ink-2">
            {p.pieces} ширхэг · <b className="text-leaf-2">1 ш {formatPrice(p.perPiece!)}</b>
          </span>
        )}
        {choose && <span className="mt-1 text-[13.5px] text-ink-2">Живхний хэмжээ: S, M, L, XL</span>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span>
            <span className="display block text-[22px] leading-none">{formatPrice(v.price)}</span>
            {v.compareAt && <s className="text-[13px] text-ink-3">{formatPrice(v.compareAt)}</s>}
          </span>
          <CardActions slug={p.slug} variantId={ok && !choose ? v.id : null} choose={ok && choose} />
        </div>
      </div>
    </article>
  );
}

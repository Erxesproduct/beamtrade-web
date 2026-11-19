"use client";

import Link from "next/link";
import { business, giftEarned } from "@/content/business";
import { cartSubtotal, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLiteVariant } from "@/lib/lite";
import { GiftIcon } from "./icons";

/** Red «Бэлэгтэй» sticker for products that carry the shop's mystery box promo. */
export function GiftTag({ className = "", big = false }: { className?: string; big?: boolean }) {
  return (
    <span className={`gift-tag jiggle ${big ? "!px-4 !py-2 !text-[16px]" : ""} ${className}`}>
      <GiftIcon size={big ? 19 : 15} />
      Бэлэгтэй
    </span>
  );
}

/**
 * How far the cart is from the mystery box, live. «cart»: only when the cart holds a gift product. «product»: on a gift
 * product page, counting this product in even before it is added.
 */
export function GiftMeter({ mode, price = 0 }: { mode: "cart" | "product"; price?: number }) {
  const items = useCart();
  const subtotal = cartSubtotal(items);
  const hasGift = items.some((i) => getLiteVariant(i.id)?.f);
  if (mode === "cart" && !hasGift) return null;
  const { from, name } = business.gift;
  // on a product page, a cart without this product still counts it once
  const base = mode === "product" && !hasGift ? subtotal + price : subtotal;
  const earned = giftEarned(base, true);
  const need = Math.max(0, from - base);
  const pct = Math.min(100, Math.round((base / (from + 1)) * 100));
  return (
    <div className={`rounded-[20px] p-4 ${earned ? "bg-[#e3263f] text-white" : "bg-white/80"}`} aria-live="polite">
      <p className="flex items-center gap-2.5 text-[14.5px] font-bold">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${earned ? "beat bg-white text-[#e3263f]" : "jiggle bg-[#e3263f] text-white"}`}>
          <GiftIcon size={18} />
        </span>
        {earned ? (
          <span>Танд {name} бэлэг очно!</span>
        ) : (
          <span>
            {mode === "product" && !hasGift ? "Энийг аваад дахиад " : "Дахиад "}
            <b className="text-[#e3263f]">{formatPrice(need)}</b>-өөс илүү бараа нэмбэл {name} бэлэгтэй
          </span>
        )}
      </p>
      <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-[#ffe0ea]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} бэлэг хүртэл`}>
        <div className={`h-full rounded-full transition-[width] duration-700 ${earned ? "bg-sun" : "bg-[#e3263f]"}`} style={{ width: `${pct}%` }} />
      </div>
      {mode === "product" && !earned && (
        <Link href="/shop?gift=1" className={`mt-2 inline-block text-[13.5px] font-bold underline ${earned ? "text-white" : "text-[#c01d34]"}`}>
          Бусад бэлэгтэй живх →
        </Link>
      )}
    </div>
  );
}

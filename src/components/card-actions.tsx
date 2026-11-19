"use client";

import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { CheckIcon, HeartIcon, PlusIcon } from "./icons";

/** Heart (top right of the card) and a big «+» that adds straight to the cart, or «Сонгох» when a size must be picked. */
export function CardActions({ slug, variantId, choose = false }: { slug: string; variantId: string | null; choose?: boolean }) {
  const liked = useHearts().includes(slug);
  const [done, setDone] = useState(0);
  return (
    <>
      <button
        type="button"
        onClick={() => hearts.toggle(slug)}
        aria-pressed={liked}
        aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
        className={`absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_6px_16px_-8px_rgb(18_48_90/0.5)] transition hover:scale-110 ${liked ? "text-rose" : "text-ink-2"}`}
      >
        <HeartIcon size={20} filled={liked} className={liked ? "beat" : ""} />
      </button>
      {variantId ? (
        <button
          type="button"
          onClick={() => {
            cart.add(variantId);
            setDone((n) => n + 1);
          }}
          aria-label="Сагсанд нэмэх"
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white transition hover:scale-110 ${done ? "bg-leaf shadow-[0_4px_0_var(--color-leaf-2)]" : "bg-sky shadow-[0_4px_0_var(--color-sky-2)]"}`}
        >
          <span key={done} className={done ? "pop-in" : ""}>
            {done ? <CheckIcon size={22} /> : <PlusIcon size={22} />}
          </span>
        </button>
      ) : choose ? (
        <Link href={`/p/${slug}`} className="btn btn-sky !min-h-11 shrink-0 !px-4 !text-[14px]">
          Сонгох
        </Link>
      ) : null}
    </>
  );
}

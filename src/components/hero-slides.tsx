"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { GiftTag } from "./gift";

export type Slide = {
  slug: string;
  title: string;
  src: string;
  size: string;
  kg: string | null;
  price: number;
  perPiece: number | null;
  pieces: number | null;
  gift: boolean;
};

const EVERY = 3200;
const COLORS: Record<string, string> = {
  NB: "#e2557f",
  S: "#f5b31b",
  M: "#6cc24a",
  L: "#1f9be0",
  XL: "#8a6cf0",
};

/**
 * The hero diaper changes by itself every 3.2 s (NB → S → M → L → XL), with its size, weight and price. Stops while the
 * pointer or keyboard focus is on it, while the tab is hidden, and for visitors who asked for reduced motion.
 */
export function HeroSlides({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const iRef = useRef(0);

  const go = (n: number) => {
    const next = (n + slides.length) % slides.length;
    if (next === iRef.current) return;
    setPrev(iRef.current);
    iRef.current = next;
    setI(next);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || still || slides.length < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") go(iRef.current + 1);
    }, EVERY);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, still, slides.length]);

  const s = slides[i];
  const color = COLORS[s.size] ?? "var(--color-sky)";

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative aspect-square"
        role="group"
        aria-roledescription="слайд"
        aria-label={`${s.title}: ${i + 1} / ${slides.length}`}
      >
        <div
          className="absolute inset-[2%] rounded-full bg-white transition-shadow duration-700"
          style={{
            boxShadow: `0 0 0 10px ${color}2e, 0 40px 80px -40px rgb(31 155 224 / 0.7)`,
          }}
          aria-hidden
        />
        {slides.map((x, n) =>
          n === i || n === prev ? (
            <Link
              key={`${x.slug}-${n === i ? "in" : "out"}-${i}`}
              href={`/p/${x.slug}`}
              tabIndex={n === i ? 0 : -1}
              aria-hidden={n !== i}
              className={`absolute inset-0 block ${n === i ? "slide-in" : "slide-out pointer-events-none"}`}
              onAnimationEnd={() => n === prev && setPrev(null)}
            >
              <span className="bob absolute inset-0 block">
                <Image
                  src={x.src}
                  alt={n === i ? `Тоди ${x.title}` : ""}
                  fill
                  priority={n === 0}
                  sizes="(min-width: 1024px) 460px, 90vw"
                  className="object-contain p-[17%]"
                />
              </span>
            </Link>
          ) : null,
        )}
        {/* load the next photo quietly so it never slides in blank */}
        {slides.length > 1 && (
          <div className="sr-only" aria-hidden>
            <Image
              key={slides[(i + 1) % slides.length].src}
              src={slides[(i + 1) % slides.length].src}
              alt=""
              width={16}
              height={16}
              loading="eager"
            />
          </div>
        )}

        <span
          key={`size-${i}`}
          className="pop-in absolute top-[1%] left-0 flex flex-col items-center rounded-[22px] px-4 py-2 text-white shadow-[0_10px_24px_-10px_rgb(18_48_90/0.6)]"
          style={{ background: color }}
        >
          <b className="display text-[34px] leading-none">{s.size}</b>
          {s.kg && <span className="text-[13px] font-bold">{s.kg}</span>}
        </span>
        {s.gift && (
          <span
            key={`gift-${i}`}
            className="pop-in absolute top-[8%] right-[2%]"
            style={{ animationDelay: "150ms" }}
          >
            <GiftTag big />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-[1%] flex justify-center">
          <span
            key={`price-${i}`}
            className="pop-in rounded-[18px] bg-ink px-4 py-2 text-center text-white shadow-[0_10px_24px_-10px_rgb(18_48_90/0.7)]"
            style={{ animationDelay: "250ms" }}
          >
            <b className="display block text-[20px] leading-none">
              {formatPrice(s.price)}
            </b>
            {s.perPiece && s.pieces && (
              <span className="text-[12px] font-bold text-sun">
                {s.pieces} ш · 1 ш {formatPrice(s.perPiece)}
              </span>
            )}
          </span>
        </span>
      </div>

      <div
        className="relative mt-1 flex justify-center gap-1.5"
        role="tablist"
        aria-label="Живхний хэмжээ"
      >
        {slides.map((x, n) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={`${x.size} · ${x.title}`}
            onClick={() => go(n)}
            className="grid h-8 min-w-8 place-items-center rounded-full"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-500 ${n === i ? "w-7" : "w-2.5 bg-ink/20 hover:bg-ink/40"}`}
              style={
                n === i
                  ? { background: COLORS[x.size] ?? "var(--color-sky)" }
                  : undefined
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}

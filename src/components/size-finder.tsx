"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts } from "@/lib/lite";
import { Cloud } from "./deco";
import { CheckIcon, PlusIcon } from "./icons";

type Size = { id: string; name: string; min: number; max: number | null };

const MIN = 2;
const MAX = 20;
const COLORS: Record<string, string> = { nb: "#e2557f", s: "#f5b31b", m: "#6cc24a", l: "#1f9be0", xl: "#8a6cf0" };

/** Sizes whose weight range holds `kg` (ranges overlap, so 5–6 kg is both S and M). Between L (–14) and XL (15+) both are shown. */
export function sizesFor(sizes: Size[], kg: number) {
  const hit = sizes.filter((s) => kg >= s.min && (s.max == null || kg <= s.max));
  if (hit.length) return hit;
  return sizes.filter((s) => s.max != null && s.max < kg).slice(-1).concat(sizes.filter((s) => s.min > kg).slice(0, 1));
}

export function SizeFinder({ sizes, compact = false, initial = 7 }: { sizes: Size[]; compact?: boolean; initial?: number }) {
  const [kg, setKg] = useState(Math.min(MAX, Math.max(MIN, Math.round(initial * 2) / 2)));
  const [added, setAdded] = useState<string | null>(null);
  const hit = sizesFor(sizes, kg);
  const packs = liteProducts.filter((p) => p.g === "diapers" && p.z && hit.some((s) => s.id === p.z)).sort((a, b) => (a.z === b.z ? (b.c ?? 0) - (a.c ?? 0) : hit.findIndex((s) => s.id === a.z) - hit.findIndex((s) => s.id === b.z)));

  return (
    <div className="card relative overflow-hidden p-5 md:p-8">
      <Cloud width={200} color="var(--color-sky-3)" className="absolute -top-10 -right-12 opacity-60" />
      <div className="relative">
        <label htmlFor="kg" className="display block text-[22px] leading-tight md:text-[26px]">
          Хүүхэд тань хэдэн кг вэ?
        </label>
        <p className="mt-1 text-[14.5px] text-ink-2">Гулсуургыг чирээд жинг нь тааруулаарай. Хэмжээг жингээр нь сонгодог.</p>

        <div className="mt-6 flex items-end gap-3">
          <output htmlFor="kg" className="display text-[64px] leading-none text-sky-2 tabular-nums md:text-[76px]" aria-live="polite">
            {kg % 1 ? kg.toFixed(1) : kg}
          </output>
          <span className="display mb-2 text-[24px] text-ink-2">кг</span>
          <span className="mb-2 ml-auto flex flex-wrap justify-end gap-1.5">
            {hit.map((s) => (
              <span key={s.id} className="pop-in display rounded-full px-3.5 py-1.5 text-[20px] text-white" style={{ background: COLORS[s.id] }}>
                {s.name}
              </span>
            ))}
          </span>
        </div>

        <div className="relative mt-4">
          {/* coloured size bands under the slider */}
          <div className="relative h-3 overflow-hidden rounded-full bg-mist" aria-hidden>
            {sizes.map((s, i) => (
              <span
                key={s.id}
                className="absolute h-full opacity-80"
                style={{
                  left: `${((s.min - MIN) / (MAX - MIN)) * 100}%`,
                  width: `${(((s.max ?? MAX) - s.min) / (MAX - MIN)) * 100}%`,
                  background: COLORS[s.id],
                  top: 0,
                  zIndex: i,
                  mixBlendMode: "multiply",
                }}
              />
            ))}
          </div>
          <input
            id="kg"
            type="range"
            min={MIN}
            max={MAX}
            step={0.5}
            value={kg}
            onChange={(e) => setKg(Number(e.target.value))}
            className="kg-range absolute inset-x-0 -top-3.5 h-10 w-full cursor-pointer"
            aria-valuetext={`${kg} кг: ${hit.map((s) => s.name).join(", ")}`}
          />
          <div className="relative mt-1 h-5 text-[12px] font-bold text-ink-3" aria-hidden>
            {[2, 5, 10, 15, 20].map((n) => (
              <span key={n} className="absolute -translate-x-1/2" style={{ left: `${((n - MIN) / (MAX - MIN)) * 100}%` }}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {sizes.map((s) => {
            const on = hit.some((h) => h.id === s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setKg(Math.min(MAX, s.max ? (s.min + s.max) / 2 : s.min + 1))}
                className={`flex flex-col items-center rounded-[16px] px-1 py-2 transition ${on ? "-translate-y-1 text-white" : "bg-mist text-ink-2 hover:bg-sky-3"}`}
                style={on ? { background: COLORS[s.id], boxShadow: "0 4px 0 rgb(0 0 0 / 0.15)" } : undefined}
                aria-pressed={on}
              >
                <b className="display text-[18px] leading-none">{s.name}</b>
                <span className="mt-0.5 text-[11px] font-bold whitespace-nowrap">{s.max ? `${s.min}–${s.max}` : `${s.min}+`} кг</span>
              </button>
            );
          })}
        </div>

        {hit.length > 1 && <p className="mt-3 rounded-[14px] bg-sun-2 px-3.5 py-2 text-[13.5px]">Энэ жин хоёр хэмжээнд давхцаж байна: аль алинаас нь сонгож болно.</p>}

        {!compact && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {packs.map((p) => (
              <li key={p.s} className="rise flex items-center gap-3 rounded-[22px] bg-mist p-3">
                <Link href={`/p/${p.s}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-white">
                  {p.t && <Image src={p.t} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />}
                </Link>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <b className="display rounded-full px-2 text-[13px] text-white" style={{ background: COLORS[p.z!] }}>
                      {p.z!.toUpperCase()}
                    </b>
                    <b className="text-[14px]">{p.k === "double" ? "Давхар" : p.k === "solo" ? "Соло" : ""} · {p.c} ш</b>
                  </span>
                  <b className="display mt-1 block text-[20px] leading-none">{formatPrice(p.p)}</b>
                  {p.pp && <span className="text-[12.5px] font-bold text-leaf-2">1 ширхэг {formatPrice(p.pp)}</span>}
                </span>
                {p.a && p.v ? (
                  <button
                    type="button"
                    onClick={() => {
                      cart.add(p.v!);
                      setAdded(p.s);
                    }}
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white transition hover:scale-110 ${added === p.s ? "bg-leaf" : "bg-sky"}`}
                    aria-label={`${p.n}: сагсанд нэмэх`}
                  >
                    {added === p.s ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
                  </button>
                ) : (
                  <span className="text-[13px] font-bold text-ink-3">Дууссан</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {compact && (
          <Link href={`/size?kg=${kg}`} className="btn btn-sky mt-6 w-full sm:w-auto">
            {hit.map((s) => s.name).join(" / ")} хэмжээний живх үзэх →
          </Link>
        )}
      </div>
    </div>
  );
}

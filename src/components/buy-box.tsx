"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { hearts, useHearts } from "@/lib/wishlist";
import { CheckIcon, HeartIcon, MinusIcon, PlusIcon } from "./icons";

type V = { id: string; label: string | null; price: number; compareAt: number | null; stock: number | null };

export function BuyBox({ slug, variants, perPiece, pieces }: { slug: string; variants: V[]; perPiece: number | null; pieces: number | null }) {
  const router = useRouter();
  const choose = variants.length > 1;
  const [id, setId] = useState<string | null>(choose ? null : variants[0].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);
  const [hint, setHint] = useState(false);
  const liked = useHearts().includes(slug);
  const v = variants.find((x) => x.id === id) ?? variants[0];
  const out = variants.every((x) => x.stock === 0);
  const cap = id ? Math.max(1, Math.min(10, v.stock ?? 10)) : 10;

  const add = () => {
    if (!id) {
      setHint(true);
      return false;
    }
    cart.add(id, qty);
    setAdded((n) => n + 1);
    return true;
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="display text-[40px] leading-none text-ink">{formatPrice(v.price)}</span>
        {v.compareAt && <s className="text-[17px] text-ink-3">{formatPrice(v.compareAt)}</s>}
        {perPiece && pieces && (
          <span className="rounded-full bg-mint px-3 py-1 text-[14px] font-bold text-leaf-2">
            {pieces} ширхэг · 1 ширхэг нь {formatPrice(perPiece)}
          </span>
        )}
      </div>

      {choose && (
        <fieldset className="mt-5">
          <legend className="label">Багцад орох живхний хэмжээг сонгоно уу</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup">
            {variants.map((x) => {
              const [size, kg] = (x.label ?? "").replace("Живх ", "").split(" ");
              return (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={x.id === id}
                  disabled={x.stock === 0}
                  onClick={() => {
                    setId(x.id);
                    setHint(false);
                  }}
                  className={`flex flex-col items-center rounded-[18px] py-3 transition disabled:opacity-40 ${x.id === id ? "pop-in bg-sky text-white shadow-[0_4px_0_var(--color-sky-2)]" : "bg-mist shadow-[0_0_0_2px_var(--color-line)_inset] hover:shadow-[0_0_0_2px_var(--color-sky)_inset]"}`}
                >
                  <b className="display text-[24px] leading-none">{size}</b>
                  <span className="text-[13px] font-bold opacity-85">{kg?.replace(/[()]/g, "")}</span>
                </button>
              );
            })}
          </div>
          {hint && (
            <p className="pop-in mt-2 text-[14.5px] font-bold text-rose" role="alert">
              Эхлээд живхний хэмжээгээ сонгоорой
            </p>
          )}
        </fieldset>
      )}

      {out ? (
        <p className="mt-5 rounded-[18px] bg-mist px-4 py-3 font-bold">Одоогоор дууссан. {`Ирэх хугацааг 9191-9477 дугаараас лавлаарай.`}</p>
      ) : (
        <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-3">
          <div className="flex h-14 items-center rounded-full bg-mist px-1 shadow-[0_0_0_2px_var(--color-line)_inset]">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-10 place-items-center rounded-full hover:bg-white" aria-label="Цөөлөх">
              <MinusIcon size={18} />
            </button>
            <span className="display w-8 text-center text-[20px]" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(cap, id ? maxQty(id) || cap : cap, q + 1))} disabled={qty >= cap} className="grid h-11 w-10 place-items-center rounded-full hover:bg-white disabled:opacity-30" aria-label="Нэмэх">
              <PlusIcon size={18} />
            </button>
          </div>
          <button type="button" onClick={add} className={`btn h-14 !px-4 text-[16.5px] ${added ? "btn-leaf" : "btn-sky"}`}>
            <span key={added} className={`flex items-center gap-2 ${added ? "pop-in" : ""}`}>
              {added ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
              {added ? "Нэмэгдлээ" : "Сагсанд нэмэх"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => hearts.toggle(slug)}
            aria-pressed={liked}
            aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
            className={`grid h-14 w-14 place-items-center justify-self-center rounded-full bg-white shadow-[0_0_0_2px_var(--color-line)_inset] transition hover:scale-105 ${liked ? "text-rose" : ""}`}
          >
            <HeartIcon size={22} filled={liked} className={liked ? "beat" : ""} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (add()) router.push("/cart");
            }}
            className="btn btn-sun h-14 !px-4"
          >
            Шууд захиалах →
          </button>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { Sky } from "@/components/deco";
import { SizeFinder } from "@/components/size-finder";
import { sizes } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Живхний хэмжээ олох",
  description: "Хүүхдийнхээ жинг оруулаад тохирох Тоди живхний хэмжээ (NB, S, M, L, XL), багц, нэг ширхэгийн үнийг харна уу.",
  alternates: { canonical: "/size" },
};

type SP = Record<string, string | string[] | undefined>;

export default async function SizePage({ searchParams }: { searchParams: Promise<SP> }) {
  const raw = (await searchParams).kg;
  const kg = Number(Array.isArray(raw) ? raw[0] : raw);
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-3 to-mist">
        <Sky dense />
        <div className="wrap relative pt-10 pb-16 md:pt-14">
          <p className="eyebrow text-sky-2">10 секундэд</p>
          <h1 className="display mt-1 max-w-2xl text-[38px] leading-tight md:text-[56px]">Хүүхдэдээ тохирох живхээ олоорой</h1>
          <p className="mt-3 max-w-xl text-[17px] text-ink-2">Живхний хэмжээг хүүхдийн жингээр сонгодог. Жинг нь оруулахад тохирох хэмжээ, багц, нэг ширхэгийн үнэ гарна.</p>
        </div>
      </section>
      <div className="wrap -mt-10">
        <div className="mx-auto max-w-3xl">
          <SizeFinder sizes={sizes} initial={Number.isFinite(kg) && kg > 0 ? kg : 7} />
          <p className="mt-4 text-center text-[14px] text-ink-2">Жингийн хязгаар нь дэлгүүрийн бүтээгдэхүүний тайлбараас авсан. Давхар (DOUBLE) багцад 1 ширхэгийн үнэ Соло-той адил.</p>
        </div>
      </div>
    </>
  );
}

import data from "@/data/lite.json";

/** One per buyable variant: i key, s slug, n title, b brand, z option label, p price, o compareAt, k stock (null = not counted), t thumb, f carries the shop's gift promo. */
export type LiteVariant = { i: string; s: string; n: string; b: string | null; z: string | null; p: number; o: number | null; k: number | null; t: string | null; f: 0 | 1 };
/**
 * One per product: s slug, n title, b brand, g group, z diaper size, w weight (kg), c diapers in the pack, k pack (solo|double),
 * pp price per diaper, p price, a available, t thumb, v variant key (null when the customer must pick an option), r orders.
 */
export type LiteProduct = {
  s: string;
  n: string;
  b: string | null;
  g: string;
  z: string | null;
  w: { min: number; max: number | null } | null;
  c: number | null;
  k: string | null;
  pp: number | null;
  p: number;
  a: 0 | 1;
  t: string | null;
  v: string | null;
  r: number;
  /** 1 when the product carries the shop's gift promo (mystery box above 50,000₮) */
  f: 0 | 1;
};

export const liteVariants = data.v as LiteVariant[];
export const liteProducts = data.p as LiteProduct[];
const byId = new Map(liteVariants.map((v) => [v.i, v]));
export const getLiteVariant = (id: string) => byId.get(id);
export const isSoldOut = (v: Pick<LiteVariant, "k">) => v.k === 0;

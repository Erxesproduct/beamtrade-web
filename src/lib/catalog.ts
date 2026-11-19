import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** Zochil product id, or <id>-<size> for the diaper size inside a bundle. erxes product code BT-<id>. */
  id: string;
  label: string | null;
  price: number;
  compareAt: number | null;
  /** Zochil stock; null = not counted (orderable). Bundle sizes share their bundle's stock. */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Weight = { min: number; max: number | null };
export type Product = {
  id: number;
  slug: string;
  title: string;
  brand: string | null;
  /** diapers | mama | bundles | women | wipes | paper */
  group: string;
  /** diaper size nb | s | m | l | xl */
  size: string | null;
  /** baby weight in kg, from the shop's own product text */
  weight: Weight | null;
  /** diapers in the pack */
  pieces: number | null;
  /** solo (1 bag) | double (2 bags) */
  pack: string | null;
  /** price ÷ diapers, rounded */
  perPiece: number | null;
  /** the shop's promo line, word for word («50,000-с дээш … mystery box …») */
  promo: string | null;
  /** bundles: what is inside */
  contents: string[];
  features: string[];
  about: string[];
  variants: Variant[];
  orders: number;
  featured: boolean;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; line: string; count: number };
export type Brand = { id: string; name: string; line: string; color: string; count: number };
export type Size = { id: string; name: string; min: number; max: number | null; count: number };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const brands = data.brands as Brand[];
export const sizes = data.sizes as Size[];
export const banners = data.banners as { src: string; w: number; h: number; title: string }[];
export const news = data.news as { id: number; title: string }[];
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const brandOf = (id: string | null) => (id ? (brands.find((b) => b.id === id) ?? null) : null);
export const brandName = (id: string | null) => brandOf(id)?.name ?? null;
/** Brand + title, without repeating a brand the title already starts with («Flexa Flexa …»). */
export const fullName = (p: Pick<Product, "brand" | "title">) => {
  const b = brandName(p.brand);
  return b && !p.title.startsWith(b) ? `${b} ${p.title}` : p.title;
};
export const sku = (id: string) => `BT-${id}`;
export const weightLabel = (w: Weight | null) => (w ? (w.max ? `${w.min}–${w.max} кг` : `${w.min}+ кг`) : null);

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => p.variants[0].price;
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);

/** In stock first, then most ordered on Zochil. */
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || b.orders - a.orders || Number(b.featured) - Number(a.featured);
export const popular = [...products].sort(byPopularity);

// node scripts/export-erxes.mjs → docs/erxes/beamtrade-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `BT-${id.toUpperCase()}`;

// categories: BT → the 6 groups (diapers, mama, bundles, women, wipes, paper) → delivery
const cats = [["code", "name", "parent code"], ["BT", "Beam trade", ""]];
for (const g of c.groups) cats.push([code(g.id), g.name, "BT"]);
cats.push(["BT-DELIVERY", "Хүргэлт", "BT"]);
writeFileSync(path.join(out, "beamtrade-categories.csv"), csv(cats));

const bName = Object.fromEntries(c.brands.map((b) => [b.id, b.name]));
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "brand", "diaper size", "baby weight kg", "pieces", "price per piece", "stock (Zochil)", "stock shared with", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `BT-${v.id}`,
      [p.brand && !p.title.startsWith(bName[p.brand]) ? bName[p.brand] : null, p.title, v.label].filter(Boolean).join(" ").slice(0, 200),
      code(p.group),
      "product",
      v.price,
      v.compareAt ?? "",
      bName[p.brand] ?? "",
      p.size?.toUpperCase() ?? (v.label ? v.label.split(" ")[1] : ""),
      p.weight ? `${p.weight.min}-${p.weight.max ?? "+"}` : "",
      p.pieces ?? "",
      p.perPiece ?? "",
      v.stock ?? "",
      p.variants.length > 1 ? p.variants.filter((x) => x.id !== v.id).map((x) => `BT-${x.id}`).join(" ") : "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "beamtrade-products.csv"), csv(rows));

const d = c.shop.delivery;
writeFileSync(
  path.join(out, "beamtrade-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "free above (goods total)", "source"],
    ...d.map((x) => [`BT-DELIVERY-${x.id}`, "Хүргэлт: Улаанбаатар (бүсчлэл)", "BT-DELIVERY", "service", x.price, x.freeFrom ?? "", `Zochil delivery option ${x.id} «${x.title}»`]),
    ...d.map((x) => [`BT-DELIVERY-${x.id}-AIMAG`, "Хүргэлт: Орон нутаг (унаанд тавих)", "BT-DELIVERY", "service", x.price, x.freeFrom ?? "", "same fee as the city; open question 2"]),
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery ${d.length * 2}`);

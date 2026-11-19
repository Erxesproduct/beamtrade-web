import { Andika, Nunito, Pangolin } from "next/font/google";

// All three have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Headings and prices: round, friendly, heavy. */
export const display = Nunito({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["700", "800", "900"], variable: "--font-display", display: "swap" });
/** Body text: Andika was drawn for easy reading (clear letter shapes for every reader). */
export const body = Andika({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "700"], variable: "--font-body", display: "swap" });
/** Little hand-written notes. */
export const hand = Pangolin({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: "400", variable: "--font-hand", display: "swap" });

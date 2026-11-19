/** Soft sky decorations: puffy clouds and the logo's heart. Visual only. */

export function Cloud({ width = 120, className = "", style, color = "#fff" }: { width?: number; className?: string; style?: React.CSSProperties; color?: string }) {
  return (
    <svg width={width} height={width * 0.58} viewBox="0 0 120 70" className={className} style={style} aria-hidden>
      <path d="M28 66C13 66 3 57 3 45s10-21 23-21c3-13 15-22 29-22 15 0 27 10 30 24 2-.4 4-.6 6-.6 14 0 26 10 26 24 0 9-6 16-15 16z" fill={color} />
    </svg>
  );
}

/** The heart from the «о» of the Тоди logo. */
export function Heart({ size = 22, className = "", color = "var(--color-leaf)", style }: { size?: number; className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 21c-5-3.6-9-6.9-9-11.2C3 7 5.1 5 7.7 5c1.8 0 3.3 1 4.3 2.5C13 6 14.5 5 16.3 5 18.9 5 21 7 21 9.8 21 14.1 17 17.4 12 21z" fill={color} />
    </svg>
  );
}

/** Clouds drifting slowly across a section (absolute; the parent needs `relative overflow-hidden`). */
export function Sky({ dense = false, color = "#fff" }: { dense?: boolean; color?: string }) {
  const list: [string, number, number, number][] = [
    ["8%", 150, 70, 0],
    ["38%", 90, 95, -30],
    ["62%", 130, 80, -55],
    ...(dense
      ? ([
          ["20%", 70, 110, -15],
          ["78%", 100, 120, -80],
        ] as [string, number, number, number][])
      : []),
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {list.map(([top, w, dur, delay], i) => (
        <Cloud key={i} width={w} color={color} className="absolute left-0 opacity-90" style={{ top, animation: `drift ${dur}s linear ${delay}s infinite` }} />
      ))}
    </div>
  );
}

/** A few hearts bobbing in a section corner. */
export function Hearts() {
  const list: [string, string, number, string, number][] = [
    ["6%", "18%", 26, "var(--color-leaf)", 0],
    ["90%", "14%", 20, "var(--color-sun)", 0.8],
    ["85%", "78%", 30, "var(--color-leaf)", 1.6],
    ["12%", "82%", 18, "#fff", 0.4],
  ];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {list.map(([left, top, size, color, delay], i) => (
        <span key={i} className="bob absolute" style={{ left, top, animationDelay: `${delay}s`, ["--r" as string]: `${i * 10 - 12}deg` }}>
          <Heart size={size} color={color} />
        </span>
      ))}
    </div>
  );
}

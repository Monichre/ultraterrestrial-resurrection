import type { CSSProperties, ReactNode } from "react";

const styles = {
  plate: {
    background: "var(--color-bg-primary, #e0dad2)",
    border: "1px solid var(--color-text-primary, #090b11)",
    borderRadius: 0,
    color: "var(--color-text-primary, #090b11)",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    position: "relative",
    padding: "var(--spacing-md, 16px)",
  } as CSSProperties,
  label: {
    color: "var(--color-text-secondary, #aeaaa5)",
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  } as CSSProperties,
  ruler: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "var(--spacing-sm, 8px) 0",
  } as CSSProperties,
};

const INK = "var(--color-text-primary, #090b11)";
const FADE = "var(--color-text-secondary, #aeaaa5)";

function RulerTicks({ side }: { side: "left" | "right" }) {
  const ticks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div
      aria-hidden
      style={{
        ...styles.ruler,
        [side]: "var(--spacing-xs, 4px)",
        alignItems: side === "left" ? "flex-start" : "flex-end",
      }}
    >
      {ticks.map((i) => (
        <span
          key={i}
          style={{
            display: "block",
            height: 1,
            width: i % 4 === 0 ? 8 : 4,
            background: i % 4 === 0 ? INK : FADE,
          }}
        />
      ))}
    </div>
  );
}

export function HudSpecimenPlate({
  label,
  children,
}: {
  label?: string;
  children?: ReactNode;
}) {
  return (
    <section style={styles.plate} data-hud-specimen-plate>
      <RulerTicks side="left" />
      <RulerTicks side="right" />
      {label ? (
        <header style={{ ...styles.label, textAlign: "center", marginBottom: "var(--spacing-sm, 8px)" }}>
          {label}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function HudScanBar({ active = true }: { active?: boolean }) {
  const lines = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div aria-hidden style={{ padding: "var(--spacing-xs, 4px) 0" }}>
      {lines.map((i) => (
        <div
          key={i}
          style={{
            height: 1,
            marginBottom: 2,
            background: INK,
            opacity: active ? 0.15 + (i / lines.length) * 0.55 : 0.15,
          }}
        />
      ))}
    </div>
  );
}

export function HudCrosshair({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={INK} strokeWidth="1" />
      <path d="M12 0v7M12 17v7M0 12h7M17 12h7" stroke={INK} strokeWidth="1" />
    </svg>
  );
}

export function HudFieldLineFace({ size = 200 }: { size?: number }) {
  const rows = Array.from({ length: 30 }, (_, i) => i);
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none" aria-label="Field-line face placeholder">
      {rows.map((i) => {
        const y = 8 + i * 3.7;
        const bulge = Math.sin((i / rows.length) * Math.PI) * 14;
        return (
          <path
            key={i}
            d={`M ${30 - bulge * 0.6} ${y} Q 50 ${y - bulge * 0.35} ${70 + bulge * 0.6} ${y}`}
            stroke={INK}
            strokeWidth="0.5"
            opacity={0.35 + Math.sin((i / rows.length) * Math.PI) * 0.5}
          />
        );
      })}
      <path d="M42 62q5 4 10 0M56 62q5 4 10 0" stroke={INK} strokeWidth="0.9" />
      <path d="M52 64v14M45 88q7 5 14 0" stroke={INK} strokeWidth="0.9" />
    </svg>
  );
}

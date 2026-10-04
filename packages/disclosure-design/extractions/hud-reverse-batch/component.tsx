import type { CSSProperties, ReactNode } from "react";

const styles = {
  panel: {
    background: "var(--color-bg-primary, #daccb6)",
    border: "1px solid var(--color-text-primary, #0c0c0c)",
    borderRadius: 0,
    color: "var(--color-text-primary, #0c0c0c)",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    padding: "var(--spacing-md, 16px)",
    position: "relative",
  } as CSSProperties,
  label: {
    color: "var(--color-text-secondary, #a7917b)",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: "var(--spacing-sm, 8px)",
  } as CSSProperties,
  tick: {
    position: "absolute",
    background: "var(--color-text-primary, #0c0c0c)",
  } as CSSProperties,
  rule: {
    border: 0,
    borderTop: "1px solid var(--color-border-primary, #3f332c)",
    margin: "var(--spacing-sm, 8px) 0",
  } as CSSProperties,
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "2px 0",
  } as CSSProperties,
};

function EdgeTicks() {
  const len = 12;
  const positions: CSSProperties[] = [
    { top: "50%", left: -1, width: 1, height: len, transform: "translateY(-50%)" },
    { top: "50%", right: -1, width: 1, height: len, transform: "translateY(-50%)" },
    { top: -1, left: "50%", width: len, height: 1, transform: "translateX(-50%)" },
    { bottom: -1, left: "50%", width: len, height: 1, transform: "translateX(-50%)" },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <span key={i} aria-hidden style={{ ...styles.tick, ...p }} />
      ))}
    </>
  );
}

export function HudScanPanel({
  label,
  children,
}: {
  label?: string;
  children?: ReactNode;
}) {
  return (
    <section style={styles.panel} data-hud-scan-panel>
      <EdgeTicks />
      {label ? <header style={styles.label}>{label}</header> : null}
      {children}
    </section>
  );
}

export function HudStatRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={styles.statRow}>
      <span style={{ color: "var(--color-text-secondary, #a7917b)" }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

export function HudRule() {
  return <hr style={styles.rule} />;
}

export function HudReticleGauge({ size = 72 }: { size?: number }) {
  const c = "var(--color-text-primary, #0c0c0c)";
  const m = "var(--color-text-secondary, #a7917b)";
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden>
      <circle cx="36" cy="36" r="33" stroke={m} strokeWidth="1" />
      <circle cx="36" cy="36" r="22" stroke={c} strokeWidth="1" />
      <path d="M36 1v10M36 61v10M1 36h10M61 36h10" stroke={c} strokeWidth="1" />
      <path d="M36 22v28M22 36h28" stroke={m} strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

export function HudFaceMedallion({ size = 160 }: { size?: number }) {
  const c = "var(--color-text-primary, #0c0c0c)";
  const m = "var(--color-text-secondary, #a7917b)";
  const rings = [0.95, 0.82, 0.68, 0.55, 0.4];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Contour-line face placeholder">
      <circle cx="50" cy="50" r="49" stroke={c} strokeWidth="1" />
      {rings.map((r, i) => (
        <ellipse
          key={i}
          cx="50"
          cy={46 + i * 2}
          rx={44 * r}
          ry={40 * r}
          stroke={i % 2 ? m : c}
          strokeWidth="0.6"
          opacity={0.75}
        />
      ))}
      <path d="M38 46q4 3 8 0M54 46q4 3 8 0" stroke={c} strokeWidth="0.8" />
      <path d="M50 48v12M44 66q6 4 12 0" stroke={c} strokeWidth="0.8" />
    </svg>
  );
}

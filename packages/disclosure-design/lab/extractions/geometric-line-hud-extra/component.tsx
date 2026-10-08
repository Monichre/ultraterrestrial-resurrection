import type { CSSProperties, ReactNode } from "react";

const styles = {
  panel: {
    background: "var(--color-bg-primary, #1e1d1b)",
    border: "1px solid var(--color-border-primary, #2e2f2e)",
    borderRadius: 0,
    color: "var(--color-text-primary, #bdbeba)",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    padding: "var(--spacing-md, 16px)",
    position: "relative",
  } as CSSProperties,
  label: {
    color: "var(--color-text-secondary, #62686b)",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: "var(--spacing-sm, 8px)",
  } as CSSProperties,
  corner: {
    position: "absolute",
    width: 8,
    height: 8,
    borderColor: "var(--color-text-primary, #bdbeba)",
    borderStyle: "solid",
    borderWidth: 0,
  } as CSSProperties,
};

function Corner({ at }: { at: "tl" | "tr" | "bl" | "br" }) {
  const base = styles.corner;
  const map = {
    tl: { top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1 },
    tr: { top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1 },
    bl: { bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1 },
    br: { bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1 },
  } as const;
  return <span aria-hidden style={{ ...base, ...map[at] }} />;
}

export function HudPanel({
  label,
  children,
}: {
  label?: string;
  children?: ReactNode;
}) {
  return (
    <section style={styles.panel} data-hud-panel>
      <Corner at="tl" />
      <Corner at="tr" />
      <Corner at="bl" />
      <Corner at="br" />
      {label ? <header style={styles.label}>{label}</header> : null}
      {children}
    </section>
  );
}

export function HudReticle({ size = 96 }: { size?: number }) {
  const c = "var(--color-text-primary, #bdbeba)";
  const m = "var(--color-text-secondary, #62686b)";
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden>
      <circle cx="48" cy="48" r="44" stroke={m} strokeWidth="1" />
      <circle cx="48" cy="48" r="30" stroke={c} strokeWidth="1" />
      <path d="M48 2v16M48 78v16M2 48h16M78 48h16" stroke={c} strokeWidth="1" />
      <path d="M48 30 66 62H30Z" stroke={c} strokeWidth="1" />
      <path d="M48 30 48 62M48 30 30 62M48 30 66 62" stroke={m} strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export function HudProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div style={{ marginBottom: "var(--spacing-sm, 8px)" }}>
      {label ? <div style={styles.label}>{label}</div> : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 2,
          background: "var(--color-bg-secondary, #2e2f2e)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            background: "var(--color-text-primary, #bdbeba)",
            transform: `scaleX(${clamped / 100})`,
            transformOrigin: "left center",
            transition: `transform var(--duration-normal, 200ms) linear`,
          }}
        />
      </div>
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";

const styles = {
  hero: {
    position: "relative",
    minHeight: "100vh",
    background: "var(--color-bg-primary, #deded6)",
    color: "var(--color-text-primary, #2d2e31)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  } as CSSProperties,
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "var(--spacing-lg, 24px) var(--spacing-xl, 32px)",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  } as CSSProperties,
  navLinks: {
    display: "flex",
    gap: "var(--spacing-lg, 24px)",
  } as CSSProperties,
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 var(--spacing-xl, 32px)",
    position: "relative",
    zIndex: 1,
  } as CSSProperties,
  headline: {
    fontFamily: "var(--font-serif, Georgia, serif)",
    fontWeight: 400,
    fontSize: "clamp(28px, 4.5vw, 56px)",
    lineHeight: 1.15,
    maxWidth: "16em",
    margin: 0,
  } as CSSProperties,
  ctas: {
    display: "flex",
    gap: "var(--spacing-md, 16px)",
    marginTop: "var(--spacing-xl, 32px)",
  } as CSSProperties,
  peak: {
    position: "absolute",
    inset: "auto 0 0 0",
    height: "66%",
    objectFit: "cover",
    objectPosition: "bottom",
    WebkitMaskImage:
      "linear-gradient(to top, black 55%, transparent 100%)",
    maskImage: "linear-gradient(to top, black 55%, transparent 100%)",
    opacity: 0.9,
  } as CSSProperties,
};

export function QuoteHeroNav({
  logo = "DISCLOSURE",
  links = ["FILE", "PROFILE", "SIGN UP"],
}: {
  logo?: string;
  links?: string[];
}) {
  return (
    <nav style={styles.nav}>
      <span>{logo}</span>
      <div style={styles.navLinks}>
        {links.map((l) => (
          <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>
            {l}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function QuoteHeroButton({
  children,
  variant = "filled",
}: {
  children: ReactNode;
  variant?: "filled" | "outline";
}) {
  const filled = variant === "filled";
  return (
    <button
      type="button"
      style={{
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "var(--spacing-sm, 8px) var(--spacing-lg, 24px)",
        background: filled
          ? "var(--color-text-primary, #2d2e31)"
          : "transparent",
        color: filled
          ? "var(--color-bg-primary, #deded6)"
          : "var(--color-text-primary, #2d2e31)",
        border: `1px solid var(--color-text-primary, #2d2e31)`,
        borderRadius: 0,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function QuoteHero({
  headline = "The frontiers of knowledge are stunning, yet haunting",
  peakSrc,
}: {
  headline?: string;
  peakSrc?: string;
}) {
  return (
    <section style={styles.hero}>
      <QuoteHeroNav />
      {peakSrc ? (
        <img src={peakSrc} alt="" aria-hidden style={styles.peak} />
      ) : null}
      <div style={styles.center}>
        <h1 style={styles.headline}>{headline}</h1>
        <div style={styles.ctas}>
          <QuoteHeroButton>Begin Survey</QuoteHeroButton>
          <QuoteHeroButton variant="outline">View Evidence</QuoteHeroButton>
        </div>
      </div>
    </section>
  );
}

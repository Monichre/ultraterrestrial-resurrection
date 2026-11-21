import { CornerBrackets } from './CornerBrackets'
import { Saturn } from './icons/planets'

const PARAGRAPH =
  "SATURN IS THE SIXTH PLANET FROM THE SUN AND ONE OF THE MOST UNIQUE IN THE SOLAR SYSTEM. IT'S A GAS GIANT WITH NO SOLID SURFACE AND IS FAMOUS FOR ITS BRIGHT RING SYSTEM. WINDS CAN REACH UP TO 1,800 KM/H, AND ITS ATMOSPHERE, MADE MOSTLY OF HYDROGEN AND HELIUM, IS HOSTILE TO LIFE OR LANDING."

/**
 * Anchored to the viewport bottom-right (just left of the right planet rail).
 *
 * Layout matches the reference:
 *   [SATURN pill]   [U+1FA90 / SATURN DETAILS / paragraph]
 *         |
 *         '──── leader line up-right to the Saturn marker on the map
 */
export const SaturnFocus = () => (
  <div
    className="pointer-events-none absolute"
    style={{
      right: 400,
      bottom: 56,
      width: 460,
    }}
    aria-label="Saturn details"
  >
    <div className="flex items-start gap-6">
      {/* Pill (framed planet label) */}
      <div className="relative shrink-0" style={{ width: 200 }}>
        <CornerBrackets size={10} stroke={1.5} color="var(--hud-accent)" inset={-6} />
        <div
          className="flex items-center gap-3 border border-hud-text-primary bg-hud-bg px-4"
          style={{ height: 40 }}
        >
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: 16,
              height: 16,
              background: 'var(--hud-marker)',
            }}
            aria-hidden
          >
            <Saturn width={10} height={10} stroke="#0A0A0A" strokeWidth={1.6} />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-hud-text-primary">
            SATURN
          </span>
        </div>

        {/* Leader line: from pill top-right corner up-and-right toward Saturn marker on the map */}
        <svg
          aria-hidden
          style={{ position: 'absolute', right: -120, top: -110, overflow: 'visible' }}
          width={160}
          height={130}
        >
          <polyline
            points="0,128 60,128 150,4"
            fill="none"
            stroke="var(--hud-text-primary)"
            strokeWidth={1}
            strokeOpacity={0.7}
          />
        </svg>
      </div>

      {/* Details block to the right of the pill */}
      <div className="relative flex-1 px-3 py-2" style={{ minWidth: 220 }}>
        <CornerBrackets size={10} stroke={1.5} color="var(--hud-accent)" inset={-2} />
        <div className="text-[10px] font-medium tracking-[0.14em] text-hud-accent">
          U+1FA90
        </div>
        <h3 className="mt-1 text-[12px] font-medium uppercase tracking-[0.12em] text-hud-text-primary">
          SATURN DETAILS....
        </h3>
        <p className="mt-2 text-[10px] uppercase leading-[1.55] tracking-[0.05em] text-hud-text-primary">
          {PARAGRAPH}
        </p>
      </div>
    </div>
  </div>
)

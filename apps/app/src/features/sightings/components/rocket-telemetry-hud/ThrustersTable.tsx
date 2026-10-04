const ROWS = [
  { name: 'LEFT THRUSTERS', status: 'READY' },
  { name: 'RIGHT THRUSTERS', status: 'READY' },
  { name: 'FORWARD THRUSTERS', status: 'IDLE' },
  { name: 'REAR THRUSTERS', status: 'ACTIVE' },
] as const

export const ThrustersTable = () => (
  <div className="flex flex-col gap-3">
    <h3 className="text-[12px] font-medium uppercase tracking-[0.1em] text-hud-text-primary">
      THRUSTERS
    </h3>
    <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.08em]">
      <span className="text-hud-text-secondary">DETAILS</span>
      <span className="text-hud-text-secondary">STATUS</span>
      {ROWS.map((r) => (
        <ROW key={r.name} {...r} />
      ))}
    </div>
  </div>
)

const ROW = ({ name, status }: { name: string; status: string }) => (
  <>
    <span className="text-[11px] text-hud-text-primary">{name}</span>
    <span className="text-[11px] text-hud-text-primary">{status}</span>
  </>
)

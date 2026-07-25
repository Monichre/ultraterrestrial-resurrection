import type { UFODocumentProps } from "@/types/documents"

const DEFAULT_PROPS: Required<UFODocumentProps> = {
  title: "UN:DEFECTTAL",
  subtitle: "SONZEDOM 01/12+93",
  reference: "59-c = 358",
  idPhoto: "/placeholder.svg?height=62&width=62",
  creatureSketch: "/placeholder.svg?height=32&width=24",
  metadata: [
    ["2920", "OVER SI SIBAR", "SIBAR"],
    ["Alright", "110", "Alright"],
    ["11 meters", "BFR", "CRE"],
    ["Redacted", "584", "Fuel"],
  ],
  listItems: [
    { letter: "A", text: "OPS SQUADRON SEPARATE SITE DETECTION" },
    { letter: "B", text: "CRAFT SURVEILLANCE SYSTEMS DURING FLIGHT" },
    { letter: "C", text: "SIR INTELLIGENCE SYSTEMS IN CAV ANTI-AIRCRAFT" },
    { letter: "D", text: "SYSTEMS INTELLIGENCE SYSTEMS DURING FLIGHT" },
    { letter: "E", text: "INTELLIGENCE SYSTEMS SONIC SIGNALS AND COLOURS" },
    { letter: "F", text: "SONIC INTELLIGENCE SYSTEMS ELECTRONIC SYSTEMS" },
    { letter: "G", text: "ELECTRONIC SYSTEMS SONIC SIGNALS SYSTEMS" },
    { letter: "H", text: "LASER THRUST DAMPENING DEVICE SYSTEMS TO" },
    { letter: "I", text: "SYSTEMS DEVICE IN BLUE WORLD AERONAUTIC" },
    { letter: "J", text: "AERONAUTIC SYSTEMS SONIC SIGNALS SYSTEMS" },
    { letter: "K", text: "SYSTEMS SONIC SIGNALS SYSTEMS AERONAUTIC SYSTEMS" },
    { letter: "L", text: "AERONAUTIC SYSTEMS SONIC SIGNALS SYSTEMS" },
    { letter: "M", text: "HEAT HOSTILE TO LAUNCHED UNIDENTIFIED" },
    { letter: "N", text: "UNIDENTIFIED SYSTEMS DURING FLIGHT SYSTEMS" },
    { letter: "O", text: "FLIGHT SYSTEMS SONIC SIGNALS SYSTEMS FLIGHT" },
    { letter: "P", text: "SYSTEMS FLIGHT SYSTEMS SONIC SIGNALS SYSTEMS" },
    { letter: "Q", text: "SONIC SIGNALS SYSTEMS FLIGHT SYSTEMS SONIC" },
    { letter: "R", text: "SYSTEMS SONIC SIGNALS SYSTEMS FLIGHT SYSTEMS" },
    { letter: "S", text: "FLIGHT SYSTEMS SONIC SIGNALS SYSTEMS FLIGHT" },
    { letter: "T", text: "SYSTEMS FLIGHT SYSTEMS SONIC SIGNALS SYSTEMS" },
    { letter: "U", text: "SONIC SIGNALS SYSTEMS FLIGHT SYSTEMS SONIC" },
    { letter: "V", text: "SYSTEMS SONIC SIGNALS SYSTEMS FLIGHT SYSTEMS" },
    { letter: "W", text: "FLIGHT SYSTEMS SONIC SIGNALS SYSTEMS FLIGHT" },
    { letter: "X", text: "SYSTEMS FLIGHT SYSTEMS SONIC SIGNALS SYSTEMS" },
  ],
  stampText: "ISTO:95",
  legalText: "NISOWELON — archival module",
}

export function UFODocument(props: UFODocumentProps = {}) {
  const config = { ...DEFAULT_PROPS, ...props }
  const firstHalf = config.listItems.slice(0, 12)
  const secondHalf = config.listItems.slice(12)

  return (
    <main className="min-h-screen bg-[#0b0c0f] flex items-center justify-center p-6">
      <article className="poster relative w-[768px] h-[1152px] bg-[#ebe7df] shadow-[0_6px_24px_rgba(0,0,0,0.3),_inset_0_0_0_2px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Paper textures and effects */}
        <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-70 bg-[repeating-linear-gradient(0deg,_rgba(0,0,0,0.08)_0px,_rgba(0,0,0,0.08)_1px,_transparent_1px,_transparent_3px)] bg-[length:100%_3px] animate-[shimmer_8000ms_linear_infinite]"></div>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-br from-transparent via-black/5 to-transparent bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_100%_at_50%_0%,_rgba(0,0,0,0.15),_transparent_60%)]"></div>

        {/* Inner content frame */}
        <div className="absolute inset-[24px]">
          {/* Header */}
          <header className="h-[156px] grid grid-cols-12 gap-x-4">
            <div className="col-span-8">
              <h1 className="font-sans font-extrabold tracking-[0.12em] text-[38px] text-[#0e0e0f] leading-none">
                {config.title}
              </h1>
              <p className="mt-[8px] font-mono text-[11px] leading-[14px] tracking-[0.08em] text-[#2b2b2c]/80">
                {config.subtitle}
              </p>
              <p className="font-mono text-[11px] leading-[14px] text-[#2b2b2c]/60">{config.reference}</p>

              <div className="mt-[12px] flex items-start gap-2">
                <img
                  className="w-[62px] h-[62px] rounded-[4px] object-cover grayscale"
                  src={config.idPhoto || "/placeholder.svg"}
                  alt="ID Photo"
                />
                <div className="flex-1">
                  <p className="font-mono text-[11px] leading-[14px] text-[#2b2b2c]/75">ROGO, TD</p>
                  <p className="font-mono text-[11px] leading-[14px] text-[#2b2b2c]/55">MICTIN GIRL ERL</p>
                  <div className="mt-[6px] h-[18px] bg-[#2b2b2c]/10 rounded-sm"></div>
                </div>
              </div>
            </div>

            <aside className="col-span-4">
              {/* Metadata matrix */}
              <div className="grid grid-cols-3 gap-0 border border-black/25 mb-2">
                {config.metadata.map((row, rowIndex) =>
                  row.map((cell, cellIndex) => (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      className="h-[26px] border-[0.5px] border-black/25 px-2 flex items-center"
                    >
                      <span className="font-mono text-[10px] text-[#2b2b2c]/80">{cell}</span>
                    </div>
                  )),
                )}
              </div>

              <div className="flex items-start gap-2">
                <img
                  className="w-[24px] h-[32px] object-contain opacity-80"
                  src={config.creatureSketch || "/placeholder.svg"}
                  alt="Creature sketch"
                />
                <p className="font-mono text-[9px] leading-[12px] text-[#2b2b2c]/70">JCA</p>
              </div>
            </aside>
          </header>

          {/* Footer text band */}
          <footer className="mt-[12px] h-[236px] grid grid-cols-12 gap-x-6">
            <div className="col-span-8 grid grid-cols-2 gap-x-6">
              <ol className="space-y-[6px]">
                {firstHalf.map((item, index) => (
                  <li key={index} className="font-mono text-[10px] leading-[14px] text-[#2b2b2c]/80">
                    <span className="font-bold pr-1">{item.letter}.</span>
                    {item.text}
                  </li>
                ))}
              </ol>

              <ol className="space-y-[6px]">
                {secondHalf.map((item, index) => (
                  <li key={index} className="font-mono text-[10px] leading-[14px] text-[#2b2b2c]/80">
                    <span className="font-bold pr-1">{item.letter}.</span>
                    {item.text}
                  </li>
                ))}
              </ol>
            </div>

            <div className="col-span-4 flex items-end justify-end">
              <div className="text-right">
                <div className="font-mono text-[42px] font-extrabold tracking-[0.02em] text-[#0e0e0f]">{config.stampText}</div>
                <div className="font-mono text-[9px] text-[#2b2b2c]/70">km — at burner</div>
              </div>
            </div>
          </footer>

          {/* Legal strip */}
          <div className="mt-[8px] h-[40px] flex items-center justify-between opacity-60">
            <p className="font-mono text-[9px] text-[#2b2b2c]/60">{config.legalText}</p>
            <div className="w-[120px] h-[18px] border-b border-black/40 -rotate-[2deg]"></div>
          </div>
        </div>
      </article>
    </main>
  )
}

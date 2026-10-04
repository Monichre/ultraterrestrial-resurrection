import { DotFilledIcon } from "@radix-ui/react-icons";

export function SideUI() {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between p-4">
      <div className="space-y-4">
        <DotFilledIcon className="w-4 h-4 text-cyan-500" />
        <DotFilledIcon className="w-4 h-4 text-cyan-500/50" />
        <DotFilledIcon className="w-4 h-4 text-cyan-500/30" />
      </div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-0.5 bg-cyan-500/30"
            style={{
              opacity: 1 - i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}


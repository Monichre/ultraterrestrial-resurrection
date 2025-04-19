import { useRef, useState } from 'react'

export const InputBorderSpotlight = ({
  onChange,
  onSubmit,
  type,
  value,
  className,
}: any) => {
  const divRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!divRef.current || isFocused) return

    const div = divRef.current
    const rect = div.getBoundingClientRect()

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(1)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <>
      <div className={`relative w-full my-4 px-2 ${className}`}>
        <input
          onMouseMove={handleMouseMove}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          autoComplete='off'
          placeholder={`Search ${type}`}
          onSubmit={onSubmit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSubmit()
            }
          }}
          value={value}
          onChange={onChange}
          className='h-8 w-full cursor-default rounded-lg bg-neutral-950 p-3.5 text-slate-100 transition-colors duration-500 placeholder:select-none placeholder:text-neutral-500 placeholder:text-sm placeholder:font-source focus:border focus:border-[rgb(207_174_255)] focus:outline-none'
        />
        <input
          ref={divRef}
          disabled
          style={{
            border: '1px solid rgb(207 174 255)',
            opacity,
            WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
          }}
          aria-hidden='true'
          className='border-[rgb(207 174 255)] pointer-events-none absolute left-0 top-0 z-10 h-8 w-full cursor-default rounded-lg border bg-[transparent] p-3.5 opacity-0  transition-opacity duration-500 placeholder:select-none'
        />
      </div>
    </>
  )
}

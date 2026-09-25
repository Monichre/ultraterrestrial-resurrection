import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

interface DividerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const DividerButton = ({ 
  children, 
  className,
  ...props 
}: DividerButtonProps) => {
  return (
    <div className="-mx-6 mb-3 flex items-center justify-start overflow-auto px-5 md:mx-0 md:justify-center">
      <motion.div 
        className="w-fit shrink-0 overflow-hidden px-1 py-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          type="button"
          className={twMerge(
            "relative flex h-11 items-center gap-3 whitespace-nowrap rounded-full pl-[15px] pr-4",
            "transition duration-500 ease-nc font-mono text-[14px]/[20px] font-599 -tracking-[0.02em]",
            "bg-ln-gray-50 text-ln-gray-700 shadow-ln-badge-gray ring-ln-gray-200",
            "md:shadow-none md:ring-1 md:ring-inset",
            className
          )}
          {...props}
        >
          <div className="grid size-4 shrink-0 items-center justify-center">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 15 14"
                className="size-[15px] text-template-ai"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M7.5 0a7 7 0 1 0 0 14 7 7 0 0 0 0-14m2.642 5.693a.7.7 0 0 0-1.084-.886l-2.66 3.251-.853-.853a.7.7 0 0 0-.99.99l1.4 1.4a.7.7 0 0 0 1.037-.052z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {children}
        </button>
      </motion.div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 36 18"
        className="h-[18px] w-9 shrink-0"
      >
        <path stroke="#E0E0E0" d="M0 8.5h36" />
        <g clipPath="url(#rapid-dev-top-divider-mobile_svg__a)">
          <rect width="16" height="16" x="10" y="1" fill="#F7F7F7" rx="8" />
          <path
            fill="#B8B8B8"
            fillRule="evenodd"
            d="M14.813 5.98a.5.5 0 0 1 .707 0l2.195 2.196a1.167 1.167 0 0 1 0 1.65L15.52 12.02a.5.5 0 1 1-.707-.707l2.195-2.195a.167.167 0 0 0 0-.236l-2.195-2.195a.5.5 0 0 1 0-.708Zm4.667 0a.5.5 0 0 1 .707 0l2.195 2.196a1.167 1.167 0 0 1 0 1.65l-2.195 2.195a.5.5 0 1 1-.707-.707l2.195-2.195a.167.167 0 0 0 0-.236L19.48 6.688a.5.5 0 0 1 0-.708"
            clipRule="evenodd"
          />
        </g>
        <rect
          width="17"
          height="17"
          x="9.5"
          y="0.5"
          stroke="#E0E0E0"
          rx="8.5"
        />
        <defs>
          <clipPath id="rapid-dev-top-divider-mobile_svg__a">
            <rect width="16" height="16" x="10" y="1" fill="#fff" rx="8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

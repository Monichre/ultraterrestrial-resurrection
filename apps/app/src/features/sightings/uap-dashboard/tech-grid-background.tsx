export function TechGridBackground() {
  return (
    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(76, 201, 240, 0.3)" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="150" height="150" patternUnits="userSpaceOnUse">
          <rect width="150" height="150" fill="url(#smallGrid)" />
          <path d="M 150 0 L 0 0 0 150" fill="none" stroke="rgba(76, 201, 240, 0.5)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#0d0d0a" />
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}


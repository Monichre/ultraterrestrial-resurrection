export const NewLogo = () => {
  return (
    <svg width="600" height="200" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Cosmic Glow */}
        <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7f00ff" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#00d2ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* Stellar Core */}
        <radialGradient id="stellarCore" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="#7f00ff" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#00d2ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* Text Gradient */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7f00ff" />
          <stop offset="100%" stopColor="#00d2ff" />
        </linearGradient>
      </defs>

      {/* Emblem */}
      <g transform="translate(100,100)">
        {/* Glow */}
        <circle cx="0" cy="0" r="88" fill="url(#cosmicGlow)" />
        {/* Outer dashed rim */}
        <circle
          cx="0"
          cy="0"
          r="95"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        {/* Orbital rings */}
        <circle cx="0" cy="0" r="80" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" />
        <circle
          cx="0"
          cy="0"
          r="40"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="2"
          strokeDasharray="2,2"
        />
        {/* Core glow */}
        <circle cx="0" cy="0" r="30" fill="url(#stellarCore)" />
        {/* Central triangle */}
        <path d="M0,-60 L52,30 L-52,30 Z" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        {/* Stellar node */}
        <circle cx="0" cy="0" r="6" fill="#ffffff" />
      </g>

      {/* Wordmark */}
      <text
        x="200"
        y="80"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="48"
        fontWeight="500"
        fill="url(#textGradient)"
      >
        ultraterrestrial
      </text>
      <text x="200" y="120" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fill="#aaaaaa" letterSpacing="2">
        KNOWLEDGE MAPPING
      </text>
    </svg>
  )
}

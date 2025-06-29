export const NewLogo = () => { 
  
  return (<svg width="600" height="200" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Cosmic Glow -->
    <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7f00ff" stop-opacity="0.3"/>
      <stop offset="60%" stop-color="#00d2ff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <!-- Stellar Core -->
    <radialGradient id="stellarCore" cx="50%" cy="50%" r="30%">
      <stop offset="0%" stop-color="#7f00ff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#00d2ff" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <!-- Text Gradient -->
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7f00ff"/>
      <stop offset="100%" stop-color="#00d2ff"/>
    </linearGradient>
  </defs>

  <!-- Emblem -->
  <g transform="translate(100,100)">
    <!-- Glow -->
    <circle cx="0" cy="0" r="88" fill="url(#cosmicGlow)"/>
    <!-- Outer dashed rim -->
    <circle
      cx="0" cy="0" r="95"
      fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"
      stroke-dasharray="4,4"
    />
    <!-- Orbital rings -->
    <circle cx="0" cy="0" r="80" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="3"/>
    <circle cx="0" cy="0" r="60" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="4"/>
    <circle cx="0" cy="0" r="40" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="2,2"/>
    <!-- Core glow -->
    <circle cx="0" cy="0" r="30" fill="url(#stellarCore)"/>
    <!-- Central triangle -->
    <path
      d="M0,-60 L52,30 L-52,30 Z"
      fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9"
    />
    <!-- Stellar node -->
    <circle cx="0" cy="0" r="6" fill="#ffffff"/>
  </g>

  <!-- Wordmark -->
  <text
    x="200" y="80"
    font-family="Helvetica, Arial, sans-serif"
    font-size="48"
    font-weight="500"
    fill="url(#textGradient)"
  >ultraterrestrial</text>
  <text
    x="200" y="120"
    font-family="Helvetica, Arial, sans-serif"
    font-size="14"
    fill="#aaaaaa"
    letter-spacing="2"
  >KNOWLEDGE MAPPING</text>
</svg>)

  }
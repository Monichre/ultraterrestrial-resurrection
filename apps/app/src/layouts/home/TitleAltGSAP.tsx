'use client'

import React from 'react'

export const TitleAltGSAP: React.FC = () => {
  const title = "ULTRATERRESTRIAL"
  const subtitle = "RESURRECTION"
  
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Main Title with Letter Spans */}
      <h1 className="text-6xl md:text-8xl font-bold tracking-widest">
        {title.split('').map((letter, index) => (
          <span 
            key={index} 
            className="letter inline-block transform-gpu"
            style={{ 
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            {letter}
          </span>
        ))}
      </h1>
      
      {/* Subtitle with Letter Spans */}
      <h2 className="text-3xl md:text-5xl font-light tracking-[0.3em] text-blue-400">
        {subtitle.split('').map((letter, index) => (
          <span 
            key={index} 
            className="letter inline-block transform-gpu"
            style={{ 
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            {letter}
          </span>
        ))}
      </h2>
      
      {/* Glowing Line */}
      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
      
      {/* Tagline */}
      <p className="text-lg md:text-xl text-gray-400 tracking-wider mt-4">
        DISCOVERING THE TRUTH BEYOND THE STARS
      </p>
    </div>
  )
} 
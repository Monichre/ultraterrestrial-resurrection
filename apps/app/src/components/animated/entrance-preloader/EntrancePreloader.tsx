'use client'

import React, {useRef, useEffect} from 'react'
import {cn} from './utils'
import {EntrancePreloaderProps} from './types'
import {useEntrancePreloader} from './useEntrancePreloader'
import {DEFAULT_LINES} from './default-lines'

export const EntrancePreloader: React.FC<EntrancePreloaderProps> = ({
  onComplete,
  duration = 6,
  title = 'Dimensional Gateway',
  subtitle = 'Traversal Initiated',
  footerLeft = 'Traversal Sequence Complete',
  footerRight = 'Dimensional Gateway Open',
  progressLabel = 'Traversing',
  progressAction = 'Dimensional Shift',
  lines = DEFAULT_LINES,
  specialChars = '▪',
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const {start, isComplete} = useEntrancePreloader(containerRef, {
    duration,
    onComplete,
    specialChars,
  })

  // Start the animation on mount
  useEffect(() => {
    start()
  }, [start])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className='preloader' id='preloader'>
        <div className='terminal-preloader'>
          <div className='border-top'>
            <span>{title}</span>
            <span>{subtitle}</span>
          </div>

          <div className='terminal-container'>
            {/* Terminal Lines */}
            {lines.map((line, index) => (
              <div
                key={`line-${index}`}
                className='terminal-line'
                style={{top: `${line.position}px`}}>
                <span className={line.type} data-scramble={line.scramble ? 'true' : 'false'}>
                  {line.text}
                </span>
              </div>
            ))}

            {/* Progress bar with additional text */}
            <div className='progress-line'>
              <span className='progress-label'>{progressLabel}</span>
              <div className='progress-container'>
                <div className='progress-bar' id='progress-bar'></div>
              </div>
              <span className='highlight' style={{marginLeft: '10px'}} data-scramble='true'>
                {progressAction}
              </span>
            </div>
          </div>

          <div className='border-bottom'>
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
          </div>
        </div>
      </div>

      <div className='content-container'>{children}</div>

      <style jsx>{`
        :root {
          --color-text: #fff;
          --color-bg: #fff;
          --color-overlay: #000;
          --color-overlay-text: #fff;
          --grid-padding: 2rem;
          --grid-gap: 1rem;
          --transition-timing: cubic-bezier(0.65, 0.05, 0.36, 1);
          --transition-duration: 640ms;
          --font-primary: system-ui, sans-serif;
          --font-secondary: monospace;
        }

        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--color-overlay);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .terminal-preloader {
          width: 90%;
          max-width: 800px;
          height: auto;
          max-height: 500px;
          padding: 1rem 0;
          position: relative;
          overflow: hidden;
          display: block;
          opacity: 1;
        }

        .terminal-container {
          position: relative;
          height: 350px;
          margin-top: 30px;
          overflow: hidden;
          padding: 10px;
        }

        .terminal-line {
          position: absolute;
          font-size: 0.9rem;
          line-height: 1.2;
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          left: 0;
          padding-left: 10px;
          text-indent: 0;
          margin-left: 0;
          opacity: 0;
          font-family: var(--font-primary);
          font-weight: 300;
        }

        .terminal-line .highlight,
        .terminal-line .faded {
          display: inline-block;
          padding-left: 0;
          margin-left: 0;
          text-indent: 0;
        }

        .terminal-line span {
          padding-left: 0;
          margin-left: 0;
          text-indent: 0;
          font-family: var(--font-primary);
        }

        .highlight {
          color: #fff;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .faded {
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .border-top,
        .border-bottom {
          position: absolute;
          left: 0;
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          font-size: 0.75rem;
          color: #fff;
          align-items: center;
          font-family: var(--font-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .border-top {
          top: 0;
        }

        .border-bottom {
          bottom: 0;
        }

        .progress-line {
          position: absolute;
          top: 135px;
          left: 0;
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;
          padding-left: 10px;
          margin-left: 0;
          text-indent: 0;
        }

        .progress-label {
          font-weight: 400;
          margin-right: 10px;
          font-size: 0.9rem;
          padding-left: 0;
          margin-left: 0;
          text-indent: 0;
          color: #fff;
          font-family: var(--font-primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .progress-container {
          width: 200px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          width: 0%;
          background-color: #fff;
          transition: none;
        }

        /* Initially hide the content while preloader is active */
        .content-container {
          opacity: 0;
          visibility: hidden;
        }
      `}</style>
    </div>
  )
}

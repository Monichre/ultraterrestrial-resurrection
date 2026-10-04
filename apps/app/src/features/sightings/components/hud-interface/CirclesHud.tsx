import {useEffect, useRef} from 'react'
import gsap from 'gsap'

interface CirclesHudProps {
  className?: string
}

const CirclesHud = ({className = ''}: CirclesHudProps) => {
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // Make sure GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.error('GSAP library not found! Please check your imports.')
      return
    }

    // Initialize the HUD
    const initializeHUD = () => {
      const terminalWindow = document.querySelector('.terminal-window')
      const terminalLines = document.querySelectorAll('.terminal-line')
      const progressFill = document.querySelector('.progress-fill')

      // Show the HUD info panel
      setTimeout(() => {
        const hudInfo = document.querySelector('.hud-info')
        if (hudInfo) hudInfo.classList.add('opacity-100')
      }, 1000)

      // Fill the progress bar
      setTimeout(() => {
        if (progressFill) progressFill.classList.add('w-full')
      }, 1500)

      // Show the terminal window
      setTimeout(() => {
        if (terminalWindow) terminalWindow.classList.add('opacity-100')
        animateTerminalText()
      }, 2000)

      // Animate the wireframe and orbital elements
      animateWireframe()
    }

    // Function to animate terminal text
    const animateTerminalText = () => {
      const terminalLines = document.querySelectorAll('.terminal-line')

      // Make all lines visible with a staggered delay
      terminalLines.forEach((line, index) => {
        setTimeout(() => {
          line.classList.add('opacity-100', 'visible')
        }, index * 100) // 100ms delay between each line
      })
    }

    // Function to animate the wireframe
    const animateWireframe = () => {
      // Simple animation for the globe outline
      gsap.to('.globe-outline', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
      })

      // Animate wireframe lines
      const wireframeLines = document.querySelectorAll('.wireframe-line')
      wireframeLines.forEach((line, index) => {
        gsap.to(line, {
          opacity: 1,
          strokeWidth: 0.5,
          duration: 0.5,
          delay: 0.1 * index, // Staggered delay
          ease: 'power1.inOut',
        })
      })

      // Animate satellites
      gsap.to('.satellite-3d-1, .satellite-3d-2', {
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Animate nodes
      gsap.to('.node-3d-1, .node-3d-2, .node-3d-3, .node-3d-4', {
        scale: 1.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5,
      })

      // Animate the central system with a breathing effect
      gsap.to('.central-system', {
        scale: 1.05,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'center center',
      })

      // Animate connection lines
      const connectionLines = document.querySelectorAll('.connection-line')
      connectionLines.forEach((line, index) => {
        gsap.fromTo(
          line,
          {opacity: 0, strokeDashoffset: 300},
          {
            opacity: 0.2,
            strokeDashoffset: 0,
            duration: 2,
            delay: 3 + index * 0.5,
            ease: 'power2.inOut',
          }
        )
      })
    }

    // Add a click event to make the interface interactive
    const handleClick = () => {
      // Create a ripple effect on click
      const centralSystem = document.querySelector('.central-system')
      if (centralSystem) {
        gsap.to(centralSystem, {
          scale: 1.1,
          duration: 0.3,
          onComplete: () => {
            gsap.to(centralSystem, {
              scale: 1,
              duration: 0.5,
            })
          },
        })
      }
    }

    // Initialize the HUD
    initializeHUD()

    // Add click event listener
    document.addEventListener('click', handleClick)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className={`space-hud w-full h-screen relative overflow-hidden bg-black ${className}`}>
      <div
        className='perspective-container absolute inset-0 flex items-center justify-center'
        style={{perspective: '1200px'}}>
        <svg
          width='100%'
          height='100%'
          viewBox='0 0 1200 800'
          preserveAspectRatio='xMidYMid meet'
          id='main-svg'>
          {/* Main central orbit system */}
          <g className='central-system'>
            {/* Outer orbit rings with 3D perspective movement */}
            <circle
              cx='600'
              cy='400'
              r='250'
              fill='none'
              stroke='rgba(255,255,255,0.2)'
              strokeWidth='1'
              className='orbit-ring orbit-3d-1'></circle>
            <circle
              cx='600'
              cy='400'
              r='200'
              fill='none'
              stroke='rgba(255,255,255,0.3)'
              strokeWidth='1'
              className='orbit-ring orbit-3d-2'></circle>
            <circle
              cx='600'
              cy='400'
              r='150'
              fill='none'
              stroke='rgba(255,255,255,0.4)'
              strokeWidth='1'
              strokeDasharray='5,5'
              className='orbit-ring orbit-3d-3'></circle>
            <circle
              cx='600'
              cy='400'
              r='100'
              fill='none'
              stroke='rgba(255,255,255,0.5)'
              strokeWidth='1'
              className='orbit-ring orbit-3d-4'></circle>

            {/* Planet/Globe in center with enhanced 3D movement */}
            <g className='planet'>
              <circle
                cx='600'
                cy='400'
                r='60'
                fill='none'
                stroke='rgba(255,255,255,0.8)'
                strokeWidth='0.5'
                className='globe-outline'></circle>

              {/* Enhanced wireframe with independent 3D movement */}
              <g className='wireframe-3d-container'>
                {/* Horizontal lines with 3D movement */}
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-1'></ellipse>
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-2'></ellipse>
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='40'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-3'></ellipse>
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='50'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-4'></ellipse>

                {/* Vertical lines with 3D movement */}
                <ellipse
                  cx='600'
                  cy='400'
                  rx='20'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-5'></ellipse>
                <ellipse
                  cx='600'
                  cy='400'
                  rx='30'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-6'></ellipse>
                <ellipse
                  cx='600'
                  cy='400'
                  rx='40'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-7'></ellipse>
                <ellipse
                  cx='600'
                  cy='400'
                  rx='50'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-8'></ellipse>

                {/* Diagonal cross-section lines with 3D movement */}
                <line
                  x1='540'
                  y1='340'
                  x2='660'
                  y2='460'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-9'></line>
                <line
                  x1='540'
                  y1='460'
                  x2='660'
                  y2='340'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-10'></line>
                <line
                  x1='600'
                  y1='340'
                  x2='600'
                  y2='460'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-11'></line>
                <line
                  x1='540'
                  y1='400'
                  x2='660'
                  y2='400'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-12'></line>
              </g>
            </g>

            {/* Orbital paths with satellites and 3D movement */}
            <g className='orbital-paths'>
              {/* Elliptical orbit 1 with 3D movement */}
              <ellipse
                cx='600'
                cy='400'
                rx='350'
                ry='200'
                fill='none'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                transform='rotate(30 600 400)'
                className='orbit-path orbit-3d-5'></ellipse>

              {/* Satellite on orbit 1 with 3D movement */}
              <circle
                cx='950'
                cy='400'
                r='8'
                fill='white'
                stroke='white'
                strokeWidth='1'
                className='satellite satellite-1 satellite-3d-1'></circle>

              {/* Elliptical orbit 2 with 3D movement */}
              <ellipse
                cx='600'
                cy='400'
                rx='300'
                ry='180'
                fill='none'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                transform='rotate(120 600 400)'
                className='orbit-path orbit-3d-6'></ellipse>

              {/* Satellite on orbit 2 with 3D movement */}
              <circle
                cx='600'
                cy='580'
                r='8'
                fill='white'
                stroke='white'
                strokeWidth='1'
                className='satellite satellite-2 satellite-3d-2'></circle>
            </g>

            {/* Additional orbital rings with 3D perspective */}
            <ellipse
              cx='600'
              cy='400'
              rx='280'
              ry='280'
              fill='none'
              stroke='rgba(255,255,255,0.15)'
              strokeWidth='1'
              className='orbit-3d-7'></ellipse>
            <ellipse
              cx='600'
              cy='400'
              rx='320'
              ry='180'
              fill='none'
              stroke='rgba(255,255,255,0.2)'
              strokeWidth='1'
              strokeDasharray='3,3'
              className='orbit-3d-8'></ellipse>

            {/* Additional nodes with 3D movement */}
            <circle cx='480' cy='350' r='5' fill='white' className='node-3d-1'></circle>
            <circle cx='720' cy='450' r='5' fill='white' className='node-3d-2'></circle>
            <circle cx='550' cy='550' r='5' fill='white' className='node-3d-3'></circle>
            <circle cx='650' cy='250' r='5' fill='white' className='node-3d-4'></circle>

            {/* Radar nodes in corners */}
            <g className='radar-nodes'>
              {/* Top left radar */}
              <g transform='translate(200, 200)'>
                <circle
                  cx='0'
                  cy='0'
                  r='40'
                  fill='none'
                  stroke='rgba(255,255,255,0.5)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'></circle>
                <circle cx='0' cy='0' r='3' fill='white'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'></circle>
                <text x='50' y='-30' fill='rgba(255,255,255,0.7)' fontSize='8'>
                  TARGET ACQUISITION
                </text>
                <text x='50' y='-20' fill='rgba(255,255,255,0.5)' fontSize='6'>
                  COORDINATES: 12.4.8.9
                </text>
              </g>

              {/* Top right radar */}
              <g transform='translate(1000, 200)'>
                <circle
                  cx='0'
                  cy='0'
                  r='40'
                  fill='none'
                  stroke='rgba(255,255,255,0.5)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'></circle>
                <circle cx='0' cy='0' r='3' fill='white'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'></circle>
                <text x='-120' y='-30' fill='rgba(255,255,255,0.7)' fontSize='8' textAnchor='start'>
                  VELOCITY MONITORING
                </text>
                <text x='-120' y='-20' fill='rgba(255,255,255,0.5)' fontSize='6' textAnchor='start'>
                  TRAVEL TIME: 1.4H 2M 15S
                </text>
              </g>

              {/* Bottom left radar */}
              <g transform='translate(200, 600)'>
                <circle
                  cx='0'
                  cy='0'
                  r='40'
                  fill='none'
                  stroke='rgba(255,255,255,0.5)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'></circle>
                <circle cx='0' cy='0' r='3' fill='white'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'></circle>
                <text x='50' y='20' fill='rgba(255,255,255,0.7)' fontSize='8'>
                  PROXIMITY SCANNER
                </text>
                <text x='50' y='30' fill='rgba(255,255,255,0.5)' fontSize='6'>
                  CLEAR RADIUS: 500 UNITS
                </text>
              </g>

              {/* Bottom right radar */}
              <g transform='translate(1000, 600)'>
                <circle
                  cx='0'
                  cy='0'
                  r='40'
                  fill='none'
                  stroke='rgba(255,255,255,0.5)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'></circle>
                <circle cx='0' cy='0' r='3' fill='white'></circle>
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'></circle>
                <text x='-50' y='20' fill='rgba(255,255,255,0.7)' fontSize='8' textAnchor='end'>
                  TARGET SCAN
                </text>
                <text x='-50' y='30' fill='rgba(255,255,255,0.5)' fontSize='6' textAnchor='end'>
                  LOCK ACQUIRED: 100% ACCURACY
                </text>
              </g>
            </g>

            {/* Connection lines */}
            <g className='connection-lines'>
              <line
                x1='200'
                y1='200'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'></line>
              <line
                x1='1000'
                y1='200'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'></line>
              <line
                x1='200'
                y1='600'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'></line>
              <line
                x1='1000'
                y1='600'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'></line>
            </g>

            {/* Scanning effect */}
            <circle
              cx='600'
              cy='400'
              r='250'
              fill='none'
              stroke='rgba(255,255,255,0.5)'
              strokeWidth='2'
              className='scanning-effect'></circle>

            {/* Small nodes with pulses */}
            <g className='nodes'>
              <circle
                cx='400'
                cy='300'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'></circle>
              <circle
                cx='800'
                cy='300'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'></circle>
              <circle
                cx='400'
                cy='500'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'></circle>
              <circle
                cx='800'
                cy='500'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'></circle>
              <circle
                cx='600'
                cy='200'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'></circle>
              <circle
                cx='600'
                cy='600'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'></circle>
            </g>
          </g>
        </svg>
      </div>

      {/* Terminal Window */}
      <div className='terminal-window absolute bottom-2.5 right-2.5 w-96 h-96 bg-black border border-white/30 opacity-0 transition-opacity duration-1000'>
        <div className='terminal-header border-b border-white/30 p-1 px-3 flex justify-between items-center'>
          <span className='terminal-title text-xs text-white/40'>SYS_TERM_V42.EXE</span>
          <div className='terminal-controls flex gap-2'>
            <span className='terminal-control w-2 h-2 rounded-full bg-white/30'></span>
            <span className='terminal-control w-2 h-2 rounded-full bg-white/30'></span>
            <span className='terminal-control w-2 h-2 rounded-full bg-white/30'></span>
          </div>
        </div>
        <div className='terminal-content p-3 text-xs font-mono h-[calc(100%-28px)] overflow-auto'>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            $ system.initialize()
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            Initializing system components...
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            Loading navigation module...
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            Loading tactical systems...
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            Loading communication protocols...
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            <span className='text-green-400'>SUCCESS:</span> All modules loaded successfully
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>&nbsp;</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            $ class SpaceshipInterface {'{'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;constructor() {'{'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;this.systems = [];
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;this.status = "STANDBY";
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;this.initialize();
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;{'}'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>&nbsp;</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;initialize() {'{'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;console.log("Initializing spacecraft systems...");
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;this.status = "ACTIVE";
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;this.loadSystems();
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;{'}'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>&nbsp;</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;loadSystems() {'{'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;this.systems = [
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {'{ name: "navigation", status: "online" },'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {'{ name: "propulsion", status: "online" },'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {'{ name: "life_support", status: "online" },'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {'{ name: "weapons", status: "primed" },'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {'{ name: "shields", status: "charged" }'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;&nbsp;&nbsp;];
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            &nbsp;&nbsp;{'}'}
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>{'}'}</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>&nbsp;</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            $ const ship = new SpaceshipInterface();
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            Initializing spacecraft systems...
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>&nbsp;</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            $ ship.status
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>
            "ACTIVE"
          </div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>&nbsp;</div>
          <div className='terminal-line opacity-0 transition-opacity duration-300 mb-1'>$ _</div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className='progress-container absolute bottom-0 right-0 w-1/2 flex items-center'>
        <div className='progress-label text-xs text-white mr-2'>SYS_TERM_V42.EXE</div>
        <div className='progress-bar h-1 bg-white/20 flex-grow mr-2'>
          <div className='progress-fill h-full bg-white w-0 transition-all duration-2000'></div>
        </div>
        <div className='progress-close text-xs text-white mr-2'>[X]</div>
      </div>

      <style jsx>{`
        /* Animations */
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            r: 5;
            opacity: 1;
          }
          50% {
            r: 10;
            opacity: 0.5;
          }
          100% {
            r: 5;
            opacity: 1;
          }
        }

        @keyframes scan {
          0% {
            transform: rotate(0deg);
            stroke-opacity: 0.8;
          }
          50% {
            stroke-opacity: 0.2;
          }
          100% {
            transform: rotate(360deg);
            stroke-opacity: 0.8;
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 1000;
          }
        }

        /* Apply animations */
        .rotating {
          animation: rotate 30s linear infinite;
          transform-origin: 600px 400px;
        }

        .node-pulse {
          animation: pulse 3s ease-in-out infinite;
        }

        .radar-scan {
          animation: scan 4s linear infinite;
          transform-origin: 0px 0px;
        }

        /* CSS animations for elements that don't need JavaScript */
        .orbit-3d-1 {
          animation: rotate 60s linear infinite;
          transform-origin: 600px 400px;
        }

        .orbit-3d-2 {
          animation: rotate 45s linear infinite reverse;
          transform-origin: 600px 400px;
        }

        .orbit-3d-3 {
          animation: rotate 50s linear infinite;
          transform-origin: 600px 400px;
        }

        .orbit-3d-4 {
          animation: rotate 40s linear infinite reverse;
          transform-origin: 600px 400px;
        }

        .satellite-3d-1 {
          animation: pulse 8s ease-in-out infinite;
        }

        .satellite-3d-2 {
          animation: pulse 10s ease-in-out infinite;
        }

        .node-3d-1,
        .node-3d-2,
        .node-3d-3,
        .node-3d-4 {
          animation: pulse 7s ease-in-out infinite;
        }

        .connection-line {
          stroke-dasharray: 5, 5;
          animation: dash 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default CirclesHud

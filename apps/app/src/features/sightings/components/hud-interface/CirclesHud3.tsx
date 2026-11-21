import {useState, useEffect, useRef} from 'react'
import gsap from 'gsap'

interface SystemStatus {
  name: string
  status: 'online' | 'offline' | 'warning' | 'critical' | 'standby' | 'primed' | 'charged'
  value?: number
}

interface CirclesHud3Props {
  className?: string
  interactive?: boolean
  systemStatuses?: SystemStatus[]
}

const defaultSystemStatuses: SystemStatus[] = [
  {name: 'navigation', status: 'online', value: 87},
  {name: 'propulsion', status: 'online', value: 92},
  {name: 'life_support', status: 'online', value: 98},
  {name: 'weapons', status: 'primed', value: 65},
  {name: 'shields', status: 'charged', value: 78},
]

const CirclesHud3 = ({
  className = '',
  interactive = true,
  systemStatuses = defaultSystemStatuses,
}: CirclesHud3Props) => {
  const isInitializedRef = useRef(false)
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null)
  const [terminalCommand, setTerminalCommand] = useState<string>('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400'
      case 'offline':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-400'
      case 'critical':
        return 'text-red-600'
      case 'standby':
        return 'text-gray-400'
      case 'primed':
        return 'text-orange-400'
      case 'charged':
        return 'text-blue-400'
      default:
        return 'text-white'
    }
  }

  // Terminal interactions
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!terminalCommand.trim()) return

    // Add command to output
    setTerminalOutput((prev) => [...prev, `$ ${terminalCommand}`])

    // Process command
    const command = terminalCommand.toLowerCase().trim()

    if (command === 'help') {
      setTerminalOutput((prev) => [
        ...prev,
        'Available commands:',
        '  help - Show this help',
        '  status - Show system status',
        '  scan - Run diagnostics scan',
        '  clear - Clear terminal',
        '  systems - List all systems',
      ])
    } else if (command === 'status') {
      systemStatuses.forEach((sys) => {
        setTerminalOutput((prev) => [
          ...prev,
          `${sys.name}: ${sys.status.toUpperCase()} (${sys.value}%)`,
        ])
      })
    } else if (command === 'scan') {
      setTerminalOutput((prev) => [...prev, 'Initiating system scan...'])
      setIsScanning(true)

      // Simulate scan results after delay
      setTimeout(() => {
        setIsScanning(false)
        setTerminalOutput((prev) => [...prev, 'Scan complete. All systems operational.'])
      }, 3000)
    } else if (command === 'clear') {
      setTerminalOutput([])
    } else if (command === 'systems') {
      setTerminalOutput((prev) => [
        ...prev,
        'Systems:',
        ...systemStatuses.map((sys) => `  - ${sys.name}`),
      ])
    } else {
      setTerminalOutput((prev) => [...prev, `Command not recognized: ${terminalCommand}`])
    }

    // Clear input
    setTerminalCommand('')
  }

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
      const progressFill = document.querySelector('.progress-fill')

      // Fill the progress bar
      setTimeout(() => {
        if (progressFill) progressFill.classList.add('w-full')
      }, 1500)

      // Show the terminal window
      setTimeout(() => {
        if (terminalWindow) terminalWindow.classList.add('opacity-100')

        // Add welcome message
        setTerminalOutput([
          'Space HUD Interface v3.0 initialized',
          "Type 'help' for available commands",
        ])
      }, 2000)

      // Animate the wireframe and orbital elements
      animateWireframe()
    }

    // Function to animate the wireframe
    const animateWireframe = () => {
      // Create a master timeline
      const masterTimeline = gsap.timeline()

      // Simple animation for the globe outline
      masterTimeline.to('.globe-outline', {
        opacity: 1,
        strokeWidth: 1,
        duration: 1.5,
        ease: 'power2.inOut',
      })

      // Staggered animation for the wireframe lines
      masterTimeline.to(
        '.wireframe-line',
        {
          opacity: 1,
          strokeWidth: 0.8,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power1.inOut',
        },
        '-=1'
      )

      // Animate satellites with paths
      gsap.to('.satellite-3d-1', {
        motionPath: {
          path: '.orbit-3d-5',
          align: '.orbit-3d-5',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        duration: 15,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.satellite-3d-2', {
        motionPath: {
          path: '.orbit-3d-6',
          align: '.orbit-3d-6',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        duration: 20,
        repeat: -1,
        ease: 'none',
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

      // Animate radar scans with randomized blinking
      const radarScans = document.querySelectorAll('.radar-scan')
      radarScans.forEach((scan) => {
        gsap.to(scan, {
          strokeOpacity: 0.2,
          duration: gsap.utils.random(1, 2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      // Setup interactive points
      const interactivePoints = document.querySelectorAll('.interactive-point')
      interactivePoints.forEach((point) => {
        // Pulse animation
        gsap.to(point, {
          r: '+=3',
          opacity: 0.7,
          duration: gsap.utils.random(1, 2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }

    // Initialize the HUD
    initializeHUD()

    // Cleanup on component unmount
    return () => {
      gsap.killTweensOf('.globe-outline')
      gsap.killTweensOf('.wireframe-line')
      gsap.killTweensOf('.satellite-3d-1')
      gsap.killTweensOf('.satellite-3d-2')
      gsap.killTweensOf('.node-3d-1, .node-3d-2, .node-3d-3, .node-3d-4')
      gsap.killTweensOf('.radar-scan')
      gsap.killTweensOf('.interactive-point')
    }
  }, [systemStatuses])

  // Handle system selection
  const handleSystemSelect = (name: string) => {
    if (!interactive) return

    setSelectedSystem(name)

    // Show system details in terminal
    const system = systemStatuses.find((sys) => sys.name === name)
    if (system) {
      setTerminalOutput((prev) => [
        ...prev,
        `Selected system: ${name}`,
        `Status: ${system.status.toUpperCase()}`,
        `Performance: ${system.value}%`,
      ])
    }
  }

  return (
    <div className={`space-hud w-full h-screen relative overflow-hidden bg-gray-900 ${className}`}>
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
              className='orbit-ring orbit-3d-1'
            />
            <circle
              cx='600'
              cy='400'
              r='200'
              fill='none'
              stroke='rgba(255,255,255,0.3)'
              strokeWidth='1'
              className='orbit-ring orbit-3d-2'
            />
            <circle
              cx='600'
              cy='400'
              r='150'
              fill='none'
              stroke='rgba(255,255,255,0.4)'
              strokeWidth='1'
              strokeDasharray='5,5'
              className='orbit-ring orbit-3d-3'
            />
            <circle
              cx='600'
              cy='400'
              r='100'
              fill='none'
              stroke='rgba(255,255,255,0.5)'
              strokeWidth='1'
              className='orbit-ring orbit-3d-4'
            />

            {/* Planet/Globe in center with enhanced 3D movement */}
            <g className='planet'>
              <circle
                cx='600'
                cy='400'
                r='60'
                fill='none'
                stroke='rgba(255,255,255,0.8)'
                strokeWidth='0.5'
                className='globe-outline'
              />

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
                  className='wireframe-line wireframe-line-1'
                />
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-2'
                />
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='40'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-3'
                />
                <ellipse
                  cx='600'
                  cy='400'
                  rx='60'
                  ry='50'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-4'
                />

                {/* Vertical lines with 3D movement */}
                <ellipse
                  cx='600'
                  cy='400'
                  rx='20'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-5'
                />
                <ellipse
                  cx='600'
                  cy='400'
                  rx='30'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-6'
                />
                <ellipse
                  cx='600'
                  cy='400'
                  rx='40'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-7'
                />
                <ellipse
                  cx='600'
                  cy='400'
                  rx='50'
                  ry='60'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-8'
                />

                {/* Diagonal cross-section lines with 3D movement */}
                <line
                  x1='540'
                  y1='340'
                  x2='660'
                  y2='460'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-9'
                />
                <line
                  x1='540'
                  y1='460'
                  x2='660'
                  y2='340'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-10'
                />
                <line
                  x1='600'
                  y1='340'
                  x2='600'
                  y2='460'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-11'
                />
                <line
                  x1='540'
                  y1='400'
                  x2='660'
                  y2='400'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='0.5'
                  className='wireframe-line wireframe-line-12'
                />
              </g>
            </g>

            {/* Interactive points for systems */}
            <g className='interactive-systems'>
              {systemStatuses.map((system, index) => {
                // Calculate position in a circular pattern around the center
                const angle = (index / systemStatuses.length) * Math.PI * 2
                const radius = 120
                const x = 600 + radius * Math.cos(angle)
                const y = 400 + radius * Math.sin(angle)

                // Get status-based color
                const statusClass =
                  system.status === 'online'
                    ? 'fill-green-500'
                    : system.status === 'offline'
                    ? 'fill-red-500'
                    : system.status === 'warning'
                    ? 'fill-yellow-500'
                    : system.status === 'critical'
                    ? 'fill-red-600'
                    : system.status === 'standby'
                    ? 'fill-gray-400'
                    : system.status === 'primed'
                    ? 'fill-orange-400'
                    : system.status === 'charged'
                    ? 'fill-blue-400'
                    : 'fill-white'

                return (
                  <g
                    key={system.name}
                    className={`system-point ${selectedSystem === system.name ? 'selected' : ''}`}
                    onClick={() => handleSystemSelect(system.name)}
                    style={{cursor: interactive ? 'pointer' : 'default'}}>
                    <circle
                      cx={x}
                      cy={y}
                      r='8'
                      className={`interactive-point ${statusClass} transition-all duration-300`}
                      stroke={selectedSystem === system.name ? 'white' : 'rgba(255,255,255,0.5)'}
                      strokeWidth={selectedSystem === system.name ? '2' : '1'}
                    />
                    <text
                      x={x}
                      y={y + 20}
                      fontSize='10'
                      fill='white'
                      textAnchor='middle'
                      className='pointer-events-none uppercase'
                      aria-label={system.name}>
                      {system.name}
                    </text>
                    {/* Progress indicator */}
                    {system.value !== undefined && (
                      <circle
                        cx={x}
                        cy={y}
                        r='12'
                        fill='none'
                        stroke='rgba(255,255,255,0.3)'
                        strokeWidth='1'
                        strokeDasharray={`${(system.value / 100) * 75} 75`}
                        className='transform -rotate-90 origin-center'
                      />
                    )}
                  </g>
                )
              })}
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
                className='orbit-path orbit-3d-5'
              />

              {/* Satellite on orbit 1 with 3D movement */}
              <circle
                cx='950'
                cy='400'
                r='8'
                fill='white'
                stroke='white'
                strokeWidth='1'
                className='satellite satellite-1 satellite-3d-1'
              />

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
                className='orbit-path orbit-3d-6'
              />

              {/* Satellite on orbit 2 with 3D movement */}
              <circle
                cx='600'
                cy='580'
                r='8'
                fill='white'
                stroke='white'
                strokeWidth='1'
                className='satellite satellite-2 satellite-3d-2'
              />
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
              className='orbit-3d-7'
            />
            <ellipse
              cx='600'
              cy='400'
              rx='320'
              ry='180'
              fill='none'
              stroke='rgba(255,255,255,0.2)'
              strokeWidth='1'
              strokeDasharray='3,3'
              className='orbit-3d-8'
            />

            {/* Additional nodes with 3D movement */}
            <circle cx='480' cy='350' r='5' fill='white' className='node-3d-1' />
            <circle cx='720' cy='450' r='5' fill='white' className='node-3d-2' />
            <circle cx='550' cy='550' r='5' fill='white' className='node-3d-3' />
            <circle cx='650' cy='250' r='5' fill='white' className='node-3d-4' />

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
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                />
                <circle cx='0' cy='0' r='3' fill='white' />
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'
                />
                <text
                  x='50'
                  y='-30'
                  fill='rgba(255,255,255,0.7)'
                  fontSize='8'
                  aria-label='Target acquisition'>
                  TARGET ACQUISITION
                </text>
                <text
                  x='50'
                  y='-20'
                  fill='rgba(255,255,255,0.5)'
                  fontSize='6'
                  aria-label='Coordinates'>
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
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                />
                <circle cx='0' cy='0' r='3' fill='white' />
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'
                />
                <text
                  x='-120'
                  y='-30'
                  fill='rgba(255,255,255,0.7)'
                  fontSize='8'
                  textAnchor='start'
                  aria-label='Velocity monitoring'>
                  VELOCITY MONITORING
                </text>
                <text
                  x='-120'
                  y='-20'
                  fill='rgba(255,255,255,0.5)'
                  fontSize='6'
                  textAnchor='start'
                  aria-label='Travel time'>
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
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                />
                <circle cx='0' cy='0' r='3' fill='white' />
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'
                />
                <text
                  x='50'
                  y='20'
                  fill='rgba(255,255,255,0.7)'
                  fontSize='8'
                  aria-label='Proximity scanner'>
                  PROXIMITY SCANNER
                </text>
                <text
                  x='50'
                  y='30'
                  fill='rgba(255,255,255,0.5)'
                  fontSize='6'
                  aria-label='Clear radius'>
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
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='30'
                  fill='none'
                  stroke='rgba(255,255,255,0.4)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='20'
                  fill='none'
                  stroke='rgba(255,255,255,0.3)'
                  strokeWidth='1'
                />
                <circle
                  cx='0'
                  cy='0'
                  r='10'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                />
                <circle cx='0' cy='0' r='3' fill='white' />
                <circle
                  cx='0'
                  cy='0'
                  r='45'
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='1'
                  className='radar-scan'
                />
                <text
                  x='-50'
                  y='20'
                  fill='rgba(255,255,255,0.7)'
                  fontSize='8'
                  textAnchor='end'
                  aria-label='Target scan'>
                  TARGET SCAN
                </text>
                <text
                  x='-50'
                  y='30'
                  fill='rgba(255,255,255,0.5)'
                  fontSize='6'
                  textAnchor='end'
                  aria-label='Lock acquired'>
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
                className='connection-line'
              />
              <line
                x1='1000'
                y1='200'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'
              />
              <line
                x1='200'
                y1='600'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'
              />
              <line
                x1='1000'
                y1='600'
                x2='600'
                y2='400'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth='1'
                strokeDasharray='5,5'
                className='connection-line'
              />
            </g>

            {/* Scanning effect */}
            <circle
              cx='600'
              cy='400'
              r='250'
              fill='none'
              stroke='rgba(255,255,255,0.5)'
              strokeWidth={isScanning ? '3' : '2'}
              strokeOpacity={isScanning ? '0.8' : '0.5'}
              className={`scanning-effect ${isScanning ? 'animate-pulse' : ''}`}
            />

            {/* Small nodes with pulses */}
            <g className='nodes'>
              <circle
                cx='400'
                cy='300'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'
              />
              <circle
                cx='800'
                cy='300'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'
              />
              <circle
                cx='400'
                cy='500'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'
              />
              <circle
                cx='800'
                cy='500'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'
              />
              <circle
                cx='600'
                cy='200'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'
              />
              <circle
                cx='600'
                cy='600'
                r='5'
                fill='none'
                stroke='white'
                strokeWidth='1'
                className='node-pulse'
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Status panel */}
      <div className='absolute top-2.5 left-2.5 p-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded text-xs w-64'>
        <div className='font-bold text-white mb-2'>SYSTEM STATUS</div>
        <div className='space-y-1.5'>
          {systemStatuses.map((system) => (
            <div
              key={system.name}
              className={`flex justify-between items-center ${
                selectedSystem === system.name ? 'bg-white/10 p-1 rounded' : ''
              }`}
              onClick={() => handleSystemSelect(system.name)}
              style={{cursor: interactive ? 'pointer' : 'default'}}>
              <span className='text-white/80 uppercase'>{system.name}</span>
              <span className={`${getStatusColor(system.status)}`}>
                {system.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
        {interactive && (
          <div className='mt-4 text-center text-white/60 text-[10px]'>
            CLICK ON SYSTEM FOR DETAILS
          </div>
        )}
      </div>

      {/* Terminal Window with interactive input */}
      <div className='terminal-window absolute bottom-2.5 right-2.5 w-96 h-96 bg-black border border-white/30 opacity-0 transition-opacity duration-1000'>
        <div className='terminal-header border-b border-white/30 p-1 px-3 flex justify-between items-center'>
          <span className='terminal-title text-xs text-white/40'>INTERACTIVE_TERMINAL_V3.EXE</span>
          <div className='terminal-controls flex gap-2'>
            <span className='terminal-control w-2 h-2 rounded-full bg-white/30' />
            <span className='terminal-control w-2 h-2 rounded-full bg-white/30' />
            <span className='terminal-control w-2 h-2 rounded-full bg-white/30' />
          </div>
        </div>
        <div className='terminal-content p-3 text-xs font-mono h-[calc(100%-76px)] overflow-auto'>
          {terminalOutput.map((line, i) => (
            <div key={i} className='mb-1 text-white'>
              {line}
            </div>
          ))}
          {isScanning && (
            <div className='mb-1 text-blue-400 animate-pulse'>
              Scanning system... Please wait...
            </div>
          )}
        </div>
        {interactive && (
          <form
            onSubmit={handleTerminalSubmit}
            className='terminal-input-area border-t border-white/30 p-2 flex'>
            <span className='text-white/60 mr-2'>$</span>
            <input
              type='text'
              value={terminalCommand}
              onChange={(e) => setTerminalCommand(e.target.value)}
              className='flex-1 bg-transparent text-white outline-none text-xs'
              placeholder="Enter command (type 'help' for options)"
              aria-label='Terminal command input'
            />
          </form>
        )}
      </div>

      {/* Progress bar at bottom */}
      <div className='progress-container absolute bottom-0 right-0 w-1/2 flex items-center'>
        <div className='progress-label text-xs text-white mr-2'>INTERACTIVE_TERMINAL_V3.EXE</div>
        <div className='progress-bar h-1 bg-white/20 flex-grow mr-2'>
          <div className='progress-fill h-full bg-blue-400 w-0 transition-all duration-2000' />
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

        .connection-line {
          stroke-dasharray: 5, 5;
          animation: dash 20s linear infinite;
        }

        /* System selection highlighting */
        .selected circle {
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
        }

        /* Animate pulse for scanning */
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default CirclesHud3

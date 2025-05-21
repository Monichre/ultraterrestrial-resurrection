import { Box } from '@mui/system';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import React, { useRef, useState } from 'react';

const speed = 15;
const size = 82;

const GlowingOrb = () => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter
            id="dissolve-filter"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
            colorInterpolationFilters="sRGB"
            overflow="visible"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0225"
              numOctaves="3"
              result="noise"
            ></feTurbulence>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 40 -15"
              result="noisyAlpha"
            ></feColorMatrix>
            <feComposite
              operator="in"
              in="SourceGraphic"
              in2="noisyAlpha"
            ></feComposite>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="300"
              xChannelSelector="R"
              yChannelSelector="G"
            ></feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <Box
        component={motion.div}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: size,
          width: size,
          willChange: 'transform',
          clipPath: 'inset(0 0 0 0 round 50%)',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, #00F0FF 0%, #0031FF 75%)',
          boxShadow:
            '0 4px 6px 0 rgba(0,123,255,0.00), 0 5px 10px 0 rgba(0,121,255,0.50), inset 0 0 1px 0 rgba(255,255,255,0.90), inset 0 1px 7px 0 #A4F0FF',
        }}
      >
        <Box
          sx={{
            borderRadius: '50%',
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%',
            width: '100%',
            backgroundImage:
              'radial-gradient(circle at 50% 90%, #E2FFFF 0%, rgba(0,49,255,0.00) 70%)',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: [-60, 0, 90],
            scale: [1.2, 1, 1],
            y: [6, 4, 8],
          }}
          transition={{
            duration: 2,
            repeat: 1 / 0,
            repeatType: 'reverse',
          }}
          sx={{
            borderRadius: '50%',
            position: 'absolute',
            top: '5px',
            left: '5px',
            height: 'calc(100% - 10px)',
            width: 'calc(100% - 10px)',
            filter: 'blur(2px)',
            background:
              'radial-gradient(circle at 33% 12%, #F0FFFF 0%, #00DDFF 26%, rgba(0,49,255,0.00) 63%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            height: 'calc(100% - 10px)',
            width: 'calc(100% - 10px)',
            borderRadius: '50%',
            backgroundImage:
              'radial-gradient(circle at 31% 12%, rgba(254,254,254,0.0) 0%, rgba(0,221,255,0.0) 31%, #0026CC 77%)',
            filter: 'blur(1px)',
            opacity: 0.65,
          }}
        />
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1],
            filter: ['blur(2px)', 'blur(4px)'],
          }}
          transition={{
            duration: 1.3,
            repeat: 1 / 0,
            repeatType: 'reverse',
          }}
          sx={{
            borderRadius: '50%',
            position: 'absolute',
            top: '24px',
            left: '24px',
            height: '48px',
            width: '48px',
            background:
              'linear-gradient(-36deg, #E8FAFF 12%, #00BBFF 36%, rgba(0,49,255,0.00) 54%)',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1],
            filter: ['blur(2px)', 'blur(4px)'],
          }}
          transition={{
            duration: 1.3,
            repeat: 1 / 0,
            repeatType: 'reverse',
          }}
          sx={{
            borderRadius: '50%',
            position: 'absolute',
            top: '24px',
            left: '12px',
            height: '48px',
            width: '48px',
            transform: 'rotate(12deg)',
            backgroundImage:
              'linear-gradient(163deg, #E8FAFF 0%, #0099FF 19%, rgba(0,49,255,0.00) 50%)',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: 1 / 0,
            repeatType: 'mirror',
          }}
          sx={{
            position: 'absolute',
            background: '#0031FF40',
            top: '0',
            left: '0',
            height: '50%',
            width: '50%',
            filter: 'url(#dissolve-filter) blur(4px)',
          }}
        />
        <Box
          sx={{
            opacity: 0.16,
            borderRadius: '50%',
            position: 'absolute',
            top: '4px',
            left: '4px',
            height: 'calc(100% - 8px)',
            width: 'calc(100% - 8px)',
            background:
              'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.00) 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '11px',
            left: '32px',
            height: '24px',
            width: '42px',
            transform: 'rotate(27deg)',
            background:
              'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.00) 100%)',
            borderRadius: '10px',
            filter: 'blur(4px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '48px',
            left: '4px',
            height: '24px',
            width: '50px',
            transform: 'rotate(-142deg)',
            backgroundImage:
              'linear-gradient(180deg, #00F0FF 0%, rgba(255,255,255,0.00) 100%)',
            borderRadius: '10px',
            filter: 'blur(4px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '24px',
            left: '54px',
            height: '12px',
            width: '24px',
            opacity: 0.8,
            transform: 'rotate(79deg)',
            backgroundImage:
              'linear-gradient(180deg, #00BBFF 0%, rgba(255,255,255,0.00) 100%)',
            borderRadius: '10px',
            filter: 'blur(4px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%',
            width: '100%',
            opacity: 0.8,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow:
              'inset 0 -1px 6px 1px rgba(255,255,255,0.50), inset 0 3px 4px 0px rgba(255,255,255,0.50)',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          sx={{
            opacity: 0.5,
            position: 'absolute',
            top: '6px',
            left: '6px',
            height: size - 12,
            width: size - 12,
            background:
              'radial-gradient(circle at 50% 100%, #fff 0%, rgba(255, 255, 255, 0) 80%)',
            borderRadius: '999px',
            filter: 'blur(1px)',
          }}
        />

        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            inset: 0,
            filter: 'blur(1px)',
            mixBlendMode: 'plus-lighter',
          }}
          animate={{ rotate: [30, -30] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        >
          <div
            style={{
              transform: `scale(1.15) translateY(${size * 0.35}px)`,
              width: '100%',
              height: '100%',
            }}
          >
            <WavyBlob
              color="rgba(255, 255, 255, 0.1)"
              duration={60 / (speed * 1.75)}
              size={size}
            />
          </div>
        </Box>

        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            inset: 0,
            filter: 'blur(1px)',
            mixBlendMode: 'plus-lighter',
            opacity: 0.1,
          }}
          animate={{ rotate: [-30, 30] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        >
          <div
            style={{
              transform: `scale(1.15) translateY(-${size * 0.35}px)`,
              width: '100%',
              height: '100%',
            }}
          >
            <WavyBlob color="#fff" duration={60 / (speed * 2.25)} size={size} />
          </div>
        </Box>

        <Box sx={{ position: 'absolute', inset: 0 }}>
          <ParticleEffect />
        </Box>
      </Box>

      <Box
        sx={{
          fontFamily: 'Instrument Serif',
          fontSize: 28,
          fontWeight: 300,
          lineHeight: 1.3,
          textAlign: 'center',
          color: '#fff',
          letterSpacing: 1,
          mt: '24px',
        }}
      >
        Stardust Breaker
      </Box>
    </Box>
  );
};

const WavyBlob = ({ color = '#fff', duration = 1, size = 80 }) => {
  const timeRef = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);

  // Create 6 points around a circle
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return {
      baseX: Math.cos(angle) * 0.9,
      baseY: Math.sin(angle) * 0.9,
    };
  });

  const progress = useMotionValue(0);

  // Update animation
  useAnimationFrame(time => {
    if (!pathRef.current) return;

    timeRef.current = time / 1000; // Convert to seconds
    const angle = ((timeRef.current % duration) / duration) * Math.PI * 2;

    // Calculate new points positions
    const adjustedPoints = points.map((point, index) => {
      const phaseOffset = (index * Math.PI) / 3;
      const xOffset = Math.sin(angle + phaseOffset) * 0.15;
      const yOffset = Math.cos(angle + phaseOffset) * 0.15;

      return {
        x: (point.baseX + xOffset) * size * 0.45 + size / 2,
        y: (point.baseY + yOffset) * size * 0.45 + size / 2,
      };
    });

    // Create SVG path
    let pathData = `M ${adjustedPoints[0].x},${adjustedPoints[0].y}`;

    adjustedPoints.forEach((point, i) => {
      const next = adjustedPoints[(i + 1) % adjustedPoints.length];

      // Calculate control points for smooth curves
      const currentAngle = Math.atan2(point.y - size / 2, point.x - size / 2);
      const nextAngle = Math.atan2(next.y - size / 2, next.x - size / 2);

      const handleLength = size * 0.45 * 0.33;

      const control1 = {
        x: point.x + Math.cos(currentAngle + Math.PI / 2) * handleLength,
        y: point.y + Math.sin(currentAngle + Math.PI / 2) * handleLength,
      };

      const control2 = {
        x: next.x + Math.cos(nextAngle - Math.PI / 2) * handleLength,
        y: next.y + Math.sin(nextAngle - Math.PI / 2) * handleLength,
      };

      pathData += ` C ${control1.x},${control1.y} ${control2.x},${control2.y} ${next.x},${next.y}`;
    });

    // Update the path
    pathRef.current.setAttribute('d', pathData);
    progress.set(time);
  });

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <Box
        component="svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        sx={{ position: 'absolute', top: 0, left: 0 }}
      >
        <motion.path
          ref={pathRef}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </Box>
    </Box>
  );
};

const ParticleEffect = () => {
  const [dots, setDots] = useState(() =>
    Array.from({ length: 16 }).map((_, index) => ({
      id: crypto.randomUUID(),
      size: Math.floor(10 + 1 * Math.random()),
      left: 12 + 56 * Math.random(),
      delay: 0.4 * index,
      direction: Math.random() < 0.5 ? -1 : 1,
    }))
  );

  return (
    <React.Fragment>
      {dots.map(dot => (
        <Box
          component={motion.svg}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          key={dot.id}
          initial={{ opacity: 0, y: 80 }}
          animate={{
            opacity: [1, 0.8, 0.6, 0.6],
            y: -20,
            scale: [1, 0.8, 0.8, 0],
            x: dot.direction * 10,
            rotate: [0, 360],
          }}
          exit={{ opacity: 0 }}
          sx={{
            position: 'absolute',
            height: dot.size,
            width: dot.size,
            left: dot.left,
            top: 24,
          }}
          transition={{
            duration: 3.5,
            ease: 'linear',
            delay: dot.delay,
            repeat: Infinity,
          }}
        >
          <path
            d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
            fill="#fff"
          />
        </Box>
      ))}
    </React.Fragment>
  );
};

export default GlowingOrb;

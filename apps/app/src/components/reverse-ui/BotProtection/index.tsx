import { Box } from '@mui/system';
import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';

const useAnimationProgress = (duration: number) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useAnimationFrame(time => {
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }

    const elapsed = (time - startTimeRef.current) % (duration * 1000);
    const newProgress = elapsed / (duration * 1000);
    setProgress(newProgress);
  });

  return progress;
};

const isDotVisible = (
  dotAngle: number,
  scannerAngle: number,
  scanWidth = 42
) => {
  // Normalize scanner angle to 0-360 range
  const normalizedScannerAngle = ((scannerAngle % 360) + 360) % 360;

  // Calculate the range of angles where the scanner is active
  const scannerStart = normalizedScannerAngle;
  const scannerEnd = (normalizedScannerAngle + scanWidth) % 360;

  // Check if dot is within the active scanning range
  if (scannerStart < scannerEnd) {
    return dotAngle >= scannerStart && dotAngle <= scannerEnd;
  } else {
    // Handle the case when the scanner wraps around 360 degrees
    return dotAngle >= scannerStart || dotAngle <= scannerEnd;
  }
};

const BotProtection = () => {
  const animationProgress = useAnimationProgress(35);
  const currentScannerAngle = -200 + animationProgress * 360;

  const dots = [
    { top: 300, left: 65, angle: 188 },
    { top: 180, left: 170, angle: 223 },
    { top: 45, left: 290, angle: 260 },
    { top: 140, left: 420, angle: 292 },
    { top: 280, left: 480, angle: 337 },
  ];

  return (
    <Box
      sx={{
        height: 340,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Box
        component={'svg'}
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: 680,
          height: 680,
          transform: 'translate(-50%)',
        }}
        viewBox="0 0 680 680"
        fill="none"
      >
        <g
          strokeDasharray="0.25 4"
          stroke="white"
          strokeOpacity="0.195"
          strokeLinecap="round"
        >
          <circle cx="340" cy="340" r="136"></circle>
          <circle cx="340" cy="340" r="184"></circle>
          <circle cx="340" cy="340" r="232"></circle>
          <circle cx="340" cy="340" r="280"></circle>
          <circle cx="340" cy="340" r="328"></circle>
        </g>
      </Box>
      <Box
        sx={{
          width: 176,
          height: 176,
          border: '1px solid rgba(255, 255, 255, 0.055)',
          borderRadius: '50%',
          position: 'absolute',
          bottom: -88,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <Box
            component={motion.div}
            initial={{ transform: 'rotate(-60deg)' }}
            animate={{ transform: 'rotate(300deg)' }}
            transition={{
              repeat: 1 / 0,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
              repeatDelay: 0,
            }}
            sx={{
              background:
                'conic-gradient(from calc(-43deg), white 42deg, transparent 42deg)',
              maskImage:
                'radial-gradient(closest-side, transparent calc(100% - 1px), white calc(100% - 1px))',
              opacity: 0.7,
              position: 'absolute',
              inset: '-1px',
              borderRadius: '50%',
            }}
          />
          <Box
            component={motion.div}
            initial={{ transform: 'translate(-50%) rotate(-60deg)' }}
            animate={{ transform: 'translate(-50%) rotate(300deg)' }}
            transition={{
              repeat: 1 / 0,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
              repeatDelay: 0,
            }}
            sx={{
              position: 'absolute',
              width: 680,
              height: 680,
              background:
                'conic-gradient(from calc(-44.85deg), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1) 3deg, rgba(255, 255, 255, 0.1) calc(43deg), rgba(255, 255, 255, 0) calc(46deg))',
              maskImage:
                'radial-gradient(closest-side, transparent 5.5rem, black 5.5rem, transparent 21.25rem)',
              borderRadius: '9999px',
              left: '50%',
              top: '-252px',
              transform: 'translate(-50%)',
            }}
          />
        </Box>
      </Box>

      {dots.map((dot, index) => (
        <Dot
          key={index}
          top={dot.top}
          left={dot.left}
          isVisible={isDotVisible(dot.angle, currentScannerAngle)}
        />
      ))}
    </Box>
  );
};

const Dot = ({
  top,
  left,
  isVisible,
}: {
  top: number;
  left: number;
  isVisible?: boolean;
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top,
        left,
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <Box
            component={motion.div}
            exit={{ opacity: 0 }}
            sx={{
              position: 'relative',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component={motion.div}
              initial={{
                opacity: 0,
                transform: 'scale(0.6)',
              }}
              animate={{
                opacity: 1,
                transform: 'scale(1)',
                transition: {
                  opacity: {
                    delay: 0.5,
                    repeat: 1 / 0,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  },
                  transform: {
                    delay: 0.35,
                    repeat: 1 / 0,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  },
                },
              }}
              exit={{
                opacity: 0,
                transform: 'scale(0.6)',
                transition: { duration: 0.4 },
              }}
              sx={{
                position: 'absolute',
                background: 'rgb(22 22 22/.1)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                boxShadow:
                  '0 0 10px 2px rgba(255,45,60,0.15), inset 0 0 0 calc(1px + 0px) rgb(240 66 66/0.1)',
                '&:after': {
                  borderRadius: 'inherit',
                  inset: 0,
                  content: '""',
                  boxShadow: 'inset 0 0 0 calc(1px + 0px) rgb(240 66 66/0.1)',
                  position: 'absolute',
                },
              }}
            />
            <Box
              component={motion.div}
              initial={{
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0.9)',
              }}
              animate={{
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)',
                transition: {
                  transform: {
                    delay: 0.4,
                    repeat: 1 / 0,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  },
                },
              }}
              sx={{
                position: 'absolute',
                background: 'rgb(22 22 22/.5)',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                width: 22,
                height: 22,
                boxShadow:
                  '0 0 3px 1px rgba(255,45,60,0.15), inset 0 0 0 calc(1px + 0px) rgb(240 66 66/0.3)',
              }}
            />

            <Box
              sx={{
                zIndex: 2,
                width: 6,
                height: 6,
                borderRadius: '2px',
                backgroundColor: 'rgb(239 68 68)',
                boxShadow:
                  '0 0 8px 1px #f42937,0 1px rgba(255,255,255,0.2) inset',
              }}
            />
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default BotProtection;

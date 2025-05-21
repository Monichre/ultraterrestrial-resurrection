import { Box } from '@mui/system';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useRef } from 'react';

const paths = [
  'M0 100H55.022C61.8914 100 68.6451 101.769 74.6324 105.137L120.368 130.863C126.355 134.231 133.109 136 139.978 136H201.5',
  'M0 60H48.2171C59.2463 60 69.7861 64.5539 77.3451 72.5854L117.655 115.415C125.214 123.446 135.754 128 146.783 128H201.5',
  'M0 188H55.022C61.8914 188 68.6451 186.231 74.6324 182.863L120.368 157.137C126.355 153.769 133.109 152 139.978 152H201.5',
  'M0 228H48.2171C59.2463 228 69.7861 223.446 77.3451 215.415L117.655 172.585C125.214 164.554 135.754 160 146.783 160H201.5',
  'M0 287H41.7852C56.4929 287 70.0142 278.929 76.994 265.983L118.49 189.017C125.47 176.071 138.991 168 153.699 168H202',
  'M0 144L201 145',
  'M0 1H41.5946C56.3171 1 69.8495 9.08744 76.823 22.0537L118.177 98.9463C125.15 111.913 138.683 120 153.405 120H201.5',
];

const DataFeedingIn = () => {
  const svgRef = useRef<any>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const pulseGradients = Array.from(
      svgRef.current.querySelectorAll('[id*=pulse]')
    );

    const animate = async () => {
      pulseGradients.forEach((gradient, i) => {
        controls.start({
          x1: ['-50%', '100%'],
          x2: ['50%', '150%'],
          transition: {
            duration: 1.5,
            ease: 'linear',
            repeat: Infinity,
            delay: 0.25,
          },
        });
      });
    };

    animate();
  }, [controls]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        mt: '120px',
      }}
    >
      <Box
        sx={{
          transform: 'rotate(90deg) translateX(40px) translateY(0)',
          height: 80,
          transformOrigin: 'right',
        }}
      >
        <svg
          width="202"
          className="ml-auto"
          viewBox="0 0 202 288"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
        >
          {paths.map((d, index) => (
            <React.Fragment key={index}>
              <path
                d={d}
                stroke="white"
                mask="url(#mask)"
                strokeLinecap="round"
                strokeOpacity="0.2"
                strokeWidth="2"
                strokeDasharray="0.1 3"
              />
              <path
                d={d}
                stroke={`url(#pulse-${index})`}
                strokeLinecap="round"
                strokeOpacity="1"
                strokeWidth="2"
                strokeDasharray="0.1 3"
                mask="url(#mask)"
              />
            </React.Fragment>
          ))}

          <defs>
            <linearGradient
              id="maskGrad"
              x1="202"
              y1="227"
              x2="32"
              y2="227"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <mask id="mask" maskUnits="userSpaceOnUse">
              <rect width="202" height="288" fill="url(#maskGrad)" />
            </mask>

            {Array.from({ length: 7 }).map((_, index) => (
              <motion.linearGradient
                key={index}
                id={`pulse-${index}`}
                x1="-100%"
                y1="0"
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
                animate={controls}
              >
                <stop offset="0.35" stopColor="#716FFF" stopOpacity="0" />
                <stop offset="0.45" stopColor="#716FFF" />
                <stop offset="0.55" stopColor="#716FFF" />
                <stop offset="0.65" stopColor="#716FFF" stopOpacity="0" />
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </Box>

      <Box
        sx={{
          width: 400,
          background:
            'linear-gradient(rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
          borderRadius: '14px',
          height: 260,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            padding: '10px',
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.075)',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        </Box>
        <Box sx={{ padding: '0' }}>
          <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
            {Array.from({ length: 3 }, (_, index) => (
              <Box
                key={index}
                sx={{
                  flexShrink: 0,
                  width: 180,
                  height: 40,
                  borderTop: '1px solid rgba(255, 255, 255, 0.075)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.075)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.075)',
                  px: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Box
                  sx={{
                    border: '2px solid rgba(255, 255, 255, 0.075)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    width: 16,
                    height: 16,
                    borderRadius: '4px',
                  }}
                />
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.075)',
                    height: 8,
                    width: 88,
                    borderRadius: '4px',
                  }}
                />
              </Box>
            ))}
          </Box>
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              component={motion.div}
              key={i}
              sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                ease: 'easeIn',
                delay: 1.25 + i * 1.5,
                duration: 0.3,
              }}
            >
              {Array.from({ length: 3 }, (_, j) => (
                <Box
                  key={i + j}
                  sx={{
                    flexShrink: 0,
                    width: 180,
                    height: 36,
                    borderRight: '1px solid rgba(255, 255, 255, 0.075)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.075)',
                    px: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.075)',
                      height: 8,
                      width: 88,
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default DataFeedingIn;

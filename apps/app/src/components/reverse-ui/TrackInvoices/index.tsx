import { Box } from '@mui/system';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

const INVOICE_COUNT = 3;

export interface TrackInvoicesProps {
  title?: string;
  logo?: string;
  count?: number;
}

const TrackInvoices = (props: TrackInvoicesProps) => {
  const { count = INVOICE_COUNT, logo, title = 'Reporting summary' } = props;

  return (
    <Box sx={{ py: '60px', display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          perspective: 600,
          position: 'relative',
          height: 500,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Invoice
            key={index}
            index={index}
            title={title}
            count={count}
            logo={logo}
          />
        ))}
      </Box>
    </Box>
  );
};

const Invoice = ({
  index,
  logo,
  count,
  title,
}: {
  index: number;
  logo?: string;
  count: number;
  title: string;
}) => {
  const controls = useAnimation();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const animate = async () => {
      while (isMounted.current) {
        for (let i = 0; i < count; i++) {
          if (!isMounted.current) break;

          const currentPosition = (index + i) % count;
          const nextPosition = (index + i + 1) % count;
          const currentY = 24 * currentPosition;
          const nextY = 24 * nextPosition;
          const currentZ = 20 * currentPosition;
          const nextZ = 20 * nextPosition;

          if (nextPosition === 0) {
            await controls.start({
              y: [currentY, 24 * count],
              z: [currentZ, 20 * count],
              opacity: [1, 0],
              zIndex: currentPosition + 1,
              transition: { duration: 2 / 3, ease: 'easeInOut' },
            });
            controls.set({
              y: nextY,
              z: nextZ,
              opacity: 0,
              zIndex: nextPosition,
            });
            await controls.start({
              opacity: 1,
              transition: { duration: 1 / 3, ease: 'easeOut' },
            });
          } else {
            await controls.start({
              y: [currentY, nextY],
              z: [currentZ, nextZ],
              zIndex: nextPosition,
              transition: { duration: 1, ease: 'easeInOut' },
            });
          }

          // Add a delay between cycles
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    animate();

    return () => {
      isMounted.current = false;
      controls.stop();
    };
  }, [controls, index]);

  return (
    <Box
      component={motion.div}
      key={index}
      animate={controls}
      transition={{ repeat: Infinity, repeatDelay: 1 }}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translate3d(0, ${24 * index}px, ${20 * index}px)`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          borderRadius: '4px',
          overflow: 'hidden',
          borderTop: '4px solid hsl(39 100% 57%)',
        }}
      >
        <Box
          sx={{
            padding: '32px 24px',
            background: '#232323',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: '20px',
            }}
          >
            <Box component="img" src={logo} sx={{ width: 90 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              sx={{
                height: 8,
                width: '25%',
                background: '#5a5a5a',
                borderRadius: 9999,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                width: '25%',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <Box
                sx={{
                  height: 8,
                  width: '100%',
                  background: '#5a5a5a',
                  borderRadius: 9999,
                }}
              />
              <Box
                sx={{
                  height: 8,
                  width: '50%',
                  borderRadius: 9999,
                  background: '#303030',
                }}
              />
              <Box
                sx={{
                  height: 8,
                  width: '65%',
                  borderRadius: 9999,
                  background: '#303030',
                }}
              />
              <Box
                sx={{
                  height: 8,
                  width: '90%',
                  borderRadius: 9999,
                  background: '#303030',
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: '24px',
            background: '#1d1d1d',
          }}
        >
          <Box
            sx={{
              fontSize: 13,
              fontWeight: 500,
              mb: '6px',
              color: '#ededed',
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              py: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
            }}
          >
            <Box sx={{ width: '50%' }}>
              <Box
                sx={{
                  height: 8,
                  width: '35%',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </Box>
            <Box sx={{ width: '50%' }}>
              <Box
                sx={{
                  height: 8,
                  width: '35%',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </Box>
          </Box>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                py: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
              }}
            >
              <Box sx={{ width: '50%' }}>
                <Box
                  sx={{
                    height: 8,
                    width: '35%',
                    borderRadius: 9999,
                    background: '#303030',
                  }}
                />
              </Box>
              <Box sx={{ width: '50%' }}>
                <Box
                  sx={{
                    height: 8,
                    width: '35%',
                    borderRadius: 9999,
                    background: '#303030',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            padding: '24px',
            background: '#1d1d1d',
          }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                py: '12px',
                borderBottom:
                  i == 1 ? undefined : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ width: '25%' }}>
                <Box
                  sx={{
                    height: 8,
                    width: '45%',
                    borderRadius: 9999,
                    background: '#303030',
                  }}
                />
              </Box>
              <Box sx={{ width: '25%' }}>
                <Box
                  sx={{
                    height: 8,
                    width: '45%',
                    borderRadius: 9999,
                    background: '#303030',
                  }}
                />
              </Box>
              <Box sx={{ width: '25%' }}>
                <Box
                  sx={{
                    height: 8,
                    width: '45%',
                    borderRadius: 9999,
                    background: '#303030',
                  }}
                />
              </Box>
              <Box sx={{ width: '25%' }}>
                <Box
                  sx={{
                    height: 8,
                    width: '45%',
                    borderRadius: 9999,
                    background: '#303030',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TrackInvoices;

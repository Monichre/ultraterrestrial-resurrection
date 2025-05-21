import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const RoleBasedAccessControl = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const tid = setTimeout(() => {
      setIsAnimating(true);
    }, 250);

    const resetInt = setInterval(() => {
      setIsAnimating(false);

      setTimeout(() => {
        setIsAnimating(true);
      }, 1500);
    }, 6000);

    return () => {
      clearTimeout(tid);
      clearTimeout(resetInt);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: 400,
        width: 400,
        mask: 'radial-gradient(90% 88% at 50% 50%,#fff 10%,transparent 65%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircleAnimation
        width={360}
        height={360}
        index={2}
        opacity={0.5}
        isAnimating={isAnimating}
      />
      <CircleAnimation
        width={270}
        height={270}
        index={1}
        opacity={0.5}
        isAnimating={isAnimating}
      />
      <CircleAnimation
        width={180}
        height={180}
        index={0}
        opacity={0.5}
        isAnimating={isAnimating}
      />
      <Box
        component={motion.div}
        initial={{ x: 0 }}
        animate={
          isAnimating
            ? {
                scale: [1, 1.05, 0.9, 0.95, 1.05, 1],
              }
            : {
                scale: 1,
              }
        }
        transition={{
          duration: 1.15,
          ease: 'easeInOut',
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
        sx={{
          width: 140,
          height: 74,
          boxShadow: 'inset 0 0 50px 0 #ffffff14,inset 0 -8px 10px 0 #ffffff04',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '9999px',
          position: 'relative',
          px: '8px',
          background: '#00000055',
          '&:before': {
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            content: '""',
            padding: '1px',
            backgroundImage:
              'linear-gradient(180deg,hsla(0,0%,100%,.15),hsla(0,0%,100%,0))',
            borderRadius: 'inherit',
            position: 'absolute',
            inset: 0,
          },
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            transition: 'all .4s cubic-bezier(0,0,0.2,1)',
            ...(isAnimating && {
              transform: 'translateX(100%)',
              transitionDelay: '0.4s',
              filter: 'drop-shadow(0 0 4px #FFFFFF)',
              borderColor: 'rgba(255, 255, 255, 1)',
            }),
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36 36a4.875 4.875 0 1 0 0-9.75A4.875 4.875 0 0 0 36 36Zm7.694 9.75c1.004 0 1.776-.912 1.417-1.85a9.753 9.753 0 0 0-18.224 0c-.358.938.412 1.85 1.417 1.85h15.39Z"
              fill="#fff"
            ></path>
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

const CircleAnimation = ({
  isAnimating,
  width,
  height,
  index,
  opacity,
}: {
  isAnimating?: boolean;
  width: number;
  height: number;
  index: number;
  opacity: number;
}) => {
  return (
    <Box
      component={motion.div}
      animate={isAnimating ? { scale: [1, 0.95, 1.1, 1.05, 1] } : { scale: 1 }}
      transition={{
        duration: 1.2,
        ease: 'linear',
        delay: 0.5 + index * 0.1,
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
      sx={{
        width,
        height,
        top: `calc(50% - ${height / 2}px)`,
        left: `calc(50% - ${width / 2}px)`,
        position: 'absolute',
        borderRadius: '50%',
        padding: '1.5px',
        backgroundImage:
          'linear-gradient(180deg,hsla(0,0%,100%,.42),#222 44.79%)',
        boxShadow: 'inset 0 -16px 32px #ffffff0a',
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        opacity: opacity,
      }}
    />
  );
};

export default RoleBasedAccessControl;

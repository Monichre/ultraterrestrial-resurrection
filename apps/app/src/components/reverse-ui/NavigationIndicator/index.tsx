import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useState } from 'react';

export interface NavigationIndicatorProps {
  items?: string[];
  activeIndex?: number | null;
  onClick?: (index: number) => void;
}

const NavigationIndicator = (props: NavigationIndicatorProps) => {
  const { items = [], activeIndex = null, onClick } = props;
  const [hoverIndex, setHoverIndex] = useState<null | number>(null);

  const animate = (val: number) =>
    hoverIndex === null
      ? 0.4
      : Math.max(1 - 0.2 * Math.abs(val - hoverIndex), 0.4);

  const handleClick = (index: number) => {
    onClick?.(index);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{ padding: '4px 0', cursor: 'pointer', position: 'relative' }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => handleClick(index)}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.4 }}
            animate={{
              scale: animate(index),
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            sx={{
              width: 38,
              height: 4,
              backgroundColor: activeIndex === index ? '#ffb224' : '#a0a0a0',
              borderRadius: '4px',
            }}
          />

          {hoverIndex === index ? (
            <Box
              component={motion.span}
              initial={{
                opacity: 0,
                scale: 0.4,
                filter: 'blur(5px)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: 0.15,
                delay: 0.0875,
              }}
              sx={{
                fontSize: 11,
                color: activeIndex === index ? '#ffb224' : '#a0a0a0',
                position: 'absolute',
                left: 44,
                top: -2,
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  );
};

export default NavigationIndicator;

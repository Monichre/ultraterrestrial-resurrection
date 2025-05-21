import { Box } from '@mui/system';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useEffect, useState } from 'react';

export interface TimelineProgressProps {
  actions?: string[];
}

const timelineVariants = {
  hidden: {},
  visible: {
    transition: {
      when: 'afterChildren',
      staggerChildren: 3,
      delayChildren: 0.5,
    },
  },
};

const badgeVariants = {
  hidden: {},
  visible: {
    backgroundColor: '#37401c',
    color: '#c2da91',
    borderColor: '#37401c',
  },
};

const lineVariants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
  },
};

const TimelineProgress = (props: TimelineProgressProps) => {
  const { actions = [] } = props;
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <Box>
      <Box
        component={motion.div}
        variants={timelineVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {actions.map((action, i) => (
          <TimelineItem
            isActive={i <= currentItem}
            key={i}
            actions={actions}
            action={action}
            index={i}
            onAnimationComplete={() =>
              setCurrentItem(Math.min(actions.length - 1, i + 1))
            }
          />
        ))}
      </Box>
    </Box>
  );
};

const TimelineItem = ({
  actions,
  action,
  index,
  isActive,
  onAnimationComplete,
}: {
  actions: string[];
  action: string;
  index: number;
  isActive: boolean;
  onAnimationComplete: () => void;
}) => {
  return (
    <Box
      component={motion.div}
      variants={{
        hidden: {},
        visible: {},
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      onAnimationComplete={onAnimationComplete}
    >
      <Box
        component={motion.div}
        variants={badgeVariants}
        sx={{
          background: '#fff',
          border: '1px solid #e2e2e2',
          padding: '8px 12px',
          borderRadius: '16px',
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          svg: {
            width: 20,
            height: 20,
          },
        }}
      >
        {isActive && <CircularProgress />}
        <AnimatePresence>
          {isActive && (
            <Box
              component={motion.div}
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{
                duration: 0.25,
                ease: 'easeOut',
              }}
            >
              {action}
            </Box>
          )}
        </AnimatePresence>
        {!isActive && action}
      </Box>
      {index !== actions.length - 1 && (
        <Box
          sx={{
            height: '54px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '54px',
              height: '2px',
              transform: 'rotate(90deg)',
              background: '#e8e8e8',
            }}
          >
            <Box
              component={motion.div}
              variants={lineVariants}
              transition={{
                duration: 2.75,
                ease: 'linear',
              }}
              sx={{
                height: '100%',
                width: '0%',
                background: '#37401c',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const CircularProgress = () => {
  const progress = useMotionValue(0);
  const circleFill = useTransform(
    progress,
    [0, 94, 100],
    ['transparent', 'transparent', 'rgb(194, 218, 145)']
  );
  const circleLength = useTransform(progress, [0, 100], [0, 1]);
  const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1]);
  const circleColor = useTransform(
    progress,
    [0, 95, 100],
    ['#FFCC66', '#FFCC66', '#c2da91']
  );

  useEffect(() => {
    animate(progress, 100, { delay: 0.5, duration: 1 });
  }, [progress]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 258 258"
    >
      <motion.path
        d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
        fill={circleFill}
      />

      <motion.path
        transform="translate(60 85)"
        d="M3 50L45 92L134 3"
        fill="transparent"
        stroke="#37401c"
        strokeWidth={14}
        style={{ pathLength: checkmarkPathLength }}
      />
      <motion.path
        d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
        fill="transparent"
        strokeWidth="8"
        stroke={circleColor}
        style={{
          pathLength: circleLength,
        }}
      />
    </motion.svg>
  );
};

export default TimelineProgress;

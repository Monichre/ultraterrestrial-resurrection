import { Box } from '@mui/system';
import { keyframes } from '@emotion/react';

const blinkKeyframe = keyframes`
  0% {
      opacity: 0;
  }

  50% {
      opacity: 1;
  }

  100% {
      opacity: 0;
  }
`;

const TypingCursor = () => {
  return (
    <Box
      sx={{
        width: 6,
        height: 12,
        display: 'inline-block',
        ml: '3px',
        mb: '-1px',
        background: 'hsla(0,0%,100%,.75)',
        animation: `${blinkKeyframe} 1.5s infinite`,
      }}
    />
  );
};

export default TypingCursor;

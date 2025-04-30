import { Box } from '@mui/system';
import MultiLineTypewriter from './MultiLineTypewriter';
import { keyframes } from '@emotion/react';
import ScreenFrame from './ScreenFrame';

const RetroTerminal = () => {
  return (
    <Box sx={{ width: 360, height: 231, position: 'relative' }}>
      <Box
        component={ScreenFrame}
        sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          left: 20,
          right: 20,
          height: 140,
          py: '10px',
          px: '16px',
          fontSize: 11,
          lineHeight: '20px',
          fontFamily: 'JetBrains Mono',
          borderRadius: '8px',
          textShadow: '0 0 4px #008f11',
          color: '#00ff41',
          fontWeight: 500,
          background:
            'radial-gradient(62.5% 62.5% at 50% 100%, rgb(10 114 68 / 60%) 0, rgba(170, 138, 255, 0) 100%), #05321e',
          boxShadow:
            '0 -1px 0 rgb(53 237 50 / 30%), 0 3px 1px hsla(0, 0%, 0%, .08), inset 0 -1px 0 rgba(109, 228, 116, .24), inset 0 0 12px #000, inset 0 0 1px rgba(0, 0, 0, .85), inset 0 0 15px rgb(255 255 255 / 36%)',

          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(0deg,transparent,transparent 50%,rgba(0,0,0,.12) 0,rgba(0,0,0,.12))',
            backgroundSize: '4px 4px',
            animation: `${bgFlickerKeyframe} 1.5s linear infinite`,
          },
        }}
      >
        <MultiLineTypewriter
          showCursor
          lines={[
            { text: '> ', delay: 0, noBreak: true },
            { text: 'Building Docker image...', delay: 1000 },
            { text: 'Login to Amazon ECR....', delay: 1500 },
            { text: 'Push Docker image to ECR...', delay: 1000 },
            { text: 'Configuring Kubectl...', delay: 1000 },
            { text: '---', delay: 1000 },
            { text: 'Application deployed!', delay: 1000 },
          ]}
        />
      </Box>
    </Box>
  );
};

const bgFlickerKeyframe = keyframes`
  0% {
     background-position: 0 0;
  }

  100% {
    background-position: 4px 4px;
  }
`;

export default RetroTerminal;

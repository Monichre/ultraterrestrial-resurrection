import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const LogEnum = {
  LOG: 'LOG',
  INFO: 'INFO',
  ERROR: 'ERROR',
};

function formatTimestamp(date: Date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day} ${month} ${hours}:${minutes}:${seconds}`;
}

export interface LogsExplorerProps {
  logs: {
    LOG: string[];
    INFO: string[];
    ERROR: string[];
  };
}

const LogsExplorer = (props: LogsExplorerProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { logs = {} } = props;

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const generateLogEntry = useCallback((timeOffset?: number) => {
    const timestamp = new Date();
    timestamp.setSeconds(timestamp.getSeconds() - (timeOffset ?? 0));

    const randomValue = Math.random();
    const logLevel =
      randomValue > 0.9
        ? LogEnum.ERROR
        : randomValue > 0.45
        ? LogEnum.INFO
        : LogEnum.LOG;

    //@ts-ignore
    const messages = logs?.[logLevel];
    const randomIndex = Math.round(Math.random() * (messages?.length - 1));

    return {
      id: crypto.randomUUID(),
      timestamp: timestamp,
      status: logLevel,
      message: messages?.[randomIndex],
    };
  }, []);

  const initialLogs = [
    generateLogEntry(),
    generateLogEntry(1000),
    generateLogEntry(2000),
    generateLogEntry(3000),
    generateLogEntry(4000),
    generateLogEntry(5000),
    generateLogEntry(6000),
    generateLogEntry(7000),
    generateLogEntry(8000),
    generateLogEntry(9000),
  ];

  const [logEntries, setLogEntries] = useState(initialLogs);

  useEffect(() => {
    const id = setInterval(() => {
      const shouldAddLog = Math.random() > 0.6;

      if (shouldAddLog) {
        setLogEntries(prevLogs => [generateLogEntry(), ...prevLogs]);
      }
    }, 750);

    return () => {
      clearInterval(id);
    };
  }, []);

  const resolveLogColor = {
    LOG: 'hsl(151 60.2% 54.1%)',
    INFO: 'hsl(206 99.9% 65.3%)',
    ERROR: 'hsl(359 90.5% 74.3%)',
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        height: 400,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          height: '100px',
          zIndex: 10,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          backgroundImage:
            'linear-gradient(to top, rgb(22 22 22), transparent)',
        }}
      ></Box>
      <Box sx={{ position: 'absolute', inset: 0, width: '100%' }}>
        <Box
          component={motion.div}
          transition={{
            delay: -0.2,
            duration: 0.1,
            staggerChildren: 0.1,
          }}
          layout
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            position: 'relative',
          }}
        >
          {logEntries.map((log, index) => (
            <Box
              key={log.id}
              component={motion.div}
              layout={true}
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2 + 0.03 * index,
                  duration: 0.15,
                },
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                py: '8px',
                fontSize: 12,
                color: 'hsl(0 0% 65.1%)',
                fontFamily: 'JetBrains Mono',
                borderBottom: '1px solid hsl(0 0% 22.5%)',
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{formatTimestamp(log.timestamp)}</Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '4px',
                  //@ts-ignore
                  color: resolveLogColor[log.status],
                  width: 50,
                  flexShrink: 0,
                }}
              >
                [{log.status}]
              </Box>
              <Box
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {log.message}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LogsExplorer;

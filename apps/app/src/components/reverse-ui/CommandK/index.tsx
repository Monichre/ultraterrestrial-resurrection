import { Box, BoxProps } from '@mui/system';
import { useState } from 'react';

interface Command {
  name: string;
  icon: JSX.Element | string;
}

interface GroupCommands {
  [category: string]: Command[];
}

export interface CommandKProps {
  commands?: GroupCommands;
}

const CommandK = (props: CommandKProps) => {
  const { commands = {} } = props;

  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 440,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: -25,
            left: 10,
            transform: 'rotate(-40deg)',
          }}
        >
          <KeyboardKey
            sx={{
              alignItems: 'flex-end',
              width: 100,
              fontSize: 12,
            }}
          >
            <Box>⌘</Box>
            <Box>command</Box>
          </KeyboardKey>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            zIndex: 2,
            transform: 'rotate(15deg)',
            right: 30,
            background: 'rgb(22 22 22)',
          }}
        >
          <KeyboardKey
            sx={{
              fontSize: 12,
              height: 36,
              width: 36,
            }}
          >
            K
          </KeyboardKey>
        </Box>

        <Box
          sx={{
            width: 460,
            height: 304,
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, .1)',
            borderRadius: '12px',
            position: 'relative',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',

            '&:before': {
              pointerEvents: 'none',
              content: '""',
              boxShadow: '0 -28px 84px -24px rgba(255,255,255, 0.1) inset',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 'inherit',
              // background:
              //   'radial-gradient(103.78% 100% at 50% 0%,rgba(118,146,255,0) 80.55%,rgba(122,150,255,.04) 100%),radial-gradient(120.05% 100% at 50% 0%,rgba(226,232,255,0) 33.78%,rgba(226,232,255,.08) 100%),rgba(226,232,255,.01)',
            },
          }}
        >
          <Box sx={{ padding: '6px' }}>
            <Box
              sx={{
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.55)',
                padding: '3px 8px',
                fontWeight: 400,
                fontSize: 12,
                display: 'inline-block',
              }}
            >
              Actions
            </Box>
          </Box>
          <Box
            component="input"
            type="text"
            placeholder="Type a command or search..."
            onChange={e => setSearchQuery(e.target.value)}
            sx={{
              padding: '12px 8px',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
              border: 0,
              width: '100%',
              color: 'rgba(255, 255, 255, 0.65)',
              borderBottom: '1px solid rgba(255,255,255,.08)',

              '::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          />

          <Box
            sx={{
              pt: '6px',
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 100%',
              overflowY: 'auto',
            }}
          >
            {Object.entries(commands).map(([category, categoryCommands]) => (
              <Box key={category}>
                <Box
                  sx={{
                    px: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 12,
                    transition:
                      'height .35s cubic-bezier(.6,.6,0,1), opacity .35s cubic-bezier(.6,.6,0,1)',
                    height: 30,
                    ...(!!searchQuery && {
                      height: 0,
                      opacity: 0,
                      pointerEvents: 'none',
                    }),
                  }}
                >
                  {category}
                </Box>
                {categoryCommands.map((command, i) => {
                  const isMatch = command.name
                    .toLocaleLowerCase()
                    .includes(searchQuery.toLocaleLowerCase());
                  return (
                    <CommandItem
                      key={category + i}
                      icon={command.icon}
                      title={command.name}
                      isActive={isMatch}
                    />
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const CommandItem = ({ title, icon, isActive }: any) => {
  return (
    <Box
      sx={{
        px: '12px',
        height: 36,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
        transition:
          'opactiy .35s cubic-bezier(.6,.6,0,1), height .35s cubic-bezier(.6,.6,0,1), background .15s cubic-bezier(.6,.6,0,1)',
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.06)',
        },

        svg: {
          color: 'inherit',
          width: 16,
          height: 16,
        },

        img: {
          width: 16,
          height: 'auto',
        },

        ...(!isActive && {
          opacity: 0,
          height: 0,
          pointerEvents: 'none',
        }),
      }}
    >
      {typeof icon === 'string' ? <img src={icon} /> : icon}
      <Box>{title}</Box>
    </Box>
  );
};

const KeyboardKey = (props: BoxProps) => {
  return (
    <Box
      sx={{
        fontSize: 10,
        height: 44,
        width: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: '5px',
        background: 'rgba(255,255,255,.01)',
        boxShadow: '0 0 0 1px #414143',
        color: 'rgb(255 255 255 / 75%)',
        gap: '2px',
        lineHeight: '16px',
        padding: '4px 8px',
        position: 'relative',

        '&:before': {
          position: 'absolute',
          border: '1px solid rgba(255,255,255,.05)',
          content: '""',
          top: 0,
          left: 0,
          width: 'calc(100% - 2px)',
          height: 'calc(100% - 2px)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        },
        '&:after': {
          position: 'absolute',
          content: '""',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          background:
            'linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.08) 100%)',
        },
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
};

export default CommandK;

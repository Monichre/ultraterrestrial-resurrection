import React from 'react';
import { useState } from 'react';
import Typewriter from '../TypeWritter';
import TypingCursor from './TypingCursor';

interface MultiLineTypewriterProps {
  showCursor: boolean;
  lines: Array<{
    text: string;
    speed?: number;
    delay?: number;
    noBreak?: boolean;
  }>;
}

const MultiLineTypewriter = ({
  lines,
  showCursor,
}: MultiLineTypewriterProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleLineComplete = () => {
    if (currentLineIndex < lines.length - 1) {
      setTimeout(() => {
        setCurrentLineIndex(prevIndex => prevIndex + 1);
      }, lines[currentLineIndex].delay || 0);
    }
  };

  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      {lines.slice(0, currentLineIndex + 1).map((line, index) => (
        <React.Fragment key={index}>
          {index > 0 && !lines[index - 1].noBreak && <br />}
          <Typewriter
            text={line.text}
            speed={line.speed}
            delay={line.delay}
            onComplete={
              index === currentLineIndex ? handleLineComplete : undefined
            }
          />
        </React.Fragment>
      ))}
      {showCursor && <TypingCursor />}
    </div>
  );
};

export default MultiLineTypewriter;

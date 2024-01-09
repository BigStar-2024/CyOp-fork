import { useState, useEffect } from "react";
import { useAudio } from "react-awesome-audio";
const sndType = require("assets/audio/type.mp3").default;

interface ITyped {
  text: string;
  start: boolean;
  startDelay?: number;
  speed?: number;
  soundFile?: string;
  noSound?: boolean;
  endDelay?: number;
  onComplete?: () => void;
}

export default function useTyped({
  text,
  start,
  startDelay = 0,
  speed = 50,
  soundFile = sndType,
  noSound = false,
  endDelay = 500,
  onComplete
}: ITyped): [string, boolean] {
  const [currentString, setCurrentString] = useState("");
  const [completed, setCompleted] = useState(false);
  const { play, pause } = useAudio({
    src: soundFile,
    loop: true
  });

  let timer: NodeJS.Timeout;

  const typewrite = (curString: string, curStrPos: number) => {
    timer = setTimeout(() => {
      if (curStrPos === curString.length) {
        pause();
        setTimeout(() => {
          setCompleted(true);
          if (onComplete) onComplete();
        }, endDelay);
      } else {
        setCurrentString(curString.substring(0, curStrPos + 1));
        curStrPos++;
        typewrite(curString, curStrPos);
      }
    }, speed);
  };

  useEffect(() => {
    if (start) {
      if (startDelay > 0) {
        // eslint-disable-next-line
        timer = setTimeout(() => {
          typewrite(text, 0);
          if (!noSound) play();
        }, startDelay);
      } else {
        typewrite(text, 0);
        if (!noSound) play();
      }
      // Remove event listeners on cleanup
      return () => {
        // audio.pause()
        pause();
        // audio.removeEventListener('ended', pauseAudio)
        clearTimeout(timer);
      };
    }
  }, [start, text]); // Empty array ensures that effect is only run on mount and unmount

  return [currentString, completed];
}

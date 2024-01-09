import useShuffled from 'hooks/shuffled';
import { FC } from 'react';

interface IShuffleReveal {
  text: string,
  start: boolean,
  startDelay: number,
  speed: number,
  onComplete?: () => void
}

export const ShuffleReveal: FC<IShuffleReveal> = ({
  text,
  start,
  startDelay,
  speed,
  onComplete
}) => {
  const shuffleText = useShuffled({
    text: text,
    start: start,
    startDelay: startDelay,
    speed: speed,
    onComplete: onComplete
  })

  return (
    <>
      {
        shuffleText
      }
    </>
  );
}

export default ShuffleReveal;

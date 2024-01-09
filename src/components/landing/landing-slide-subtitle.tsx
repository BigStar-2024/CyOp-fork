import { useRef, FC } from 'react'
import { jpCharsArray } from 'mockup';
import { RandomReveal } from 'react-random-reveal';
import { useIntersection } from 'hooks/useIntersection';


interface ILandingSlideSubtitle {
  title: string
}

const LandingSlideSubtitle: FC<ILandingSlideSubtitle> = ({
  title
}) => {

  const titleRef = useRef<HTMLSpanElement>(null)

  const inViewport = useIntersection(titleRef);

  return (
    <span ref={titleRef} className="text-title">
      <span className="text-primary">{'//'} </span>
      <RandomReveal
        isPlaying={inViewport}
        updateInterval={0.1}
        duration={2}
        revealDuration={1}
        characterSet={jpCharsArray}
        ignoreCharacterSet={[' ']}
        characters={title}
      />
    </span>
  );
};

export default LandingSlideSubtitle

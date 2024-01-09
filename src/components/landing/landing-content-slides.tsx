import { useState, useEffect, useRef, FC } from 'react'
import SlideHow from './slides/slide-how'
import SlideIntro from './slides/slide-intro'
import SlideUNft from './slides/slide-unft'
import SlideMerch from './slides/slide-merch'
import SlideTokenomics from './slides/slide-tokenomics'
import SlideRoadMap from './slides/slide-roadmap'
import SlideMetaGrid from './slides/slide-metagrid'


interface ILandingContentSlides {
  setIsVid: (active: boolean) => void
  setSlide: (slide: number) => void
}

const LandingContentSlides: FC<ILandingContentSlides> = ({ setIsVid, setSlide }) => {
  const [lastPos, setLastPos] = useState(0);
  const [tsPos, setTSPos] = useState(null);
  const [tePos, setTEPos] = useState(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const progressCircleRef = useRef<HTMLDivElement | null>(null)

  const scrollHandle = () => {
    if (innerRef.current && progressCircleRef.current && progressBarRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = innerRef.current;

      setLastPos(scrollTop);

      let scrollPercent = scrollTop / (scrollHeight - clientHeight) * 100;
      progressBarRef.current.style.height = scrollPercent + '%'

      // progress circle hide

      if (scrollTop + clientHeight === scrollHeight || scrollTop <= 0) {
        progressCircleRef.current.style.display = 'none';
      } else {
        progressCircleRef.current.style.display = 'block';
      }

      // mouse direction change
      const wheelUpIcon = document.getElementById('wheel-up')
      const wheelDownIcon = document.getElementById('wheel-down')

      if (wheelUpIcon && wheelDownIcon) {
        if (scrollTop + clientHeight > scrollHeight - 100) {
          wheelUpIcon.style.display = 'block';
          wheelDownIcon.style.display = 'none';
        } else {
          wheelUpIcon.style.display = 'none';
          wheelDownIcon.style.display = 'block';
        }
      }
    }
  }

  const wheelHandle = (e: any) => {
    let y = e.deltaY;
    if (y < 0 && lastPos === 0)
      setIsVid(true);
  }

  const tsHandle = (e: any) => {
    setTEPos(null);
    setTSPos(e.targetTouches[0].clientY);
  }

  const tmHandle = (e: any) => {
    setTEPos(e.targetTouches[0].clientY);
  }

  const teHandle = (e: any) => {
    if (!tsPos || !tePos) return;

    if (tePos > tsPos + 50 && lastPos <= 0)
      setIsVid(true);
  }

  useEffect(() => {
    let height = window.screen.height;

    if (height < 420 && innerRef.current) {
      innerRef.current.style.marginTop = '110px'
      innerRef.current.style.height = 'calc(100vh - 220px)'
      // innerRef.current.style.marginTop = '110px';
    }
  }, []);

  return (
    <div className="container-fluid landing-content-txt text-left px-3" ref={innerRef} onScroll={scrollHandle} onWheel={(e) => wheelHandle(e)} onTouchStart={(e) => tsHandle(e)} onTouchMove={(e) => tmHandle(e)} onTouchEnd={(e) => teHandle(e)}>
      <div className="landing-slideUp">

        {/* INTRO */}
        <div className='row py-4'>
          <SlideIntro />
        </div>

        {/* ELI5 */}
        <div className='row py-4'>
          <SlideHow />
        </div>

        {/* METAGRID */}
        <div className='row py-4'>
          <SlideMetaGrid />
        </div>

        {/* uNFT */}

        <SlideUNft
          setSlide={setSlide}
        />


        {/* Merchandise */}
        <SlideMerch
          setSlide={setSlide}
        />

        {/* TOKENOMICS */}
        <div className='row py-4'>
          <SlideTokenomics />
        </div>

        {/* ROADMAP */}
        <div className='row py-5'>
          <SlideRoadMap />
        </div>

        <p className="text-primary">{'//'} to be continued</p>
      </div>

      <div className="progress-line d-flex flex-column align-items-center">
        <div ref={progressBarRef} className="progress-bar" id="progress-bar"></div>
        <div ref={progressCircleRef} className="progress-circle border border-primary" id="progress-circle"></div>
      </div>
    </div>
  );
};

export default LandingContentSlides;

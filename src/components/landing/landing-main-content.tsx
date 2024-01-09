import { VFC, useState } from "react";
import { Slide } from "react-awesome-reveal";
import CountingUp from "components/landing/countingup";
import { useNavigate } from "react-router-dom";
import landingVideo from "assets/video/cyopcompressed.mp4";
import { BsFillCaretRightFill } from "react-icons/bs";

interface ILandingTitleContent {
  setSlide: (slide: number) => void;
  setIsVid: (param: boolean) => void;
}

interface CustomWheelEvent extends WheelEvent {
  wheelDeltaY: number;
}

export const LandingMainContent: VFC<ILandingTitleContent> = ({ setSlide, setIsVid }) => {
  const [tsPos, setTSPos] = useState(null);
  const [tePos, setTEPos] = useState(null);

  const tsHandle = (e: any) => {
    setTEPos(null);
    setTSPos(e.targetTouches[0].clientY);
  };

  const tmHandle = (e: any) => {
    setTEPos(e.targetTouches[0].clientY);
  };

  const teHandle = (e: any) => {
    if (!tsPos || !tePos) return;

    if (tePos < tsPos - 50) setIsVid(false);
  };

  const scrollHandler = (event: any) => {
    const nativeEvent: CustomWheelEvent = event.nativeEvent;
    if (nativeEvent.wheelDeltaY < 0)
      setTimeout(() => {
        setIsVid(false);
      }, 400);
  };
  return (
    <div
      className="container-fluid h-100 d-flex flex-column justify-content-end align-items-start"
      onWheel={scrollHandler}
      onTouchMove={(e) => tmHandle(e)}
      onTouchEnd={(e) => teHandle(e)}
      onTouchStart={(e) => tsHandle(e)}
    >
      <Slide direction="up" triggerOnce>
        <div className="landing-title">
          <b>CyOp PROTOCOL</b>
        </div>
        <div className="pb-3" style={{ color: "white" }}>
          DISRUPTING THE WORLD OUT OF CYBERSPACE
        </div>
        <div className="fw-bold">
          <span className="text-primary">Total value processed </span>
          <span className="counting-num text-danger"> ${<CountingUp />} </span>
        </div>

        <div className="d-flex gap-3 py-3">
          <span className="landing-btn fw-bold p-1 px-2" onClick={() => setSlide(0)}>
            <BsFillCaretRightFill />
          </span>
          <a href="/#/wallet-connect" className="landing-btn p-1">
            <span>LAUNCH TERMINAL</span>
          </a>
        </div>
      </Slide>
      <div className="container-fluid" style={{ height: "20%" }} />
      <video
        className="full-screen-video landing-video"
        src={landingVideo}
        loop
        autoPlay
        muted
        playsInline
        controlsList="nodownload noplaybackrate"
      />
    </div>
  );
};

export default LandingMainContent;

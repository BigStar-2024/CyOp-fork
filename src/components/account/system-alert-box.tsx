import { FC, memo, useEffect } from "react";
import { useAudio } from "react-awesome-audio";
import { Fade } from "react-awesome-reveal";
const sndContent = require("assets/audio/alert.mp3").default;

interface ISystemAlert {
  type?: 'unft' | 'vote'
}

export const SystemAlertBox: FC<ISystemAlert> = ({ type }) => {
  const { play } = useAudio({
    src: sndContent,
    loop: false
  });

  useEffect(() => {
    const playSound = setInterval(() => {
      play()
    }, 2000)

    return () => clearInterval(playSound)
  }, [])

  return <>
    <div className="container d-flex justify-content-end">
      <span className="pointer"
        onClick={() => {}}
      >X</span>
    </div>
    <Fade>
      <h1 className='  mb-3 cyop-blink fw-bold'>System alert</h1>
    </Fade>
    {
      (type && type === 'vote') ? <>
        <p className='fw-bold m-0'>Whale detected</p>
        <span>1.34T CyOp</span>
        <p className='m-0'>Voted on: NTVRK</p>
      </> : <>
        <p className='fw-bold'>unft activated</p>
        <span>class:</span>
        <p >bladerunner</p>
        <span>power:</span>
        <p >cyberpsychosis</p>
        <p className='m-0'>targeted on: <span style={{ textDecoration: 'underline' }}>NTVRK</span></p>
      </>
    }
  </>
};

export default memo(SystemAlertBox);
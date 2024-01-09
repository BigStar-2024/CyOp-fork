import { useEffect, useState, memo } from 'react';
import { RandomReveal } from 'react-random-reveal';
import SystemAlertBox from './system-alert-box';
import { useAudio } from "react-awesome-audio";
import { Bounce } from 'react-awesome-reveal';
import { useParams } from 'react-router-dom';
const sndContent = require("assets/audio/type.mp3").default;

const random = [
  "010001000101110111110110001001111111010110110101110110101011",
  "011111010100011111110001110011110001000011110011011100000011",
  "110000100111111111001001100000011011111010011111100111011000",
  "101111000110110110101101010101010100101111110100111110011111",
  "110000101000001000101111110111111000101011011010000010100010",
  "100101111000100010101110011110101010111101100100000011110000",
  "001111011001110011011001001111111011101111011011001101000100",
  "100010100000011011001110000011111110011110010001011110010010",
  "100000001010011010110001100100010110111110111001110111100010",
  "100101110001110100100001011110011100111010010100101010101111",
  "110101001001110010101100001011001111001000110000001101010101",
  "101011110001101000010000000010100110110011111000111000010101",
  "110011111100001110011100100111000101001011011101111001000010",
  "100001101110100111011100101100001001110100010110001000011111",
  "011110011101101100100110011100010100111111101001100001111110",
  "000000101000001011011111000110001100011100110101001110011011",
  "110001000001001001111010001010110100100101001000001001000001",
  "111100100010101111100100000100101001100110010111011000000001",
  "001110101011000111100110000100111111011101110100010101111001",
  "011110010011000100000110110101000001110101111100110101011111"
]
export const FullScreenAlert = () => {
  const { type } = useParams<{ type: 'unft' | 'vote' }>()
  const [show, setShow] = useState(false)
  const { play, pause } = useAudio({
    src: sndContent,
    loop: true
  });
  useEffect(() => {
    let timerA: any

    const playSound = () => {
      play()
      timerA = setTimeout(() => {
        pause()
        setShow(true)
      }, 4000)
    }
    playSound()

    return () => {
      clearTimeout(timerA)
      pause()
    }
  }, [])

  return (
    <div className='co-alert-fullscreen d-flex justify-content-evenly flex-column position-relative' style={{ height: '100vh' }}>
      <div className='position-absolute top-0 start-0 bottom-0 end-0'>
        {
          show &&
          <div className='container-fluid h-100 '>
            <div className='row h-100 justify-content-center align-items-center'>
              <div className='col-10 col-md-8 col-lg-6 col-xl-4 col-xxl-3'>
                <Bounce triggerOnce>
                  <div
                    className='pt-2 pb-4 text-uppercase text-center d-flex flex-column align-items-center justify-content-center w-100'
                    style={{
                      border: 'solid 2px var(--bs-danger)',
                      backgroundColor: 'var(--bs-secondary)',
                      color: 'var(--bs-danger)',
                      minHeight: 250,
                    }}>
                    <SystemAlertBox type={type} />
                  </div>
                </Bounce>
              </div>
            </div>
          </div>
        }
      </div>
      {
        random.map((str, i) => (
          <div className="justify-content-around gap-1 overflow-hidden d-flex" key={i + 'row'}>
            {str.split("").map((char, j) => (
              <span
                key={j + 'col' + i}
                // className={`${Math.random() < 0.2 ? 'text-desc' : ''}`}
                className={`${(j + i) % 3 === 0 ? 'text-desc' : ''}`}
                style={{ width: '20px', display: 'flex', justifyContent: 'center' }}
              >
                <RandomReveal
                  isPlaying={true}
                  duration={(i + 1) * 0.3}
                  revealDuration={0}
                  characters={char}
                  characterSet={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
                  revealEasing='random'
                />
              </span>
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default memo(FullScreenAlert);
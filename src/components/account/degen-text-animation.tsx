import { useEffect, useState, memo } from 'react';
import { BigLetter } from 'mockup';
import { RandomReveal } from 'react-random-reveal';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateString(length: number) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


export const DegenTextAnimation = () => {

  const [randomStr, setRandomStr] = useState<Array<string>>([])

  useEffect(() => {
    const temp = []
    for (let i = 0; i < 8; i++) {
      temp.push(generateString(40))
    }
    setRandomStr(temp)
  }, [])

  return (
    <div className='container-fluid position-relative co-degen d-flex flex-column justify-content-center gap-1 px-0 position-relative'>
      {
        randomStr.length && randomStr.map((str, i) => (
          <div className="justify-content-around gap-1 overflow-hidden d-flex" key={i + 'row'}>
            {str.split("").map((char, j) => (
              <span
                className={`${(j + i) % 4 === 0 ? 'text-desc' : ''}`}
                key={j + 'col' + i}
                style={{ width: '10px', display: 'flex', justifyContent: 'center' }}>
                <RandomReveal
                  isPlaying={true}
                  duration={(i + 1) * 0.3}
                  revealDuration={0}
                  characters={char}
                  characterSet={BigLetter}
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

export default memo(DegenTextAnimation);
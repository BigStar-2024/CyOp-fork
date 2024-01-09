import { useState, useEffect } from 'react';

interface IIncrease {
  value: number,
  startDelay?: number,
  speed?: number,
  onComplete?: () => void,
  condition?: Array<any>
}

export default function useIncrease({value, condition = [], startDelay = 0, speed = 30, onComplete} : IIncrease) {
  const [currentValue, setCurrentValue] = useState(0)
  let timer : NodeJS.Timeout

  const increase = (curValue : number) => {
    timer = setTimeout(() => {
        if (curValue >= Math.floor(value)) {
          if(onComplete)
            onComplete()
        } else {
          setCurrentValue( curValue + 1 )
			    increase( curValue + 1 );
        }
    }, speed)
  }
  
  const decrease = (curValue : number) => {
    timer = setTimeout(() => {
        if (curValue <= Math.floor(value)) {
          if(onComplete)
            onComplete()
        } else {
          setCurrentValue( curValue - 1 )
			    decrease( curValue - 1 );
        }
    }, speed)
  }

  useEffect(() => {
    if(condition.length > 0 && condition[0] === undefined) return;
    
    if(startDelay > 0) {
      // eslint-disable-next-line
      timer = setTimeout(() => {
        if(currentValue < value)
          increase(currentValue)
        else
          decrease(currentValue)
      }, startDelay)
    } else {
      if(currentValue < value)
        increase(currentValue)
      else
        decrease(currentValue)
    }
    // Remove event listeners on cleanup
    return () => {
      clearTimeout( timer )
    };
  }, condition); // Empty array ensures that effect is only run on mount and unmount

  return currentValue;
}
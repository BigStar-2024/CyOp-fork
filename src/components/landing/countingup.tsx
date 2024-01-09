import { memo } from "react";
import CountUp from 'react-countup';

export const CountingUp = () => {

  return (
    <CountUp
      start={0}
      end={1957409}
      duration={5}
      useEasing={true}
      separator=","
      decimal=","
    />
  )
}

export default memo(CountingUp);

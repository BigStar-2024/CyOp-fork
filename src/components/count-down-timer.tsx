import { useCountdown } from 'hooks/useCountDown';
import  { FC } from 'react';

const ExpiredNotice = () => {
  return (
    <span>Time expired</span>
  );
};

interface IShowCounter {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const ShowCounter: FC<IShowCounter> = ({ days, hours, minutes, seconds }) => {
  return (
    <div className='d-flex'>
      [
      {
        days > 0 &&
        <span>{days < 10 ? '0' + days : days}:</span>
      }
      <span>{hours < 10 ? '0' + hours : hours}:</span>
      <span>{minutes < 10 ? '0' + minutes : minutes}:</span>
      <span>{seconds < 10 ? '0' + seconds : seconds}</span>
      ]
    </div>
  );
};

interface ICountDownTimer {
  targetDate: number // use epoch timestamp
}

export const CountdownTimer: FC<ICountDownTimer> = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;

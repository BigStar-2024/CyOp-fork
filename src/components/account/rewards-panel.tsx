import { useEffect } from 'react';
import { useAudio } from 'react-awesome-audio';
import { formatUnits } from 'helpers/utils';
const sndContent = require('assets/audio/content.mp3').default;


const MOCK_REWARDS = [
  {
    id: '1',
    value: 372
  },
  {
    id: '2',
    value: 132
  },
  {
    id: '3',
    value: 57
  },
  {
    id: '4',
    value: 83
  },
  {
    id: '5',
    value: 20
  },
]

const MOCK_ALLTIME_REWARD = 50000

export const AccountRewards = () => {
  const { play } = useAudio({
    src: sndContent,
  });

  useEffect(() => {
    // play()
    // eslint-disable-next-line
  },[])
  return (
    <div className="flex-1 mb-1">

      <div>All time rewards:</div>

      <div className="text-desc">{formatUnits(MOCK_ALLTIME_REWARD, 0)} usdc [&#8709;650]</div>
      <div className="pt-3">Last rewards:</div>

      <div className='not-first-child-p-array'>
        {
          MOCK_REWARDS.map((reward) => (
            <p className="p-0 m-0" key={reward.id}>
              - earned {reward.value} usdc
            </p>
          ))
        }
      </div>
    </div>
  );
};

export default AccountRewards;

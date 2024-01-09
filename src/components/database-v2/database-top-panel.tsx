import { FC } from 'react';
import { AttentionSeeker, Fade } from 'react-awesome-reveal';

interface IDatabaseV2TopPanel {
  name: any
  cycle: number
}

export const DatabaseV2TopPanel: FC<IDatabaseV2TopPanel> = ({
  name,
  cycle,
}) => {

  return (
    <div className='d-flex flex-column px-0 cyop-border-top'>
      <AttentionSeeker effect='headShake' triggerOnce>
        <p className='text-center align-middle m-2 pt-1 fw-bold'>{name}</p>
      </AttentionSeeker>

      <Fade>
        <div className="cyop-text-hr cyop-text-hr--center">
          <span className="text-hr__text">{`CYCLE ${cycle} `}</span>
        </div>
      </Fade>
    </div>
  );
};

export default DatabaseV2TopPanel;
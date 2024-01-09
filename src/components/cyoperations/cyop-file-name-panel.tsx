import { FC } from 'react';
import { Fade } from 'react-awesome-reveal';

interface ICyOpFileNamePanel {
  name: any
  percent: string
}

export const CyOpFileNamePanel: FC<ICyOpFileNamePanel> = ({
  name,
  percent,
}) => {

  return (
    <div className='d-flex flex-column px-0'>
      <p className='text-end align-middle m-2' style={{ paddingRight: '2rem' }}>{name}</p>
      <Fade triggerOnce>
        <div className="cyop-text-hr cyop-text-hr--center">
          <span className="text-hr__text">{`[ ${percent}% ]`}</span>
        </div>
      </Fade>
    </div>
  );
};

export default CyOpFileNamePanel;
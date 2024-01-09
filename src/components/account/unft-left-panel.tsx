import { Slide } from 'react-awesome-reveal';
import { BigNumber } from 'ethers';


export const AccountUNftLeftPanel = ({ uNFTBalance }: { uNFTBalance: BigNumber }) => {

  return (
    <>
      <div className='cyop-border-right h-100'>
        <Slide
          cascade
          triggerOnce
          duration={200}
          >
          <div className="pt-3">uNFT balance:</div>
          <p className="text-desc">{uNFTBalance.toString()}</p>

          <span>available in cycle:</span>
          <p className="text-desc ">{8}</p>

          <span>activated in cycle:</span>
          <p className="text-desc ">{3}</p>

          <span>Your powers:</span>
          <span className="text-desc ">{'Rude Awakening'}</span>
          <span className="text-desc ">{'Gut-Puncher'}</span>
          <p className="text-desc ">{'Sneak Thief'}</p>
        </Slide>

      </div>
    </>
  );
};

export default AccountUNftLeftPanel;

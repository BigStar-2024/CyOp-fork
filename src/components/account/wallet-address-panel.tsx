import { BigNumber } from 'ethers';
import { formatUnits, simplifiedWalletAddress, intToString } from 'helpers/utils';
import { FC } from 'react';
import { Fade } from 'react-awesome-reveal';
import { decimals } from 'shared/constants';

interface IWalletAddressPanel {
  address: any
  cyop: BigNumber | number
  unft: number
}

export const WalletAddressPanel: FC<IWalletAddressPanel> = ({
  address,
  cyop,
  unft
}) => {

  return (
    <div className='co-top-panel cyop-border-top'>
      <Fade triggerOnce>
        <p className='text-end align-middle m-2' style={{ paddingRight: '2rem' }}>{simplifiedWalletAddress(address)}</p>
      </Fade>
      <Fade triggerOnce>
        <div className="cyop-text-hr cyop-text-hr--center">
          <span className="text-hr__text">{`[ ${intToString(parseFloat(formatUnits(cyop, decimals.CyOp, false)))} CyOp ∣ ${unft} uNFT ]`}</span>
        </div>
      </Fade>
    </div>
  );
};

export default WalletAddressPanel;

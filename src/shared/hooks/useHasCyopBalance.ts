import { useEffect, useState } from 'react';
import useContracts from './useContracts';
import addresses from '../addresses';

function useHasCyopBalance(walletAddress: string, chainId: string): boolean {
  const { balanceOf, stakeAmount } = useContracts();
  const [hasCyopBalance, setHasCyopBalance] = useState<boolean>(false);
  const layer = chainId === addresses.arbitrumNetworkID ? 'L2' : 'L1';

  useEffect(() => {
    (async () => {
      if (stakeAmount) {
        try {
          // first check cyop
          const cyopBalance = await balanceOf!(layer);
          if (cyopBalance && cyopBalance.gt(0)) {
            setHasCyopBalance(true);
          } else {
            const stakedAmount = await stakeAmount(walletAddress, layer);
            if (stakedAmount && stakedAmount.gt(0)) {
              setHasCyopBalance(true);
            }
          }
        } catch (e) {
          //TODO: handle error
          console.log(e);
          setHasCyopBalance(false);
        }
      }
    })();
  }, [walletAddress, layer, balanceOf, stakeAmount]);

  return hasCyopBalance;
}

export default useHasCyopBalance;

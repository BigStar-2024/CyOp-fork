import { formatUnits } from "helpers/utils";
import { Slide } from "react-awesome-reveal";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { getParticipation, getVotes } from "shared/backend";
import { useContracts, useWeb3 } from "shared/hooks";
import { IUserVote } from "shared/interfaces";
import { decimals } from "shared/constants";

export const AccountStakeLeftPanel = ({ cyopBalance }: { cyopBalance: BigNumber }) => {
  const { walletAddress } = useWeb3();
  const { currentCycle } = useContracts();
  const [availableCyOp, setAvailableCyOp] = useState(BigNumber.from(0));
  const [usedCyOp, setUsedCyOp] = useState(BigNumber.from(0));
  const [bonusCyOpPercent, setBonusCyOpPercent] = useState(0);

  useEffect(() => {
    if (!walletAddress || !currentCycle) return;

    const fetchData = async () => {
      let totalUsed = BigNumber.from(0);

      let result = await getVotes({
        walletAddress: walletAddress,
        cycleIndex: currentCycle.toString()
      });

      if (result && result.status === 200 && result.data) {
        const data: IUserVote[] = result.data;
        totalUsed = data.reduce((a, b) => a.add(BigNumber.from(b.balanceUsed)), BigNumber.from(0));
        setUsedCyOp(totalUsed);
      }

      result = await getParticipation(walletAddress, currentCycle.toString());

      if (result && result.status === 200 && result.data) {
        setAvailableCyOp(BigNumber.from(result.data.startCyopBalance).add(result.data.bonusCyop).sub(totalUsed));
        setBonusCyOpPercent(result.data.bonusCyopPercent);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cyop-border-right h-100">
      <Slide cascade triggerOnce duration={200}>
        <div className="pt-2">$CyOp balance:</div>
        <p className="text-desc ">{formatUnits(cyopBalance, decimals.CyOp)}</p>

        <div className="pt-2">available in cycle:</div>
        <p className="text-desc ">
          [<span className="text-danger">+{bonusCyOpPercent}%</span> Rank Bonus]
        </p>
        <p className="text-desc ">{formatUnits(availableCyOp, decimals.CyOp)}</p>

        <div className="pt-2">voted in cycle:</div>
        <p className="text-desc ">{formatUnits(usedCyOp, decimals.CyOp)}</p>
      </Slide>
    </div>
  );
};

export default AccountStakeLeftPanel;

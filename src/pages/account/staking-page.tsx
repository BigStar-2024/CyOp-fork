import { useEffect, useState } from "react";
import { useAudio } from "react-awesome-audio";
import { useContracts, useWeb3 } from "shared/hooks";
import { formatUnits } from "helpers/utils";
import { BigNumber } from "ethers";
import { toast } from "react-toastify";
import AccountStakeLeftPanel from "components/account/stake-left-panel";
import { Fade } from "react-awesome-reveal";
import { getUserRewards, getTotalAmount, getTicket } from "shared/backend";
import { IReward } from "../../shared/interfaces";
import AccountClaimPanel from "components/account/account-claim-panel";
import { decimals } from "shared/constants";
const sndContent = require("assets/audio/interface.mp3").default;

export const AccountStakingPage = ({
  cyopBalance,
  uNFTBalance,
  setPath
}: {
  cyopBalance: BigNumber;
  uNFTBalance: BigNumber;
  setPath: any;
}) => {
  const { signMessage } = useWeb3();
  const { getStakersTotalReward, claimReward } = useContracts();
  const [rewards, setRewards] = useState<IReward[] | null>(null);
  const [lastRewards, setLastRewards] = useState<BigNumber[]>([]);
  const [totalReward, setTotalReward] = useState(BigNumber.from(0));
  const [totalClaimed, setTotalClaimed] = useState(BigNumber.from(0));
  const [claimedRewards, setClaimedRewards] = useState<IReward[]>([]);
  const [totalUnclaimed, setTotalUnclaimed] = useState(BigNumber.from(0));
  const [unclaimedRewards, setUnclaimedRewards] = useState<IReward[]>([]);
  const [rewardsReady, setRewardsReady] = useState(false);
  const { play, pause } = useAudio({
    src: sndContent,
    loop: true
  });

  const { walletAddress } = useWeb3();

  const claim = async () => {
    try {
      if (!signMessage) return;
      const signature = await signMessage({ action: "claim rewards" });
      if (!signature) return;
      const res = await getTicket(signature, 0);
      if (res && res.data && claimReward) {
        await claimReward(res.data.data, res.data.encodedData, res.data.signature.sig);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      getRewards();
    }
  };

  const getRewards = async () => {
    if (!walletAddress) return;
    const result = await getUserRewards(walletAddress);

    if (result && result.status === 200 && result.data) {
      const data: IReward[] = result.data;
      setRewards(data.filter((x) => x.rewardType === 0));
    }
  };

  useEffect(() => {
    let timerA: any;

    const showDegenAnimation = () => {
      play();
      timerA = setTimeout(() => {
        pause();
      }, 1000);
    };
    showDegenAnimation();
    getRewards();

    if (setPath) {
      setPath("/cyop");
    }

    return () => {
      clearTimeout(timerA);
      pause();
    };
  }, []);

  useEffect(() => {
    const calculateRewards = async () => {
      if (rewards === null) return;
      if (!getStakersTotalReward) return;
      let stakersTotalRewardAmount: { [id: string]: BigNumber } = {};
      let totalCyOpAmounts: { [id: number]: BigNumber } = {};
      for (let reward of rewards) {
        if (reward.cycleIndex in stakersTotalRewardAmount) continue;
        stakersTotalRewardAmount[reward.cycleIndex] = await getStakersTotalReward(0, reward.cycleIndex);
        if (!(reward.cycleIndex in totalCyOpAmounts)) {
          let res = await getTotalAmount(reward.cycleIndex);
          let totalCyOp = BigNumber.from(0);
          if (res && res.data) {
            totalCyOp = BigNumber.from(res.data.totalCyOpAmount);
          }
          totalCyOpAmounts[reward.cycleIndex] = totalCyOp;
        }
      }
      const claimed = rewards.filter((x) => x.isClaimed);
      const unclaimed = rewards.filter((x) => !x.isClaimed);
      const claimedAmount = claimed.reduce(
        (a, b) =>
          a.add(
            BigNumber.from(b.startCyOpAmount)
              .mul(stakersTotalRewardAmount[b.cycleIndex])
              .div(totalCyOpAmounts[b.cycleIndex])
          ),
        BigNumber.from(0)
      );
      const unclaimedAmount = unclaimed.reduce(
        (a, b) =>
          a.add(
            BigNumber.from(b.startCyOpAmount)
              .mul(stakersTotalRewardAmount[b.cycleIndex])
              .div(totalCyOpAmounts[b.cycleIndex])
          ),
        BigNumber.from(0)
      );
      setClaimedRewards(claimed);
      setUnclaimedRewards(unclaimed);
      setTotalClaimed(claimedAmount);
      setTotalUnclaimed(unclaimedAmount);
      setLastRewards(
        rewards
          .sort((a, b) => b.cycleIndex - a.cycleIndex)
          .map((reward) =>
            BigNumber.from(reward.startCyOpAmount)
              .mul(stakersTotalRewardAmount[reward.cycleIndex])
              .div(totalCyOpAmounts[reward.cycleIndex])
          )
      );
      setTotalReward(claimedAmount.add(unclaimedAmount));
      setRewardsReady(true);
    };

    if (rewards !== null) {
        calculateRewards();
    }
  }, [rewards]);

  return (
    <div className="d-flex overflow-auto flex-column h-100">
      <AccountClaimPanel
        claim={() => claim()}
        rewards={unclaimedRewards}
        rewardsReady={rewardsReady}
        totalReward={totalUnclaimed}
      />
      <div className="container-fluid h-100">
        <div className="row gy-1 h-100">
          <div className="col-lg-4 col-md-12 ">
            <AccountStakeLeftPanel cyopBalance={cyopBalance} />
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="cyop-border-top-down-lg mb-2"></div>
            <div className="d-flex flex-column justify-content-between">
              <div>
                <Fade cascade duration={400}>
                  <div className="pt-2">All time rewards:</div>
                  <div className="text-desc">{formatUnits(totalReward, decimals.USDC)} usdc</div>
                  <div className="pt-2">Last rewards:</div>
                  <div className="not-first-child-p-array">
                    {lastRewards.map((reward, index) => (
                      <p className="p-0 m-0" key={index}>
                        - earned {formatUnits(reward, decimals.USDC)} usdc
                      </p>
                    ))}
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStakingPage;

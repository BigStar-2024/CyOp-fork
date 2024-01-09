import ProgressBarStatus from "components/progressbar-status";
import ProgressBarProtocol from "components/progressbar-protocol";
import CountdownTimer from "components/count-down-timer";
import { useEffect, useState } from "react";
import useContracts from "shared/hooks/useContracts";
import { BigNumber, ethers } from "ethers";
import addresses from "shared/addresses";
import { decimals } from "shared/constants";

export const AccountStatusPanel = () => {
  const {
    currentCycle,
    currentCycleDetails,
    previousCycleDetails,
    currentCyclePeriod,
    balanceOfWallet,
    balanceOfErc20,
    UniswapRouter,
    getDistributorKeptAmount
  } = useContracts();
  const [cycleEndTime, setCycleEndTime] = useState<number>(0);
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [protocolFund, setProtocolFund] = useState(BigNumber.from(0));
  const [rewardFund, setRewardFund] = useState(0);
  const [firstPrize, setFirstPrize] = useState(BigNumber.from(0));
  const [secondPrize, setSecondPrize] = useState(BigNumber.from(0));
  const [thirdPrize, setThirdPrize] = useState(BigNumber.from(0));
  const [burnAmount, setBurnAmount] = useState(BigNumber.from(0));

  const provider = new ethers.providers.JsonRpcProvider(addresses.rpcURL);

  useEffect(() => {
    if (!balanceOfWallet || !UniswapRouter) return;

    const processData = async () => {
      if (!balanceOfErc20 || !getDistributorKeptAmount || !currentCycle) return;
      try {
        // TODO: Add shares for treasury amount.
        const currentTreasuryAmount = await balanceOfWallet(addresses.CyOp); // In CyOp
        const currentCycleAmount = await provider.getBalance(addresses.Distributor); // In ETH
        const currentTreasuryEth = await provider.getBalance(addresses.CyOp); // In ETH
        const currentEscrowEth = await provider.getBalance(addresses.Escrow); // In ETH
        if (!currentTreasuryAmount || !currentCycleAmount || !currentTreasuryEth) return;
        let path = [addresses.CyOp, addresses.WETH];
        const currentTreasuryAmountETH = (
          await UniswapRouter.getAmountsOut(currentTreasuryAmount?.toString(), path)
        )[1];
        const totalETHAmount = currentCycleAmount
          .add(currentTreasuryAmountETH)
          .add(currentTreasuryEth)
          .add(currentEscrowEth);
        path = [addresses.WETH, addresses.USDC];
        let currentDistributorUSDC = await getDistributorKeptAmount(currentCycle.sub(1).toString());
        const totalUSDCAmount = BigNumber.from(
          (await UniswapRouter.getAmountsOut(totalETHAmount?.toString(), path))[1]
        ).add(currentDistributorUSDC);
        let vaultBalance: string | number | null = await balanceOfErc20(
          addresses.USDC,
          addresses.Vault,
          "L1",
          true,
          decimals.USDC
        );
        vaultBalance = vaultBalance ? parseInt(vaultBalance, 10) : 0;
        let rewardsAmount: string | number | null = Math.round(vaultBalance);
        setProtocolFund(totalUSDCAmount);
        setFirstPrize(totalUSDCAmount.mul(25).div(100));
        setSecondPrize(totalUSDCAmount.mul(15).div(100));
        setThirdPrize(totalUSDCAmount.mul(10).div(100));
        setBurnAmount(totalUSDCAmount.mul(125).div(1000));
        setRewardFund(
          parseInt(ethers.utils.formatUnits(totalUSDCAmount.mul(25).div(100), decimals.USDC), 10) + rewardsAmount
        );
      } catch (e) {
        console.log(e);
      }
    };

    processData();
  }, [balanceOfErc20, currentCycle, getDistributorKeptAmount]);

  useEffect(() => {
    if (currentCycleDetails == null) return;
    const endTime = currentCycleDetails.endTime;
    setCycleEndTime(endTime.mul(1000).toNumber());
  }, [currentCycleDetails]);

  useEffect(() => {
    let period = currentCyclePeriod ? currentCyclePeriod : 60 * 60 * 24 * 7;
    if (currentCycleDetails == null) return;
    if (previousCycleDetails != null) {
      period = BigNumber.from(currentCycleDetails.endTime).sub(previousCycleDetails.endTime).toNumber();
    }
    const progress = BigNumber.from(Math.round(Date.now() / 1000))
      .sub(BigNumber.from(currentCycleDetails.endTime).sub(BigNumber.from(period)))
      .mul(100)
      .div(period)
      .toNumber();
    setCycleProgress(progress > 0 ? progress : 1);
  }, [currentCycleDetails, previousCycleDetails, currentCyclePeriod]);

  return (
    <div className="co-status-panel container-fluid px-1 cyop-border-bottom-xl-up">
      <div className="cyop-border-top-down-xl mb-2"></div>
      <div className="row gx-0">
        <div className="col-sm-9 col-xs-12 mb-1">
          <div className="px-2">
            <div className="row w-100 mx-0 d-flex align-items-center mb-2">
              <div className="col px-0  ">Protocol fund</div>
              <div className="col px-0">
                <ProgressBarStatus
                  total={Math.round(parseInt(ethers.utils.formatUnits(protocolFund, decimals.USDC), 10))}
                  value={Math.round(parseInt(ethers.utils.formatUnits(protocolFund, decimals.USDC), 10))}
                  unit="$"
                  visible={false}
                />
              </div>
            </div>
            <div className="row w-100 mx-0 d-flex align-items-center">
              <div className="col px-0">First place</div>
              <div className="col px-0">
                <ProgressBarStatus
                  total={Math.round(parseInt(ethers.utils.formatUnits(protocolFund, decimals.USDC), 10))}
                  value={Math.round(parseInt(ethers.utils.formatUnits(firstPrize, decimals.USDC), 10))}
                  unit="$"
                />
              </div>
            </div>

            <div className="row w-100 mx-0 d-flex align-items-center">
              <div className="col px-0">Second place</div>
              <div className="col px-0">
                <ProgressBarStatus
                  total={Math.round(parseInt(ethers.utils.formatUnits(protocolFund, decimals.USDC), 10))}
                  value={Math.round(parseInt(ethers.utils.formatUnits(secondPrize, decimals.USDC), 10))}
                  unit="$"
                />
              </div>
            </div>

            <div className="row w-100 mx-0 d-flex align-items-center">
              <div className="col px-0">Third place</div>
              <div className="col px-0">
                <ProgressBarStatus
                  total={Math.round(parseInt(ethers.utils.formatUnits(protocolFund, decimals.USDC), 10))}
                  value={Math.round(parseInt(ethers.utils.formatUnits(thirdPrize, decimals.USDC), 10))}
                  unit="$"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-xs-12">
          <div className="mb-1 px-2">
            <div className="row">
              <div className="col-6 col-sm-12 ">
                <p className="mb-0">Rewards:</p>
                <p className="text-desc">${rewardFund}</p>
              </div>

              <div className="col-6 col-sm-12  status-burn">
                <p className="mb-0">Burn:</p>
                <p className="text-desc">
                  ${Math.round(parseInt(ethers.utils.formatUnits(burnAmount, decimals.USDC), 10))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="section-protocol-progress">
          <div className="protocol-progress-label px-2 d-flex justify-content-between align-items-center">
            Cycle progress
            <CountdownTimer targetDate={cycleEndTime} />
          </div>
          <ProgressBarProtocol progress={cycleProgress} />
        </div>
      </div>
    </div>
  );
};

export default AccountStatusPanel;

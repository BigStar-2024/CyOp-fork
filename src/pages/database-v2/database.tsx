import { useState, useEffect, useRef } from "react";
import useTyped from "hooks/typed";
import { simplifiedWalletAddress } from "helpers/utils";
import { useContracts, useWeb3 } from "shared/hooks";
import DatabaseV2TopPanel from "components/database-v2/database-top-panel";
import DatabaseStatusPanel from "components/database-v2/database-status-panel";
import { EvmChain } from "@moralisweb3/evm-utils";
import DatabaseCommandPanel from "components/database-v2/database-command-panel";
import { CommandInputV2 } from "components/database-v2/command-input-v2";
import { AttentionSeeker, Fade } from "react-awesome-reveal";
import addresses from "../../shared/addresses";
import { ethers } from "ethers";
import { decimals, cyop } from "../../shared/constants";
import {
  getCyOpPriceInUsd,
  getWalletTokens,
  getTokenPriceInUsd,
  getCyOpEthReserves,
  getTotalRewards,
  getTotalUnftRewards,
  getTotalBurned,
  getTotalCyOpProcessed
} from "../../shared/data";
import { formatUnits } from "ethers/lib/utils";
import { getAllWinningCyOps, getCyOps } from "shared/backend";

export const DatabasePageV2 = (props: any) => {
  const { walletAddress } = useWeb3();
  const { currentCycle, balanceOfErc20 } = useContracts();
  const containerRef = useRef<any>(null);

  const [greetingVisible, setGreetingVisible] = useState(true);
  const [startGreeting, setStartGreeting] = useState(false);
  const [loadingCommand, setLoadingCommand] = useState(false);
  const [rechargeFundAmount, setRechargeFundAmount] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);
  const [burntSupplyInUsd, setBurntSupplyInUsd] = useState(0);
  const [burntPercent, setBurntPercent] = useState(0);
  const [rewardFundAmount, setRewardFundAmount] = useState(0);
  const [distributorAmount, setDistributorAmount] = useState(0);
  const [holdingTokens, setHoldingTokens] = useState<any>();
  const [cyops, setCyOps] = useState<Array<any>>([]);
  const [individualCyOps, setIndividualCyOps] = useState<Array<any>>([]);
  const [corporateCyOps, setCorporateCyOps] = useState<Array<any>>([]);
  const [cryptosphereCyOps, setCryptosphereCyOps] = useState<Array<any>>([]);
  const [winningCyOps, setWinningCyOps] = useState<Array<any>>([]);
  const [individualWinningCyOps, setIndividualWinningCyOps] = useState<Array<any>>([]);
  const [corporateWinningCyOps, setCorporateWinningCyOps] = useState<Array<any>>([]);
  const [cryptosphereWinningCyOps, setCryptosphereWinningCyOps] = useState<Array<any>>([]);
  const [holdingTokensTotal, setHoldingTokensTotal] = useState(0);
  const [cyopEthLiquidity, setCyOpEthLiquidity] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [totalUnftRewards, setTotalUnftRewards] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);
  const [totalCyOpProcessed, setTotalCyOpProcessed] = useState(0);

  const [scanningText] = useTyped({
    text: "scanning...",
    start: loadingCommand,
    noSound: false,
    speed: 30
  });

  const [greetingText, greetingTextCompleted] = useTyped({
    text: "Access database",
    start: startGreeting,
    noSound: false,
    speed: 30
  });

  const [accountText, accounTextCompleted] = useTyped({
    text: "User " + simplifiedWalletAddress(walletAddress),
    start: greetingTextCompleted,
    noSound: false,
    speed: 30
  });

  const [commandVisible, setCommandVisible] = useState(false);

  const [inputCommand, setInputCommand] = useState();
  const [documentNumber, setDocumentNumber] = useState("");

  useEffect(() => {
    if ("setPath" in props && props.setPath) {
      props.setPath("/database");
    }

    const getCyoperations = async () => {
      let result = await getCyOps();

      if (result && result.status === 200 && result.data) {
        const data: Array<any> = result.data;
        setCyOps(data);
        let indCyOps = [];
        let corpCyOps = [];
        let crypCyOps = [];

        for (const cyop of data) {
          if (cyop.type === "individual") {
            indCyOps.push(cyop);
          } else if (cyop.type === "corporate") {
            corpCyOps.push(cyop);
          } else if (cyop.type === "cryptosphere") {
            crypCyOps.push(cyop);
          }
        }

        setIndividualCyOps(indCyOps);
        setCorporateCyOps(corpCyOps);
        setCryptosphereCyOps(crypCyOps);
      }

      result = await getAllWinningCyOps();

      if (result && result.status === 200 && result.data) {
        const data: Array<any> = result.data;
        setWinningCyOps(data);
        let indCyOps = [];
        let corpCyOps = [];
        let crypCyOps = [];

        for (const cyop of data) {
          if (cyop.type === "individual") {
            indCyOps.push(cyop);
          } else if (cyop.type === "corporate") {
            corpCyOps.push(cyop);
          } else if (cyop.type === "cryptosphere") {
            crypCyOps.push(cyop);
          }
        }

        setIndividualWinningCyOps(indCyOps);
        setCorporateWinningCyOps(corpCyOps);
        setCryptosphereWinningCyOps(crypCyOps);
      }
    };

    getCyoperations();
  }, []);

  useEffect(() => {
    const setBalances = async () => {
      if (!balanceOfErc20) return;
      const rechargeBalance = await balanceOfErc20(addresses.USDC, addresses.rechargeFund, "L1", true, decimals.USDC);
      setRechargeFundAmount(rechargeBalance ? parseInt(rechargeBalance) : 0);

      let zeroAddressAmount: string | number | null = await balanceOfErc20(
        addresses.CyOp,
        ethers.constants.AddressZero,
        "L1",
        true,
        decimals.CyOp
      );
      let voidAmount: string | number | null = await balanceOfErc20(
        addresses.CyOp,
        addresses.void,
        "L1",
        true,
        decimals.CyOp
      );
      let rewardsAmount: string | number | null = await balanceOfErc20(
        addresses.USDC,
        addresses.Vault,
        "L1",
        true,
        decimals.USDC
      );
      let distributorAmount: string | number | null = await balanceOfErc20(
        addresses.USDC,
        addresses.Distributor,
        "L1",
        true,
        decimals.USDC
      );
      if (!zeroAddressAmount || !voidAmount) {
        setCirculatingSupply(0);
      } else {
        zeroAddressAmount = parseInt(zeroAddressAmount, 10);
        voidAmount = parseInt(voidAmount, 10);
        const totalSupply = parseInt(ethers.utils.formatUnits(cyop.totalSupply, decimals.CyOp), 10);
        setCirculatingSupply(totalSupply - voidAmount - zeroAddressAmount);
        const totalBurnt = voidAmount + zeroAddressAmount;
        setBurntPercent(Math.round((totalBurnt * 100) / totalSupply));
        const cyopUsdRate = await getCyOpPriceInUsd();
        if (!cyopUsdRate) return;
        const totalBurntInUsd = Math.round(totalBurnt * cyopUsdRate);
        setBurntSupplyInUsd(totalBurntInUsd);
      }
      if (!rewardsAmount) {
        setRewardFundAmount(0);
      } else {
        setRewardFundAmount(parseInt(rewardsAmount, 10));
      }
      if (!distributorAmount) {
        setDistributorAmount(0);
      } else {
        setDistributorAmount(parseInt(distributorAmount, 10));
      }
    };
    setBalances();
  }, [balanceOfErc20]);

  useEffect(() => {
    const fetchHoldingTokens = async () => {
      // TODO: Change GOERLI to ETHEREUM.
      const tokens: Array<any> = await getWalletTokens(addresses.Holding, EvmChain.GOERLI);
      for (const token of tokens) {
        token.priceInUsd = await getTokenPriceInUsd(token.token_address, EvmChain.GOERLI);
        token.balanceInUsd = parseInt(formatUnits(token.balance, token.decimals)) * token.priceInUsd;
      }
      setHoldingTokens(tokens);
    };

    const fetchLiquidity = async () => {
      const cyopUsdRate = await getTokenPriceInUsd("0xddaC9C604BA6Bc4ACEc0FBB485B83f390ECF2f31", EvmChain.ETHEREUM);
      const ethUsdRate = await getTokenPriceInUsd("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", EvmChain.ETHEREUM);
      const { cyopReserves, ethReserves } = await getCyOpEthReserves();
      const total =
        parseInt(formatUnits(cyopReserves, decimals.CyOp), 10) * cyopUsdRate +
        parseInt(formatUnits(ethReserves, 18), 10) * ethUsdRate;
      setCyOpEthLiquidity(total);
    };

    const fetchDistributorFunds = async () => {
      setTotalRewards(parseInt(formatUnits(await getTotalRewards(), decimals.USDC), 10));
      setTotalUnftRewards(parseInt(formatUnits(await getTotalUnftRewards(), decimals.USDC), 10));
      setTotalBurned(parseInt(formatUnits(await getTotalBurned(), decimals.USDC), 10));
    };

    fetchHoldingTokens();
    fetchLiquidity();
    fetchDistributorFunds();
  }, []);

  useEffect(() => {
    const fetchTotalCyOpProcessed = async () => {
      const cyopProcessed = (await getTotalCyOpProcessed()) + burntSupplyInUsd;
      setTotalCyOpProcessed(cyopProcessed);
    };

    fetchTotalCyOpProcessed();
  }, [burntSupplyInUsd]);

  useEffect(() => {
    if (!holdingTokens) return;
    setHoldingTokensTotal(holdingTokens.reduce((a: any, b: any) => a + b.balanceInUsd, 0));
  }, [holdingTokens]);

  useEffect(() => {
    if (walletAddress) setStartGreeting(true);
  }, [walletAddress]);

  useEffect(() => {
    if (greetingTextCompleted && !commandVisible) {
      const timer = setTimeout(() => {
        setCommandVisible(true);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [greetingTextCompleted, commandVisible]); // eslint-disable-line

  useEffect(() => {
    // hide greeting text 1s after greeting message is fully displayed
    if (!accounTextCompleted) return;

    const timer = setTimeout(() => {
      setGreetingVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [accounTextCompleted]);

  return (
    <div className="co-left-panel disable-select" ref={containerRef}>
      {greetingVisible ? (
        <>
          <span className="mb-1">{greetingText}</span>
          {greetingTextCompleted && (
            <span>
              <br />
              {accountText}
            </span>
          )}
          {!accounTextCompleted && <span className="typed-cursor danger">|</span>}
        </>
      ) : (
        <>
          <DatabaseV2TopPanel name="CYOP CORP" cycle={currentCycle ? currentCycle.toNumber() : 0} />
          <DatabaseStatusPanel
            totalValue={totalCyOpProcessed}
            reserveFund={rechargeFundAmount}
            rewardFundAmount={rewardFundAmount}
            holding={rechargeFundAmount}
            burntPercent={burntPercent}
            burntSupplyInUsd={burntSupplyInUsd}
            holdingTokens={holdingTokens}
          />
          <div className="px-2 cyop-border-top border-width-1 cyop-border-bottom me-md-4 me-sm-0 cyop-sticky">
            <CommandInputV2
              setInputCommand={setInputCommand}
              setLoadingCommand={setLoadingCommand}
              setDocumentNumber={setDocumentNumber}
              values={{
                recharge: rechargeFundAmount,
                circulatingSupply: circulatingSupply,
                burntPercent: burntPercent,
                burntSupplyInUsd: burntSupplyInUsd,
                rewardFundAmount: rewardFundAmount,
                cyops: cyops,
                individualCyOps: individualCyOps,
                corporateCyOps: corporateCyOps,
                cryptosphereCyOps: cryptosphereCyOps,
                winningCyOps: winningCyOps,
                individualWinningCyOps: individualWinningCyOps,
                corporateWinningCyOps: corporateWinningCyOps,
                cryptosphereWinningCyOps: cryptosphereWinningCyOps,
                distributorAmount: distributorAmount,
                holdingTokensTotal: holdingTokensTotal,
                cyopEthLiquidity: cyopEthLiquidity,
                totalRewards: totalRewards,
                totalUnftRewards: totalUnftRewards,
                totalBurned: totalBurned
              }}
            />
          </div>
          <div className="mb-5 me-md-4 me-sm-0">
            {inputCommand ? (
              <Fade>
                <DatabaseCommandPanel documentNumber={documentNumber}>
                  <div className="ps-2">{inputCommand}</div>
                </DatabaseCommandPanel>
              </Fade>
            ) : (
              <div className="d-flex py-5 justify-content-center align-items-center flex-column border-width-1 cyop-border-bottom cyop-border-right-thin cyop-border-right-bottom-edge">
                {loadingCommand ? (
                  <>
                    <AttentionSeeker effect="flash">
                      <p className="text-center">{scanningText}</p>
                    </AttentionSeeker>
                    <p className="text-desc text-center " style={{ fontSize: "1rem" }}>
                      COPYRIGHT 2021-2115 CYOP CORP
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-center">awaiting data request</p>
                    <AttentionSeeker effect="flash">
                      <p className="text-desc text-center" style={{ fontSize: "1rem" }}>
                        enter 'help' to see command list
                      </p>
                    </AttentionSeeker>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DatabasePageV2;

import { useState, useEffect, FC, ChangeEvent } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "helpers/utils";
import useContracts from "shared/hooks/useContracts";
import { useWeb3 } from "shared/hooks";
import addresses from "shared/addresses";
import { toast } from "react-toastify";
import { Slide } from "react-awesome-reveal";
import { ICycleResults } from "../../shared/interfaces";
import { getCycleResults, computeWinners } from "shared/backend";

export const Oracle: FC = () => {
  const { chainId, switchNetwork, signMessage } = useWeb3();
  const { distributePrizes } = useContracts();
  const [cycleResults, setCycleResults] = useState<ICycleResults>();
  const [encodedData, setEncodedData] = useState("");
  const [cycleIndex, setCycleIndex] = useState(1);
  const { currentCycle, endCurrentCycle } = useContracts();

  const getCycleDetails = async (cycle: number) => {
    const result = await getCycleResults(cycle);
    if (result?.status !== 200 && !result?.data) return;
    setCycleResults(result.data.cycleResults);
    setEncodedData(result.data.encodedData);
  };

  const onClickSubmit = async () => {
    if (!distributePrizes) {
      toast.error("Something went wrong during initialization.");
      return;
    }
    await distributePrizes(encodedData);
  };

  const onClickGetCycleDetails = async () => {
    await getCycleDetails(cycleIndex);
  };

  const onClickComputeWinners = async () => {
    try {
      if (!signMessage) return;
      const signature = await signMessage({action: "compute winners"});
      if (!signature) return;
      const res = await computeWinners(signature, cycleIndex);
      if (res && res.status === 200) {
        toast.success("Done.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (e: any) {
      toast.error(e.toString(), { position: toast.POSITION.BOTTOM_LEFT, style: { width: "1000px" } });
    }
  };

  const onClickEndCycle = async () => {
    try {
      if (!endCurrentCycle) return;
      await endCurrentCycle();
    } catch (e: any) {
      toast.error(e.toString(), { position: toast.POSITION.BOTTOM_LEFT, style: { width: "1000px" } });
    }
  };

  const onCycleIndexChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let cycle = parseInt(event.target.value, 10);
    if (cycle <= 0) cycle = 1;
    setCycleIndex(cycle);
  };

  useEffect(() => {
    const getResults = async () => {
      if (currentCycle) {
        await getCycleDetails(currentCycle.toNumber());
      }
    };

    getResults();
  }, [currentCycle]);

  useEffect(() => {
    if (chainId !== addresses.networkID) {
      switchNetwork(addresses.networkID);
    }
  }, [chainId, switchNetwork]);

  return (
    <>
      <div className="co-cmd-panel">
        <div className="col-12">
          <Slide direction="left" cascade duration={250} triggerOnce>
            <p className="mb-1 mt-5 cyop-border-top ">
              <div className="container-fluid mt-1">
                <div className="row">
                  <div className="col-md-auto">Select Cycle:</div>
                  <div className="col-md-auto">
                    <input type="number" value={cycleIndex} onChange={onCycleIndexChanged} />
                  </div>
                  <div className="col-md-auto">
                    <div className="button-label" onClick={onClickGetCycleDetails}>
                      Get Cycle Details
                    </div>
                  </div>
                </div>
              </div>
            </p>
            {cycleResults && (
              <>
                <p className="mb-1 mt-1">
                  Cycle Index: <span className="text-danger">{cycleResults?.cycleIndex}</span>
                </p>
                <p className="mt-2" style={{ height: 25 }}>
                  Total CyOp Amount:{" "}
                  <span className="text-desc">{`${formatUnits(
                    BigNumber.from(cycleResults.totalCyOpAmount),
                    9
                  )} (${BigNumber.from(cycleResults.totalCyOpAmount).toString()})`}</span>
                </p>
                <p style={{ height: 25 }}>
                  Total uNFT Amount:{" "}
                  <span className="text-desc">{BigNumber.from(cycleResults.totalUNFTAmount).toString()}</span>
                </p>
                <p className="cyop-border-top mt-2" style={{ height: 25 }}>
                  First Place
                </p>
                <p style={{ height: 25 }}>
                  Address: <span className="text-desc">{cycleResults.firstPlaceAddress}</span>
                </p>
                {cycleResults.isFirstPlaceToken && (
                  <>
                    <p style={{ height: 25 }}>
                      DEX Router Address: <span className="text-desc">{cycleResults.dexRouters[0]}</span>
                    </p>
                  </>
                )}
                <p className="cyop-border-top mt-2" style={{ height: 25 }}>
                  Second Place
                </p>
                <p style={{ height: 25 }}>
                  Address: <span className="text-desc">{cycleResults.secondPlaceAddress}</span>
                </p>
                {cycleResults.isSecondPlaceToken && (
                  <>
                    <p style={{ height: 25 }}>
                      DEX Router Address: <span className="text-desc">{cycleResults.dexRouters[1]}</span>
                    </p>
                  </>
                )}
                <p className="cyop-border-top mt-2" style={{ height: 25 }}>
                  Third Place
                </p>
                <p style={{ height: 25 }}>
                  Address: <span className="text-desc">{cycleResults.thirdPlaceAddress}</span>
                </p>
                {cycleResults.isThirdPlaceToken && (
                  <>
                    <p style={{ height: 25 }}>
                      DEX Router Address: <span className="text-desc">{cycleResults.dexRouters[2]}</span>
                    </p>
                  </>
                )}
                <p className="cyop-border-top mt-2 mb-2" style={{ height: 25 }}>
                  Lucky User: <span className="text-desc">{cycleResults.luckyUser}</span>
                </p>
              </>
            )}
          </Slide>
        </div>
        <div className="cyop-border-top mb-2"></div>
        <div className="button-label" style={{ width: "100px" }} onClick={onClickSubmit}>
          submit
        </div>
        <div className="button-label" style={{ width: "400px" }} onClick={onClickEndCycle}>
          end current cycle
        </div>
        <div className="button-label" style={{ width: "400px" }} onClick={onClickComputeWinners}>
          compute winners
        </div>
      </div>
    </>
  );
};

export default Oracle;

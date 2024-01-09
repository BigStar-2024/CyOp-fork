import ProgressBarStatus from "components/progressbar-status";
import { formatUnits } from "helpers/utils";
import { FC, useEffect, useState } from "react";
import { useAudio } from "react-awesome-audio";
import { Slide } from "react-awesome-reveal";
const sndContent = require("assets/audio/content.mp3").default;

interface IDatabaseStatusPanel {
  totalValue?: number;
  reserveFund?: number;
  rewardFundAmount?: number;
  burntPercent?: number;
  burntSupplyInUsd?: number;
  holding?: number;
  holdingTokens?: Array<any>;
}

export const DatabaseStatusPanel: FC<IDatabaseStatusPanel> = ({
  totalValue,
  reserveFund,
  rewardFundAmount,
  burntPercent,
  burntSupplyInUsd,
  holding,
  holdingTokens
}) => {
  const [totalBalanceInUsd, setTotalBalanceInUsd] = useState(0);

  useEffect(() => {
    if (holdingTokens) {
      let totalBalance = 0;
      for (const token of holdingTokens) {
        totalBalance += token.balanceInUsd;
      }
      setTotalBalanceInUsd(totalBalance);
    }
  }, [holdingTokens]);

  const { play, pause } = useAudio({
    src: sndContent,
    loop: true
  });

  useEffect(() => {
    let timerA: any;

    const playSound = () => {
      play();
      timerA = setTimeout(() => {
        pause();
      }, 1000);
    };
    playSound();

    return () => {
      clearTimeout(timerA);
      pause();
    };
  }, []);
  return (
    <div className="row py-3 px-2 gy-1 gx-0">
      <div className="col-12 col-md-6 cyop-border-right-up-sm">
        <div>
          <Slide direction="left" cascade duration={250} triggerOnce>
            <p className="mb-1">Total value processed:</p>
            <span className="text-danger">$ {totalValue != null && Number.isFinite(totalValue) ? Math.round(totalValue) : "0"}</span>
            <p className="mt-4 mb-0">
              Reward Fund: <span className="text-desc">$ {rewardFundAmount != null && Number.isFinite(rewardFundAmount) ? Math.round(rewardFundAmount) : "0"}</span>
            </p>
            <p className="mb-0">
              Burned Supply:{" "}
              <span className="text-desc">
                {burntPercent}% {"("}$ {burntSupplyInUsd != null && Number.isFinite(burntSupplyInUsd) ? Math.round(burntSupplyInUsd) : "0"}
                {")"}
              </span>
            </p>
            <p>
              Recharge Fund: <span className="text-desc">$ {reserveFund != null && Number.isFinite(reserveFund) ? Math.round(reserveFund) : "0"}</span>
            </p>
          </Slide>
        </div>
      </div>
      <div className="col-12 col-md-6 cyop-border-top-sm">
        <div className="ps-md-4 ps-sm-0">
          <p className="mb-1">&nbsp;</p>
          <p className="mb-4">
            Holdings: <span className="text-desc">$ {totalBalanceInUsd != null && Number.isFinite(totalBalanceInUsd) ? Math.round(totalBalanceInUsd) : "0"}</span>
          </p>
          {holdingTokens &&
            holdingTokens.map((item) => (
              <div className="d-flex align-items-center" key={item.id} style={{ height: 25 }}>
                <Slide direction="right" triggerOnce>
                  <ProgressBarStatus total={totalBalanceInUsd} value={item.balanceInUsd} hideValue={true} />
                  <div className="text-desc ps-1">
                    {item.symbol} - ${item.balanceInUsd}
                  </div>
                </Slide>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatusPanel;

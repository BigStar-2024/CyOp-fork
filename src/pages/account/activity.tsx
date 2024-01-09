import { useEffect, useState } from "react";
import { useWeb3, useContracts } from "shared/hooks";
import WalletAddressPanel from "components/account/wallet-address-panel";
import AccountActivities from "components/account/account-activities";
import DegenTextAnimation from "components/account/degen-text-animation";
import { useAudio } from "react-awesome-audio";
import { Fade } from "react-awesome-reveal";
import { BigNumber } from "ethers";
import { getVotes, getUser } from "shared/backend";
import { IUser, IUserVote } from "shared/interfaces";
import Button from "components/base/button";

const sndType = require("assets/audio/type.mp3").default;

export const AccountActivity = ({
  cyopBalance,
  uNFTBalance,
  setPath
}: {
  cyopBalance: BigNumber;
  uNFTBalance: BigNumber;
  setPath: any;
}) => {
  const numVotesPerPage = 10;
  const [showDegen, setShowDegen] = useState(false);
  const [showDegenA, setShowDegenA] = useState(false);
  const [userVotes, setUserVotes] = useState<IUserVote[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [voteCount, setVoteCount] = useState(numVotesPerPage);
  const [numPage, setNumPage] = useState(1);
  const { walletAddress, loginState } = useWeb3();
  const { play, pause } = useAudio({
    src: sndType,
    loop: true
  });

  const onLoadMoreClick = () => {
    setNumPage(numPage + 1);
  };

  useEffect(() => {
    // hide greeting text 1s after greeting message is fully displayed
    let timerA: any, timer: any;
    const showDegen = () => {
      play();
      timer = setTimeout(() => {
        setShowDegen(true);
        pause();
      }, 3000);
    };

    const showDegenAnimation = () => {
      timerA = setTimeout(() => {
        setShowDegenA(true);
      }, 500);
    };
    showDegenAnimation();
    showDegen();

    if (setPath) {
      setPath("/activity");
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(timerA);
      pause();
    };
  }, []);

  useEffect(() => {
    if (userVotes && userVotes.length > 0) {
      let votePerPage = numVotesPerPage * numPage;
      let numVotes = 0;
      let numVotesToShow = 0;

      for (const vote of userVotes) {
        numVotesToShow++;
        if (vote.power === null || vote.power !== "0") numVotes++;
        if (vote.skill) numVotes++;
        if (numVotes >= votePerPage) break;
      }

      setVoteCount(numVotesToShow);
    }
  }, [userVotes, numPage]);

  useEffect(() => {
    const getUserAndVotes = async () => {
      let result = await getUser(walletAddress!);
      if (result?.status !== 200 && !result?.data) return;
      setUser(result.data.user);
      result = await getVotes({ walletAddress: walletAddress, limit: 50 });
      if (result?.status !== 200 && !result?.data) return;
      setUserVotes(result.data);
    };

    if (!walletAddress) return;
    getUserAndVotes();
  }, [walletAddress, loginState]);

  return (
    <>
      <div className="d-flex flex-column  overflow-auto">
        <WalletAddressPanel address={walletAddress} cyop={cyopBalance} unft={uNFTBalance.toNumber()} />
        <div className="d-flex h-100 flex-column">
          <div className="p-2 cyop-border-bottom position-relative" id="degen-pop-up" style={{ height: '100%' }}>
            <div className='position-absolute top-0 start-0 bottom-0 end-0' style={{ zIndex: 5 }} />
            {showDegenA && <DegenTextAnimation />}
            {showDegen && (
              <Fade triggerOnce duration={500}>
                <div className="degen-box">
                  <h1>{user ? user.rank : "UNKNOWN"}</h1>
                  <span className="">your corporate hacking skill</span>
                </div>
              </Fade>
            )}
          </div>
          <Fade cascade triggerOnce>
            <div className="p-2 overflow-auto" style={{ minHeight: 100 }}>
              <AccountActivities data={userVotes.slice(0, voteCount)} />
              <div className="d-flex">
                {voteCount < userVotes.length && (
                  <Button variant="text" className="ps-1" onClick={onLoadMoreClick}>
                    load more
                  </Button>
                )}
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </>
  );
};

export default AccountActivity;

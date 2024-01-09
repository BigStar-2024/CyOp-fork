import { useEffect, useState } from "react";
import { useAudio } from "react-awesome-audio";
import { useWeb3 } from "shared/hooks";
import useContracts from "shared/hooks/useContracts";
import { BigNumber } from "ethers";
import UNftModule, { NoUNft, UnftLoading } from "components/account/unft-module";
import { Fade } from "react-awesome-reveal";
import AccountClaimPanel from "components/account/account-claim-panel";
import { getUserRewards, getTotalAmount, getTicket, getActiveNfts, getUnftsMetadata } from "shared/backend";
import Button from "components/base/button";
import { Zoom } from "react-awesome-reveal";
import Modal from "react-modal";
import Image from "react-bootstrap/Image";
import { INFT, IReward } from "shared/interfaces";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

Modal.setAppElement("#root");
const sndContent = require("assets/audio/interface.mp3").default;

export const AccountUNft = ({
  cyopBalance,
  uNFTBalance,
  setPath
}: {
  cyopBalance: BigNumber;
  uNFTBalance: BigNumber;
  setPath: any;
}) => {
  const { play, pause } = useAudio({
    src: sndContent,
    loop: true
  });

  const { walletAddress, signMessage } = useWeb3();
  const { getUserNFTs, claimReward, getStakersTotalReward } = useContracts();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState("");
  const [selectedFullsizeImgUrl, setSelectedFullsizeImgUrl] = useState("")
  const [userNfts, setUserNfts] = useState<Array<INFT> | null>();
  const [unftsLoaded, setUnftsLoaded] = useState(false);
  const [rewards, setRewards] = useState<IReward[] | null>(null);
  const [lastRewards, setLastRewards] = useState<BigNumber[]>([]);
  const [totalReward, setTotalReward] = useState(BigNumber.from(0));
  const [totalClaimed, setTotalClaimed] = useState(BigNumber.from(0));
  const [claimedRewards, setClaimedRewards] = useState<IReward[]>([]);
  const [totalUnclaimed, setTotalUnclaimed] = useState(BigNumber.from(0));
  const [unclaimedRewards, setUnclaimedRewards] = useState<IReward[]>([]);
  const [rewardsReady, setRewardsReady] = useState(false);
  const [activeUnfts, setActiveUnfts] = useState<Array<number>>([]);
  const [selectedUnft, setSelectedUnft] = useState<INFT | null>();
  const [downloadBtnText, setDownloadBtnText] = useState("download fullsize");

  const openModal = (src: string, fullsizeSrc: string) => {
    setSelectedImgUrl(src);
    setSelectedFullsizeImgUrl(fullsizeSrc);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDownloadBtnText("download fullsize");
  };

  const downloadImage = () => {
    if (!selectedFullsizeImgUrl) return;
    const parts = selectedFullsizeImgUrl.split("/");
    setDownloadBtnText("retrieving the image from the grid");
    saveAs(selectedFullsizeImgUrl, parts[parts.length - 1]);
  };

  const handleNftSelect = (unft: INFT) => {
    if (selectedUnft !== unft) {
      setSelectedUnft(unft);
    } else {
      setSelectedUnft(null);
    }
  };

  const claim = async () => {
    try {
      if (!signMessage) return;
      const signature = await signMessage({ action: "claim rewards" });
      if (!signature) return;
      const res = await getTicket(signature, 1);
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
      setRewards(data.filter((x) => x.rewardType === 1));
    }
  };

  const fetchUserUnfts = async () => {
    if (!getUserNFTs || !walletAddress) return;
    const userNftTokenIds = await getUserNFTs(walletAddress);

    if (userNftTokenIds && userNftTokenIds.length > 0) {
      const result = await getUnftsMetadata(userNftTokenIds.map(tokenId => tokenId.toNumber()));
      if (!result || result.status !== 200) return;
      const userNfts: Array<INFT> = result.data;
      setUserNfts(userNfts);
      setUnftsLoaded(true);
    } else if (userNftTokenIds && userNftTokenIds.length === 0) {
      setUnftsLoaded(true);
    }

    const result = await getActiveNfts();

    if (result && result.status === 200 && result.data) {
      setActiveUnfts(result.data);
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
    fetchUserUnfts();
    getRewards();

    if (setPath) {
      setPath("/unft");
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
      let totalUNFTAmounts: { [id: number]: BigNumber } = {};
      for (let reward of rewards) {
        if (reward.cycleIndex in stakersTotalRewardAmount) continue;
        stakersTotalRewardAmount[reward.cycleIndex] = await getStakersTotalReward(1, reward.cycleIndex);
        if (!(reward.cycleIndex in totalUNFTAmounts)) {
          let res = await getTotalAmount(reward.cycleIndex);
          let totalUNFT = BigNumber.from(0);
          if (res && res.data) {
            totalUNFT = BigNumber.from(res.data.totalUNFTAmount);
          }
          totalUNFTAmounts[reward.cycleIndex] = totalUNFT;
        }
      }
      const claimed = rewards.filter((x) => x.isClaimed);
      const unclaimed = rewards.filter((x) => !x.isClaimed);
      const claimedAmount = claimed.reduce(
        (a, b) =>
          a.add(
            BigNumber.from(b.startUNFTAmount)
              .mul(stakersTotalRewardAmount[b.cycleIndex])
              .div(totalUNFTAmounts[b.cycleIndex])
          ),
        BigNumber.from(0)
      );
      const unclaimedAmount = unclaimed.reduce(
        (a, b) =>
          a.add(
            BigNumber.from(b.startUNFTAmount)
              .mul(stakersTotalRewardAmount[b.cycleIndex])
              .div(totalUNFTAmounts[b.cycleIndex])
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
            BigNumber.from(reward.startUNFTAmount)
              .mul(stakersTotalRewardAmount[reward.cycleIndex])
              .div(totalUNFTAmounts[reward.cycleIndex])
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
    <div className="d-flex overflow-auto flex-column">
      <AccountClaimPanel
        claim={() => claim()}
        rewards={unclaimedRewards}
        rewardsReady={rewardsReady}
        totalReward={totalUnclaimed}
      />
      <div className="d-flex flex-column gap-2 my-2 px-2">
        <Fade triggerOnce cascade damping={0.2}>
          {unftsLoaded ? (
            userNfts && userNfts.length > 0 ? (
              userNfts.map((item) => (
                <UNftModule
                  key={item.tokenId}
                  active={activeUnfts.includes(parseInt(item.tokenId!, 10))}
                  name={item.name}
                  description={item.description}
                  imageSrc={item.image}
                  fullsizeImageSrc={item.fullsize}
                  viewImage={openModal}
                  booting={false}
                  selected={false}
                  onClick={activeUnfts.includes(parseInt(item.tokenId!, 10)) ? () => {} : () => handleNftSelect(item)}
                />
              ))
            ) : (
              <NoUNft mint={() => {}} />
            )
          ) : (
            <UnftLoading />
          )}
        </Fade>
      </div>
      {selectedImgUrl && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="NFT image full screen view"
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0, 0.8)",
              zIndex: 10
            },
            content: {
              border: "none",
              background: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <div className="container">
            <div className="row">
              <Zoom>
                <Image src={selectedImgUrl} style={{ padding: 3, paddingLeft: 0 }} className="img-fluid" />
              </Zoom>
              <Button
                variant="text"
                style={{ position: "absolute", right: "5vw", background: "none" }}
                onClick={closeModal}
              >
                X
              </Button>
            </div>
            <div className="row">
              <Button variant="text" onClick={downloadImage} style={{ width: "100%", textAlign: "center" }}>
                {downloadBtnText}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AccountUNft;

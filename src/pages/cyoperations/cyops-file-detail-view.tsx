import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CyOpFileTab from "components/cyoperations/cyop-file-tab";
import CyOpFileNamePanel from "components/cyoperations/cyop-file-name-panel";
import YouTube from "react-youtube";
import { formatUnits } from "helpers/utils";
import Button from "components/base/button";
import CyopFileActivities from "components/cyoperations/cyop-file-activities";
import { Fade, Zoom } from "react-awesome-reveal";
import useContracts from "shared/hooks/useContracts";
import { useWeb3 } from "shared/hooks";
import { toast } from "react-toastify";
import {
  getParticipation,
  getVotes,
  getFilteredVotes,
  postVote,
  getCyop,
  getActiveNfts,
  getUnftsMetadata
} from "shared/backend";
import { IUserVote, INFT } from "shared/interfaces";
import { BigNumber } from "ethers";
import { UNftModule, NoUNft } from "components/account/unft-module";
import Modal from "react-modal";
import { Image } from "react-bootstrap";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { decimals } from "shared/constants";
import Spinner from "react-bootstrap/Spinner";
import { saveAs } from "file-saver";

Modal.setAppElement("#root");

export const CyOpFile = (props: any) => {
  const numVotesPerPage = 10;
  const { cyops, getUserNFTs } = useContracts();
  const [file, setFile] = useState<any | null>(null);
  const { id } = useParams();
  const { signMessage } = useWeb3();
  const [balanceToUse, setBalanceToUse] = useState("0");
  const [cyopVotes, setCyOpVotes] = useState<IUserVote[]>([]);
  const onBalanceToUseChanged = (e: any) => setBalanceToUse(e.target.value);
  const { walletAddress } = useWeb3();
  const { currentCycle } = useContracts();
  const [availableCyOp, setAvailableCyOp] = useState(BigNumber.from(0));
  const [selectedUnft, setSelectedUnft] = useState<INFT | null>();
  const [userNfts, setUserNfts] = useState<Array<INFT> | null>();
  const [voteCount, setVoteCount] = useState(numVotesPerPage);
  const [numPage, setNumPage] = useState(1);
  const [activeUnfts, setActiveUnfts] = useState<Array<number>>([]);
  const [unftsLoaded, setUnftsLoaded] = useState(false);
  const [downloadBtnText, setDownloadBtnText] = useState("download fullsize");

  // ! for UNft states
  const [showNfts, setShowNfts] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState("");
  const [selectedFullsizeImgUrl, setSelectedFullsizeImgUrl] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

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

  const onShowNftBtnClicked = () => {
    unftsLoaded && setShowNfts(!showNfts);
  };

  const onLoadMoreClick = () => {
    setNumPage(numPage + 1);
  };

  const fetchData = async () => {
    if (!currentCycle || !walletAddress || !getUserNFTs) return;
    let totalUsed = BigNumber.from(0);

    let result = await getVotes({
      walletAddress: walletAddress,
      cycleIndex: currentCycle.toString()
    });

    if (result && result.status === 200 && result.data) {
      const data: IUserVote[] = result.data;
      totalUsed = data.reduce((a, b) => a.add(BigNumber.from(b.balanceUsed)), BigNumber.from(0));
    }

    result = await getParticipation(walletAddress, currentCycle.toString());

    if (result && result.status === 200 && result.data) {
      setAvailableCyOp(BigNumber.from(result.data.startCyopBalance).add(result.data.bonusCyop).sub(totalUsed));
    }

    result = await getActiveNfts();

    if (result && result.status === 200 && result.data) {
      setActiveUnfts(result.data);
    }

    const userNftTokenIds = await getUserNFTs(walletAddress);
    if (userNftTokenIds && userNftTokenIds.length > 0) {
      const result = await getUnftsMetadata(userNftTokenIds.map((tokenId) => tokenId.toNumber()));
      if (!result || result.status !== 200) return;
      const userNfts: Array<INFT> = result.data;
      setUserNfts(userNfts);
    }
    setUnftsLoaded(true);
  };

  useEffect(() => {
    if (cyopVotes && cyopVotes.length > 0) {
      let votePerPage = numVotesPerPage * numPage;
      let numVotes = 0;
      let numVotesToShow = 0;

      for (const vote of cyopVotes) {
        numVotesToShow++;
        if (vote.power === null || vote.power !== "0") numVotes++;
        if (vote.skill) numVotes++;
        if (numVotes >= votePerPage) break;
      }

      setVoteCount(numVotesToShow);
    }
  }, [cyopVotes, numPage]);

  useEffect(() => {
    if (!walletAddress || !currentCycle) return;
    fetchData();
  }, []);

  const fetchFile = async (name: string | undefined, update: boolean = false) => {
    if (!id) return;
    let file = null;
    if (!update) {
      if (cyops) file = cyops.find((item: any) => item._id === id);
    }
    if (!file && currentCycle) {
      const result = await getCyop(id, currentCycle.toString());
      if (result.status !== 200) return;
      let { proposal: cyop, percentage } = result.data;
      file = {
        title: cyop.name,
        description: cyop.description,
        percent: percentage.percentage,
        _id: cyop._id,
        type: cyop.type,
        youtubeId: cyop.youtubeId,
        detailedDescription: cyop.detailedDescription,
        link: cyop.link,
        address: cyop.address,
        isMasked: "isMasked" in cyop && cyop.isMasked
      };
    }
    if (!file) return;
    setFile(file);
  };

  const getUserVotes = async () => {
    if (!id || !currentCycle) return;
    const result = await getFilteredVotes({ cyoperation: id, cycleIndex: currentCycle.toString() });
    if (result?.status !== 200 && !result?.data) return;
    setCyOpVotes(result.data);
  };

  useEffect(() => {
    if (!currentCycle) return;
    props.setCmd(`searching:\\${id}>file_loaded`);
    props.setPath("/cyoperations");
    fetchFile(id, false);
    getUserVotes();
  }, [id]);

  const vote = async () => {
    try {
      if (!id || !signMessage) return;
      let vote: any = {
        balanceUsed: balanceToUse,
        proposal: id,
        tokenId: selectedUnft ? selectedUnft.tokenId : null
      };
      const signature = await signMessage(vote);
      if (!signature) return;
      const votingResult = await postVote(signature);
      if (votingResult.status === 200) {
        toast.success(votingResult.data ? votingResult.data : "Vote accepted!");
        getUserVotes();
        fetchData();
        fetchFile(id, true);
        setSelectedUnft(null);
        setShowNfts(false);
      } else {
        toast.error(votingResult.statusText);
      }
    } catch (e: any) {
      const respMsg = e?.response?.data;
      toast.error(respMsg ? respMsg : e.message);
    }
  };

  const handleNftSelect = (unft: INFT) => {
    if (selectedUnft !== unft) {
      setSelectedUnft(unft);
    } else {
      setSelectedUnft(null);
    }
  };

  return (
    <div className="container-fluid overflow-scroll">
      <div className="row">
        <CyOpFileTab redirect={"/cyoperations"} />
      </div>
      {file && (
        <>
          <div className="row">
            <CyOpFileNamePanel name={file.title} percent={file.isMasked ? "##" : file.percent.toFixed(2)} />
          </div>
          {/* https://www.youtube.com/watch?v=Tg2rzSXD_S8&feature=youtu.be */}

          {file.youtubeId && (
            <div className="py-2 px-0" id="youtube-vdo">
              <div className="cyop-16-9">
                <YouTube
                  videoId={file.youtubeId}
                  className="aspect-ratio-box-inside"
                  opts={{
                    playerVars: {
                      autoplay: 0,
                      controls: 0
                    }
                  }}
                />
              </div>
            </div>
          )}
          <div className="row py-1 cyop-border-top">
            <div className="d-flex justify-content-between align-items-center px-0">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 col-xl-8 align-items-center d-flex px-0">
                    <div className="row d-flex w-100 gx-0">
                      <div className="col-lg-8 col-6 d-flex flex-1 align-items-center">
                        <div className="container-fluid">
                          <div className="row gy-1">
                            <div className="col-12 col-xl-4">
                              <span>input</span>
                            </div>
                            <div className="col-12 col-xl-8">
                              <input
                                className="flex-1 text-desc stake-txt-input"
                                placeholder="0.0"
                                value={balanceToUse}
                                onChange={onBalanceToUseChanged}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-6 align-items-center d-flex flex-wrap pe-0">
                        <div className="container-fluid h-100">
                          <div className="row h-100">
                            <div className="col-12 d-flex justify-content-end gap-1 align-items-center">
                              <span style={{ fontSize: "0.8rem", textAlign: "end" }}>
                                [{formatUnits(availableCyOp, decimals.CyOp)}]
                              </span>
                              <span
                                className="text-danger"
                                style={{ fontSize: "0.8rem", cursor: "pointer" }}
                                onClick={() => setBalanceToUse(formatUnits(availableCyOp, decimals.CyOp, false))}
                              >
                                max
                              </span>
                            </div>
                            <div className="col-12 text-end hide-up-xl">CyOp</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex col-12 col-xl-4 mt-1 mt-xl-0 px-0 gap-1">
                    <Button
                      variant="contained"
                      className="py-1 justify-content-center w-100"
                      onClick={async () => {
                        await vote();
                      }}
                      fullWidth
                    >
                      vote
                    </Button>
                    <Button
                      variant="contained"
                      className="py-1 justify-content-center w-100"
                      onClick={onShowNftBtnClicked}
                      fullWidth
                      disabled={unftsLoaded ? false : true}
                    >
                      unft{" "}
                      {unftsLoaded ? (
                        showNfts ? (
                          <BsFillCaretUpFill />
                        ) : (
                          <BsFillCaretDownFill />
                        )
                      ) : (
                        <Spinner animation="border" size="sm" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row py-2 cyop-border-top-up-xl">
            {/* <div className="row px-2 py-2 cyop-border-top-up-xl w-100"> */}
            {showNfts ? (
              <div className="px-0">
                <Fade cascade duration={200} triggerOnce>
                  {userNfts &&
                    userNfts.length > 0 &&
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
                          selected={typeof selectedUnft !== undefined && selectedUnft?.tokenId === item.tokenId}
                          onClick={
                            activeUnfts.includes(parseInt(item.tokenId!, 10)) ? () => {} : () => handleNftSelect(item)
                          }
                        />
                    ))}
                  {(!userNfts || userNfts.length === 0) && <NoUNft mint={() => {}} />}
                </Fade>
              </div>
            ) : (
              <Fade cascade duration={200} triggerOnce>
                <p className="">
                  <span className="text-danger">description:\ </span>
                  {file.description}
                </p>
                <p className="px-0" style={{ whiteSpace: "pre-line" }}>
                  {file.detailedDescription}
                </p>
                <p className="px-0">
                  <span className="text-danger">data:\ </span>
                  <a href={file.link} target="_blank" rel="noopener noreferrer">
                    website 
                  </a>{" "}
                  \{" "}
                  {file.type !== "cryptosphere" && (
                    <a href={"https://etherscan.io/address/" + file.address} target="_blank" rel="noopener noreferrer">
                      wallet 
                    </a>
                  )}
                  {file.type === "cryptosphere" && (
                    <a
                      href={"https://www.dextools.io/app/en/ether/pair-explorer/" + file.address}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      dextools 
                    </a>
                  )}
                </p>
                <p className="px-0 mb-4">
                  <span className="text-danger">filed to:\ </span>
                  {file.type}
                </p>
                {cyopVotes && cyopVotes.length > 0 && <CyopFileActivities data={cyopVotes.slice(0, voteCount)} />}
                <div className="d-flex">
                  {voteCount < cyopVotes.length && (
                    <Button variant="text" className="ps-1" onClick={onLoadMoreClick}>
                      load more
                    </Button>
                  )}
                </div>
              </Fade>
            )}
          </div>
        </>
      )}
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

export default CyOpFile;

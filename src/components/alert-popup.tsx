import { useEffect, useState } from "react";
import { useAudio } from "react-awesome-audio";
import { Bounce, Fade } from "react-awesome-reveal";
import { RandomReveal } from "react-random-reveal";
import { useWeb3 } from "../shared/hooks";
import { intToString } from "../helpers/utils";
import { formatUnits } from "ethers/lib/utils";
import { decimals } from "../shared/constants";
const sndContent = require("assets/audio/type.mp3").default;

const PopupAlert = (props: any) => {
  const { walletAddress } = useWeb3();
  const [data, setData] = useState<{ [fieldName: string]: any } | null>({});
  const [show, setShow] = useState(false);
  const { play, pause } = useAudio({
    src: sndContent,
    loop: true
  });
  const digits = [
    "010001000101110111110110001001101101011111101111011010110110101110110101011110110101110110101011",
    "011111010100011111110001110011110001000011110011011011110110110101110110101011100101101011000011",
    "110000100111111111001001100000011011010111011010101111011011110111010011111100111011001011010110",
    "101111000110110110101101011011010101101011111011010101110101010100111100101111110100111110011111",
    "110000101000001000101111110111011010111011010101111110110101111000101010111101011010000010100010",
    "100101111000100010101110011110101010111110110101101100100110110101110110101010111101000011110000",
    "001111011001110011011001001111111011101111011011011011010111011010101011010111101100111101000100",
    "100010100000011011001110000011111110011110010011011010111011010101101011111011010110010010111100",
    "100000001010011010110001100100011110010110111110110110101111001111011010111011010101110111100010",
    "100101110001110100100001011110011100011110111011101101011101110110101101010110010100101010101111",
    "110101001001110010101100001011001111001000011110110000001011010111101101101011101101010111010101",
    "101011110001101000010001101101011101101010110000011110010100110101101011110011111000111000010101",
    "110011111100001110011100100111000101001011011101110110011110101111001000011011010111011010101110",
    "100001101110100111011100101100001001110100011101101011101101011110010110111011010110001000011111",
    "011110011101101100100110011100010100111111101001100001111111101101011110011011010111011010101110",
    "000000101000001011011111000110001100011100110101001110011011101101011101011110101101011101010111",
    "110001000001011011010111011010101101001111010001010110100100101001000001001011011110010111000001",
    "111100100010101111100100000100101001110110101110110101011100110010111011000101101011011110000001",
    "001110101011000111100110111011010110101110110101011110000100111111011101110100010101111001011110",
    "011110110101110110101011110010011000100000110110101000001110101111100110101011011010111111011110"
  ];
  const playSound = () => {
    play();
    let timerA: any;
    timerA = setTimeout(() => {
      pause();
      clearTimeout(timerA);
    }, 4000);
  };

  const markAsRead = () => {
    setShow(false);
    setData(null);
    props.setNotificationData(null);
    props = null;
  };

  useEffect(() => {
    if (props) {
      if ("data" in props && props.data && Object.values(props.data).length > 0) {
        setData(props.data);
        setShow(true);
      } else {
        setShow(false);
        setData(null);
      }
    } else {
      markAsRead();
    }
  }, [props]);

  useEffect(() => {
    if (show) {
      playSound();
    }
  }, [show]);

  const isNotInitiator = () => {
    return walletAddress && data && data.walletAddress.toLowerCase() !== walletAddress.toLowerCase();
  };

  return (
    <>
      {show && data && isNotInitiator() && (
        <div
          className="co-alert-fullscreen d-flex justify-content-evenly flex-column position-relative"
          style={{ height: "100vh" }}
        >
          <div className="container-fluid h-100" style={{ position: "fixed", zIndex: 2 }}>
            <div className="row h-100 justify-content-center align-items-center">
              <div className="col-10 col-md-8 col-lg-6 col-xl-4 col-xxl-3">
                <Bounce triggerOnce>
                  <div
                    className="pt-2 pb-4 text-uppercase text-center d-flex flex-column align-items-center justify-content-center w-100"
                    style={{
                      border: "solid 2px var(--bs-danger)",
                      backgroundColor: "#111111",
                      color: "var(--bs-danger)",
                      minHeight: 250
                    }}
                  >
                    <div className="container d-flex justify-content-end">
                      <span
                        className="pointer"
                        onClick={() => {
                          setShow(false);
                          setData(null);
                        }}
                      >
                        X
                      </span>
                    </div>
                    <Fade>
                      <h1 className="  mb-3 cyop-blink fw-bold">System alert</h1>
                    </Fade>
                    {data.type === "vote" ? (
                      <>
                        <p className="fw-bold m-0">Whale detected</p>
                        <span>{intToString(parseFloat(formatUnits(data.balanceUsed, decimals.CyOp)))} CyOp</span>
                        <p className="m-0">
                          Voted on:{" "}
                          <a href={"/#/cyoperations/" + data.cyoperationId}>
                            <span style={{ textDecoration: "underline" }}>{data.cyoperationName}</span>
                          </a>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="fw-bold">unft activated</p>
                        <span>power:</span>
                        <p>{data.unftName}</p>
                        <p className="m-0">
                          targeted on:{" "}
                          <a href={"/#/cyoperations/" + data.cyoperationId} onClick={() => markAsRead()}>
                            <span style={{ textDecoration: "underline" }}>
                              {data.cyoperationName}
                            </span>
                          </a>
                        </p>
                      </>
                    )}
                  </div>
                </Bounce>
              </div>
            </div>
          </div>
          {digits.map((str, i) => (
            <div
              className="justify-content-around gap-1 overflow-hidden d-flex"
              key={i + "row"}
              style={{ letterSpacing: "0.5em" }}
            >
              <RandomReveal
                isPlaying={true}
                duration={(i + 1) * 0.3}
                revealDuration={0}
                characters={str}
                characterSet={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                revealEasing="random"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PopupAlert;

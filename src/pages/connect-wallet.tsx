import { useEffect, useState, FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useTyped from "hooks/typed";
import Button from "components/base/button";
import useWeb3 from "shared/hooks/useWeb3";
import addresses from "shared/addresses";
import AppLayout from "pages/layouts";
import wallet_ico from "assets/images/wallet-icons/wallet-connect.png";

interface ConnectWalletProps {
  redirectLink: string;
  setRedirectLink?: (link: string) => void;
}

export const ConnectWallet: FC<ConnectWalletProps> = ({ redirectLink, setRedirectLink }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConnectButton, setShowConnectButton] = useState(false);
  const { handleConnect, switchNetwork } = useWeb3();
  const { connected, chainId } = useWeb3();
  // const [isConnecting, setIsConnecting] = useState(false)

  const onCompleteTitleAnimation = () => {};

  const onCompleteAnimation = () => {
    setShowConnectButton(true);
  };

  const [title, titleCompleted] = useTyped({
    text: "TUNE INTO THE GRID:\\",
    start: true,
    speed: 20,
    startDelay: 500,
    onComplete: onCompleteTitleAnimation
  });
  // eslint-disable-next-line
  const [description, descCompleted] = useTyped({
    text: "ACCESS THE TERMINAL BY CONNECTING YOUR WALLET",
    start: titleCompleted,
    speed: 20,
    onComplete: onCompleteAnimation
  });

  const onClickConnect = async () => {
    await handleConnect();
  };

  useEffect(() => {
    if (connected) {
      if (redirectLink) {
        navigate(redirectLink + location.pathname.replace("/wallet-connect", ""));
        // TODO: will be considered in the future
        // setRedirectLink(null);
      }
    }
  }, [redirectLink, connected, navigate, setRedirectLink]);

  return (
    <>
      <div className="full-screen">
        {(!connected || !chainId) && (
          <div className="full-screen p-3 d-flex flex-column justify-content-center align-items-center">
            <div className="text-large text-danger mb-2">
              <span>{title}</span>
              {!titleCompleted && <span className="typed-cursor danger">|</span>}
            </div>
            <div className="text-large">
              <span>{description}</span>
              {titleCompleted && <span className="typed-cursor">|</span>}
            </div>

            <div className="d-flex flex-column align-items-center gap-3 mt-4">
              <Button
                className={`btn-connect ${showConnectButton ? "" : "invisible"}`}
                onClick={async () => await onClickConnect()}
                variant="text"
                fullWidth
                icon={wallet_ico}
              >
                CONNECT NOW
              </Button>
            </div>
          </div>
        )}
        {connected && (chainId === addresses.networkID || chainId === addresses.arbitrumNetworkID) && <AppLayout />}
      </div>
    </>
  );
};

export default ConnectWallet;

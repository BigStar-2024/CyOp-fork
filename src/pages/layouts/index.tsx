import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import CommandPanel from "components/command-panel";
import NavPanel from "./nav-panel";
import Footer from "components/footer-panel";
import AccountStakingPage from "pages/account/staking-page";
import AccountStatusPanel from "./account-status-panel";
import AccountActivity from "pages/account/activity";
import AccountUNft from "pages/account/unft";
import CyOps from "pages/cyoperations/cyops";
import CyOpFile from "pages/cyoperations/cyops-file-detail-view";
import AddTarget from "pages/cyoperations/add-target";
import AddCryptosphere from "pages/cyoperations/add-cryptosphere";
import AddIndividualCyopFile from "pages/cyoperations/add-individual";
import AddCorporateCyopFile from "pages/cyoperations/add-corporate";
import DatabasePageV2 from "pages/database-v2/database";
import Hamburger from "pages/layouts/hamburger";
import useContracts from "../../shared/hooks/useContracts";
import { BigNumber } from "ethers";
import ExchangePage from "pages/exchange";
import Metagrid from "pages/metagrid";

export const AppLayout = () => {
  const location = useLocation();
  const [cmd, setCmd] = useState("");
  const [isCmdVisible, setCmdVisible] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  const [burgerOpen, setBurgerOpen] = useState(false);
  const { balanceOf, balanceOfUNFT } = useContracts();
  const [userCyOpBalance, setUserCyOpBalance] = useState(BigNumber.from(0));
  const [userUNFTBalance, setUserUNFTBalance] = useState(BigNumber.from(0));
  const [path, setPath] = useState("/activity");

  const onCompleteCmd = () => {
    setCmdVisible(true);
  };

  useEffect(() => {
    setCmdVisible(false);
    setBurgerOpen(false);
    if (!location.pathname) return;
    switch (location.pathname) {
      case "/database":
        setCmd("booting:\\terminal>database_loaded ");
        break;
      case "/metagrid":
        setCmd("searching:\\metagrid>simulation_loaded");
        break;
      case "/exchange":
        setCmd("searching:\\exchange>control_loaded");
        break;
      case "/account/cyop":
        setCmd("searching:\\cyop>control_loaded");
        break;
      case "/account/activity":
        setCmd("searching:\\account>control_loaded");
        break;
      case "/account/unft":
        setCmd("searching:\\unft>plugged in");
        break;
      case "/cyoperations":
        setCmd("searching:\\cyoperations>file_loaded");
        break;
      case "/cyoperations/add/target":
        setCmd("searching:\\target>input");
        break;
      case "/cyoperations/add/target/cryptosphere":
        setCmd("searching:\\cryptosphere>input");
        break;
      case "/cyoperations/add/target/individual":
        setCmd("searching:\\individual>input");
        break;
      case "/cyoperations/add/target/corporate":
        setCmd("searching:\\corporate>input");
        break;
      default:
        setCmd("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (balanceOf) {
        const cyopBalance = await balanceOf("L1");
        setUserCyOpBalance(cyopBalance ? cyopBalance : BigNumber.from(0));
      }
      if (balanceOfUNFT) {
        const unftBalance = await balanceOfUNFT();
        setUserUNFTBalance(unftBalance ? unftBalance : BigNumber.from(0));
      }
    };

    fetchBalance();
  }, [balanceOf, balanceOfUNFT]);

  return (
    <div className="co-main d-flex flex-column overflow-auto px-3 py-xl-4 py-2">
      <div className="container-fluid px-md-1 px-1">
        <div className="row">
          <Hamburger open={burgerOpen} setOpen={() => setBurgerOpen(!burgerOpen)} />
        </div>
      </div>
      <div className="co-main-container pt-1 d-flex h-100 overflow-hidden">
        <div className="co-left-panel d-flex flex-column">
          <div
            className={`d-flex flex-column flex-1 overflow-hidden ${transitionStage}`}
            onAnimationEnd={() => {
              if (transitionStage === "fadeOut") {
                setTransistionStage("fadeIn");
                setDisplayLocation(location);
              }
            }}
          >
            {isCmdVisible && (
              <Routes location={displayLocation}>
                <Route path={`/database`} element={<DatabasePageV2 setPath={setPath} />} />

                <Route
                  path={`/account/cyop`}
                  element={
                    <AccountStakingPage cyopBalance={userCyOpBalance} uNFTBalance={userUNFTBalance} setPath={setPath} />
                  }
                />
                <Route
                  path={`/account/activity`}
                  element={
                    <AccountActivity cyopBalance={userCyOpBalance} uNFTBalance={userUNFTBalance} setPath={setPath} />
                  }
                />
                <Route
                  path={`/account/unft`}
                  element={
                    <AccountUNft cyopBalance={userCyOpBalance} uNFTBalance={userUNFTBalance} setPath={setPath} />
                  }
                />

                <Route path={`/metagrid`} element={<Metagrid setPath={setPath} />} />
                <Route path={`/exchange`} element={<ExchangePage setPath={setPath} />} />

                <Route path={`/cyoperations`} element={<CyOps setPath={setPath} />} />
                <Route path={`/cyoperations/add/target`} element={<AddTarget setPath={setPath} />} />
                <Route path={`/cyoperations/add/target/cryptosphere`} element={<AddCryptosphere setPath={setPath} />} />
                <Route
                  path={`/cyoperations/add/target/individual`}
                  element={<AddIndividualCyopFile setPath={setPath} />}
                />
                <Route
                  path={`/cyoperations/add/target/corporate`}
                  element={<AddCorporateCyopFile setPath={setPath} />}
                />
                <Route path={`/cyoperations/:id`} element={<CyOpFile setCmd={setCmd} setPath={setPath} />} />
              </Routes>
            )}
          </div>
          <CommandPanel cmd={cmd} onComplete={onCompleteCmd} />
        </div>

        <div className="co-right-panel">
          <AccountStatusPanel />
          <NavPanel path={path} setPath={setPath} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;

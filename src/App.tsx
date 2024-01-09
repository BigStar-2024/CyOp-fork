import MainRouter from "router";
import { ToastContainer } from "react-toastify";
import { Web3Provider } from "./shared/context/Web3";
import { ContractsProvider } from "./shared/context/Contracts";
import "./assets/scss/index.scss";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import PopupAlert from "./components/alert-popup";
import LandingPage from "pages/landingpage";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL!);

function App() {
  const [notificationData, setNotificationData] = useState({});
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    socket.on("terminal:unft_usage", (data) => {
      setNotificationData({
        type: "unft",
        ...data
      });
    });
    socket.on("terminal:whale_vote", (data) => {
      setNotificationData({
        type: "vote",
        ...data
      });
    });
    window.onhashchange = () => {
      setHash(window.location.hash);
    };
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async ([newAddress]: Array<string>) => {
        if (newAddress) return;
        window.localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
        window.localStorage.removeItem("wallet_connect");
      });
    }
  }, []);

  const useReactPath = () => {
    const [path, setPath] = useState(window.location.pathname);
    const listenToPopstate = () => {
      const winPath = window.location.pathname;
      setPath(winPath);
    };
    useEffect(() => {
      window.addEventListener("popstate", listenToPopstate);
      return () => {
        window.removeEventListener("popstate", listenToPopstate);
      };
    }, []);
    return path;
  };

  const path = useReactPath();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="co-mainwrap">
      {
        // The `hash` is used to filter out the landing page from the rest of the router.
        // It is necessary not to trigger wallet connection on the landing page. 
      }
      {(hash === "" || hash === "#/") && <LandingPage />}
      {hash !== "" && hash !== "#/" && (
        <Web3Provider>
          <ContractsProvider>
            <PopupAlert data={notificationData} setNotificationData={setNotificationData} />
            <MainRouter />
          </ContractsProvider>
        </Web3Provider>
      )}
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;

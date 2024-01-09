import { useEffect, useState, FC } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Context from "./Context";
import addresses from "shared/addresses";
import { getUser, login } from "shared/backend";
import { apis } from "shared/constants";

const Provider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [walletBalance, setWalletBalance] = useState<string>();
  const [chainId, setChainId] = useState<string>("");
  const [wallet, setWallet] = useState<ethers.providers.JsonRpcSigner>();
  const [arbBridge, setArbBridge] = useState<any>(null);
  const [currentProvider, setCurrentProvider] = useState<any>(undefined);
  const [loginState, setLoginState] = useState(false);

  const handleConnect = async () => {
    if (!web3Modal) return;
    setConnecting(true);

    try {
      let provider = await web3Modal?.connect();

      if (provider) {
        const newWeb3 = new ethers.providers.Web3Provider(provider, "any");
        const accounts = await newWeb3.listAccounts();
        const balance = await newWeb3.getBalance(accounts[0]);

        setWalletBalance(ethers.utils.formatEther(balance));
        setWalletAddress(accounts[0]);
        setWallet(newWeb3.getSigner());
        setConnected(true);

        setChainId((newWeb3.provider as any).chainId);
        setCurrentProvider(provider);
        setLoading(false);

        if (window.localStorage) window.localStorage.setItem("wallet_connect", "true");
      } else {
        await handleDisconnect();
      }
    } catch (e) {
      console.log(e);
    }
    setConnecting(false);
  };

  const switchNetwork = async (newChainId: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: newChainId }]
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              newChainId === addresses.networkID
                ? {
                    chainId: newChainId,
                    chainName: addresses.networkName,
                    rpcUrls: [addresses.rpcURL]
                  }
                : {
                    chainId: newChainId,
                    chainName: addresses.arbitrumNetworkName,
                    rpcUrls: [addresses.arbitrumRpcURL]
                  }
            ]
          });
        } catch (addError) {
          // handle "add" error
          console.log("addError:", addError);
        }
      }
      // handle other "switch" errors
    }
  };

  const handleDisconnect = async () => {
    setConnected(false);
    setWalletAddress(undefined);
    setWallet(undefined);
    setCurrentProvider(null);
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    if (window.localStorage) {
      window.localStorage.setItem("wallet_connect", "false");
    }
  };

  const protocolBalance = async () => {
    if (!currentProvider) {
      return null;
    }
    try {
      const newWeb3 = new ethers.providers.Web3Provider(currentProvider, "any");
      const balance = await newWeb3.getBalance(addresses.Protocol);
      return balance;
    } catch (err) {
      console.log("protocol Balance:", protocolBalance);
      return null;
    }
  };

  const readProtocolBalance = async () => {
    try {
      const newWeb3 = new ethers.providers.JsonRpcProvider(addresses.rpcURL);
      const balance = await newWeb3.getBalance(addresses.Protocol);
      return balance;
    } catch (err) {
      console.log("protocol Balance:", protocolBalance);
      return null;
    }
  };

  const getSetWalletBalance = async () => {
    if (wallet) {
      let balance: any = await wallet.getBalance();
      balance = ethers.utils.formatEther(balance);
      setWalletBalance(balance);
      return balance;
    }
  };
  const checkTransaction = async (hash: string) => {
    if (currentProvider) {
      const newWeb3 = new ethers.providers.Web3Provider(currentProvider, "any");
      return await newWeb3.perform("getTransactionReceipt", {
        transactionHash: hash
      });
    }
    return null;
  };

  const waitForTransaction = (hash: string, timeOut = 1000) => {
    return new Promise((resolve, reject) => {
      if (hash === null || hash === undefined) {
        reject();
        return;
      }
      const interval = setInterval(async () => {
        const result = await checkTransaction(hash);
        if (result) {
          if (result.status === "0x1" || result.status === 1) {
            resolve(true);
          } else {
            reject(false);
          }

          clearInterval(interval);
        }
      }, timeOut);
    });
  };

  const signMessage = async (message: { [key: string]: any }) => {
    if (!wallet || !walletAddress) return null;
    message.deadline = Date.now() + 60 * 1000; // 1-min deadline.
    const signature = await wallet.signMessage(JSON.stringify(message));
    if (signature == null) return null;
    return {
      walletAddress: walletAddress,
      message: message,
      signature: signature
    };
  };

  const trySwitchNetwork = async () => {
    await switchNetwork(addresses.networkID);
    await handleConnect();
  };

  useEffect(() => {
    if (web3Modal === undefined) return;
    if (typeof window.ethereum !== "undefined") {
      setInstalled(true);
      if (connected) {
        handleConnect();
      } else {
        setLoading(false);
      }
    } else {
      setInstalled(false);
      setLoading(false);
    }
  }, [web3Modal]); // eslint-disable-line

  useEffect(() => {
    if (window.localStorage) setConnected(localStorage.getItem("wallet_connect") === "true");

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: apis.infuraId,
          rpc: {
            [addresses.networkID]: addresses.rpcURL
          },
          network: addresses.networkName
        }
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK, // Required
        options: {
          appName: "CyOp Terminal", // Required
          infuraId: apis.infuraId, // Required
          rpc: addresses.rpcURL, // Optional if `infuraId` is provided; otherwise it's required
          chainId: 5, // Optional. It defaults to 1 if not provided
          darkMode: true // Optional. Use dark theme, defaults to false
        }
      }
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      theme: "dark",
      providerOptions
    });

    setWeb3Modal(web3Modal);
  }, []);

  useEffect(() => {
    if (!currentProvider) return;

    currentProvider.on("accountsChanged", async ([newAddress]: Array<string>) => {
      if (newAddress) {
        setWalletAddress(ethers.utils.getAddress(newAddress));
      } else {
        await handleDisconnect();
      }
    });

    currentProvider.on("chainChanged", (chain: number) => {
      if (chain === parseInt(addresses.networkID, 16)) return;
      setChainId(chain.toString());
    });
  }, [currentProvider]);

  useEffect(() => {
    const userLogin = async () => {
      if (!walletAddress) return;
      let result = await getUser(walletAddress);
      if (result.data.user) return;
      const signature = await signMessage({ action: "login", walletAddress: walletAddress });
      if (!signature) return;
      result = await login(signature);
      setLoginState(true);
    };
    if (!(wallet && walletAddress)) return;
    userLogin();
  }, [walletAddress, wallet]);

  useEffect(() => {
    if (chainId && parseInt(chainId, 16) !== parseInt(addresses.networkID, 16)) {
      trySwitchNetwork();
    }
  }, [chainId]);

  return (
    <Context.Provider
      value={{
        handleConnect,
        handleDisconnect,
        switchNetwork,
        protocolBalance,
        readProtocolBalance,
        loading,
        installed,
        connected,
        connecting,
        walletAddress,
        walletBalance,
        wallet,
        chainId,
        checkTransaction,
        waitForTransaction,
        arbBridge,
        getSetWalletBalance,
        signMessage,
        loginState
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;

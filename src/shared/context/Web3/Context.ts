import { createContext } from 'react';
import { ethers } from 'ethers';

interface IWeb3Context {
  handleConnect: () => void;
  handleDisconnect: () => Promise<void>;
  switchNetwork: (chainId: string) => void;
  protocolBalance?: () => any;
  readProtocolBalance?: () => any;
  loading: boolean;
  installed: boolean;
  connected: boolean;
  connecting: boolean;
  walletAddress?: string;
  walletBalance?: string;
  wallet?: ethers.providers.JsonRpcSigner;
  chainId?: string;
  checkTransaction?: (hash: string) => any;
  waitForTransaction?: (hash: string, timeout: number) => Promise<unknown>;
  arbBridge?: any;
  getSetWalletBalance?: () => Promise<any>;
  signMessage?: (message: {[key: string]: any}) => Promise<{walletAddress: string, message: {[key: string]: any}, signature: string} | null>;
  loginState: boolean;
}

const Context = createContext<IWeb3Context>({
  handleConnect: () => {},
  handleDisconnect: () => Promise.resolve(),
  switchNetwork: (chainId: string) => {},
  loading: true,
  installed: false,
  connected: false,
  connecting: false,
  loginState: false
});

export default Context;

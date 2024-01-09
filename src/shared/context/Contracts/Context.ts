import { BigNumber, ethers } from 'ethers';
import { createContext, Dispatch, SetStateAction } from 'react';
import { ICyOpNode, ICyOp, ICycleDetails } from '../../interfaces';

export interface IProposal {
  proposalId: BigNumber;
  createdTime: BigNumber;
  createdRound: BigNumber;
  slippage: BigNumber;
  project: string;
  pair: string;
  description: string;
  name: string;
  exist: boolean;
  vote?: number;
  votePercent?: number;
}

interface IContractContext {
  createProposal: (
    project: string,
    pair: string,
    slippage: BigNumber,
    description: string,
    name: string,
    amount: string,
    layer?: string
  ) => Promise<boolean | null>;
  particpiate: (
    project: string,
    vote: BigNumber,
    layer?: string
  ) => Promise<any>;
  proposalList: (
    proposalId: BigNumber,
    layer?: string
  ) => Promise<string | null>;
  getAllProposals: (layer?: string) => Promise<IProposal[]>;
  getVoteCountForAllProposals: (
    round: BigNumber,
    layer?: string
  ) => Promise<object[]>;
  proposalInfo: (proposal: string, layer?: string) => Promise<object | null>;
  getWinningProposal: (
    round: BigNumber,
    layer?: string
  ) => Promise<{ project: string; maxVote: BigNumber } | null>;
  stake: (amount: BigNumber, layer?: string) => Promise<any>;
  approve: (
    spender: string,
    amount: BigNumber,
    layer?: string
  ) => Promise<boolean | null>;
  allowance: (
    owner: string,
    spender: string,
    layer?: string
  ) => Promise<BigNumber | null>;
  unstake: (amount: BigNumber, layer?: string) => Promise<any>;
  claimRewards: (round: BigNumber, layer?: string) => Promise<BigNumber | null>;
  userClaimAmount: (
    account: string,
    round: BigNumber,
    layer?: string
  ) => Promise<BigNumber | null>;
  isUserEligibleToClaim: (
    account: string,
    round: BigNumber,
    layer?: string
  ) => Promise<boolean | null>;
  getUserVotingShare: (
    account: string,
    round: BigNumber,
    layer?: string
  ) => Promise<BigNumber | null>;
  getProposalWon: (round: BigNumber, layer?: string) => Promise<string | null>;
  isUserVoted: (
    account: string,
    round: BigNumber,
    layer?: string
  ) => Promise<boolean | null>;
  userVoteCount: (
    account: string,
    round: BigNumber,
    layer?: string
  ) => Promise<BigNumber | null>;
  totalUserVoted: (
    round: BigNumber,
    layer?: string
  ) => Promise<BigNumber | null>;
  getProposalVoteCount: (
    project: string,
    round: BigNumber,
    layer?: string
  ) => Promise<BigNumber | null>;
  stakeAmount: (account: string, layer?: string) => Promise<BigNumber | null>;
  balanceOf: (layer?: string) => Promise<BigNumber | null>;
  balanceOfWallet: (address: string) => Promise<BigNumber | null>;
  totalSupply: (layer?: string) => Promise<BigNumber | null>;
  erc20TotalSupply: (layer?: string) => Promise<BigNumber | null>;
  userCount: (layer?: string) => Promise<BigNumber | null>;
  proposalCount: (layer?: string) => Promise<BigNumber | null>;
  voteStartTime: (layer?: string) => Promise<BigNumber | null>;
  resultTime: (layer?: string) => Promise<BigNumber | null>;
  readVoteStartTime: () => Promise<BigNumber | null>;
  readResultTime: () => Promise<BigNumber | null>;
  round: (layer?: string) => Promise<BigNumber | null>;
  vaultDeposit: (amount: BigNumber) => Promise<any>;
  vaultWithdraw: (
    amount: BigNumber,
    deadline: BigNumber,
    v: number,
    r: string,
    s: string
  ) => Promise<any>;
  vaultUserInfo: (user: string) => Promise<any>;
  vaultNonces: (user: string) => Promise<any>;
  vaultTrustedSigner: (user: string) => Promise<boolean>;
  balanceOfL2: () => Promise<BigNumber | null>;
  bridgeUserInfoL2: (user: string) => Promise<any>;
  bridgeNoncesL2: (user: string) => Promise<BigNumber | null>;
  bridgeMoveBackL2: (amount: BigNumber) => Promise<any>;
  bridgeClaimL2: (
    claimAmount: BigNumber,
    deadline: BigNumber,
    v: number,
    r: string,
    s: string
  ) => Promise<any>;
  bridgeTrustedSigner: (user: string) => Promise<boolean>;
  balanceOfErc20: (
    contractAddress: string,
    walletAddress: string,
    layer?: string,
    format?: boolean,
    decimals?: number | null
  ) => Promise<string | null>;
  balanceOfUNFT: () => Promise<BigNumber | null>;
  currentCycle: BigNumber | null;
  currentCycleDetails: ICycleDetails | null;
  previousCycleDetails: ICycleDetails | null;
  currentCyclePeriod: BigNumber | null;
  cyops: ICyOpNode[] | null;
  setCyOps: (newCyOps: ICyOpNode[]) => void;
  getCycleDetails: (cycleIndex: number | string) => Promise<ICycleDetails>;
  distributePrizes: (encodedData: string) => any;
  claimReward: (data: string, encodedData: string, signature: string) => any;
  getStakersTotalReward: (stakerType: number, cycleIndex: number | string) => Promise<BigNumber>;
  UniswapRouter: ethers.Contract;
  endCurrentCycle: () => Promise<void>;
  getUserNFTs: (walletAddress: string) => Promise<undefined | Array<BigNumber>>;
  getDistributorKeptAmount: (cycleIndex: number | string) => Promise<BigNumber>;
}

const Context = createContext<IContractContext | null>(null);

export default Context;

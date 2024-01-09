import { useEffect, useState, FC } from "react";
import { Contract, BigNumber, providers, utils } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import Context from "./Context";
import abis from "../../abis";
import useWeb3 from "../../hooks/useWeb3";
import addresses from "../../addresses";
import { ICyOpNode } from "shared/interfaces";

const VaultReadContract = new Contract(addresses.Vault, abis.Vault, new providers.JsonRpcProvider(addresses.rpcURL));
const BridgeReadContract = new Contract(
  addresses.arbitrumBridge,
  abis.Bridge,
  new providers.JsonRpcProvider(addresses.arbitrumRpcURL)
);
const CyOpL2ReadContract = new Contract(
  addresses.arbitrumCyOp,
  abis.CyOp,
  new providers.JsonRpcProvider(addresses.arbitrumRpcURL)
);
const arbDAOReadContract = new Contract(
  addresses.arbitrumDAO,
  abis.DAO,
  new providers.JsonRpcProvider(addresses.arbitrumRpcURL)
);
const CycleContract = new Contract(addresses.Cycle, abis.Cycle, new providers.JsonRpcProvider(addresses.rpcURL));
const UniswapRouter = new Contract(
  addresses.UniswapRouter,
  abis.UniswapRouterV2,
  new providers.JsonRpcProvider(addresses.rpcURL)
);
const uNFT = new Contract(addresses.uNFT, abis.uNFT, new providers.JsonRpcProvider(addresses.rpcURL));


const Provider: FC = ({ children }) => {
  const { wallet, walletAddress, chainId } = useWeb3();
  const [CyOp, setCyOp] = useState(new Contract(addresses.CyOp, abis.CyOp));
  const [DAO, setDAO] = useState(new Contract(addresses.DAO, abis.DAO));
  const [DAOL2, setDAOL2] = useState(new Contract(addresses.arbitrumDAO, abis.DAO));
  const [Vault, setVault] = useState(new Contract(addresses.Vault, abis.Vault));
  const [CyOpL2, setCyOpL2] = useState(new Contract(addresses.arbitrumCyOp, abis.CyOp));
  const [BridgeL2, setBridgeL2] = useState(new Contract(addresses.arbitrumBridge, abis.Bridge));
  const [cycleContractWithSigner, setCycleContractWithSigner] = useState(new Contract(addresses.Cycle, abis.Cycle));
  const [Distributor, setDistributor] = useState(new Contract(addresses.Distributor, abis.Distributor));
  const [currentCycle, setCurrentCycle] = useState(null);
  const [currentCycleDetails, setCurrentCycleDetails] = useState(null);
  const [previousCycleDetails, setPreviousCycleDetails] = useState(null);
  const [currentCyclePeriod, setCurrentCyclePeriod] = useState(null);
  const [cyops, setCyOps] = useState<ICyOpNode[] | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!!wallet) {
        if (!CyOp.signer) {
          setCyOp(CyOp.connect(wallet));
        }
        if (!CyOpL2.signer) {
          setCyOpL2(CyOpL2.connect(wallet));
        }
        if (!DAO.signer) {
          setDAO(DAO.connect(wallet));
        }
        if (!DAOL2.signer) {
          setDAOL2(DAOL2.connect(wallet));
        }
        if (!Vault.signer) {
          setVault(Vault.connect(wallet));
        }
        if (!BridgeL2.signer) {
          setBridgeL2(BridgeL2.connect(wallet));
        }
        if (!Distributor.signer) {
          setDistributor(Distributor.connect(wallet));
        }
        if (!cycleContractWithSigner.signer) {
          setCycleContractWithSigner(cycleContractWithSigner.connect(wallet));
        }
      }
    };

    init();
  }, [wallet, CyOp, DAO, DAOL2, Vault, CyOpL2, BridgeL2]);

  useEffect(() => {
    const getCurrentCycleIndex = async () => {
      if (CycleContract != null) {
        const currentCycleIndex = await CycleContract.currentCycleIndex();
        setCurrentCycle(currentCycleIndex);
      }
    };

    getCurrentCycleIndex();
  }, [CycleContract]);

  useEffect(() => {
    const getCycleDetails = async () => {
      if (currentCycle == null) return;
      let details = await CycleContract.cycles(currentCycle);
      const period = await CycleContract.cyclePeriod();
      setCurrentCycleDetails(details);
      setCurrentCyclePeriod(period);
      if (currentCycle - 1 > 0) {
        details = await CycleContract.cycles(currentCycle - 1);
        setPreviousCycleDetails(details);
      }
    };
    getCycleDetails();
  }, [currentCycle]);

  const createProposal = async (
    project: string,
    pair: string,
    slippage: BigNumber,
    description: string,
    name: string,
    amount: string,
    layer: string = "L2"
  ) => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer || !wallet) return null;
    if (chainId !== networkID) return null;

    try {
      // const DAOWithSigner = DAO.connect(wallet as JsonRpcSigner)
      await useDAO.createProposal(project, pair, slippage, description, name, amount);
      return true;
    } catch (err) {
      console.log("createProposal error:", err);
      return null;
    }
  };

  const particpiate = async (project: string, vote: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer || !wallet) return null;
    if (chainId !== networkID) return null;

    try {
      return useDAO.particpiate(project, vote);
    } catch (err) {
      console.log("particpiate error:", err);
      return null;
    }
  };

  const getAllProposals = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const result = await useDAO.getAllProposals();
      return result;
    } catch (err) {
      console.log("getAllProposals error:", err);
      return null;
    }
  };

  const getVoteCountForAllProposals = async (round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const result = await useDAO.getVoteCountForAllProposals(round);
      return result;
    } catch (err) {
      console.log("getVoteCountForAllProposals", err);
      return null;
    }
  };

  const proposalInfo = async (proposal: string, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const result = await useDAO.proposalInfo(proposal);
      return result;
    } catch (err) {
      console.log("proposalInfo error:", err);
      return null;
    }
  };

  const proposalList = async (proposalId: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const proposal = await useDAO.proposalList(proposalId);
      return proposal;
    } catch (err) {
      console.log("proposalList error:", err);
      return null;
    }
  };

  const getWinningProposal = async (round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== addresses.networkID) return null;

    try {
      const result = await useDAO.getWinningProposal(round);
      return {
        project: result._project as string,
        maxVote: result._maxVote as BigNumber
      };
    } catch (err) {
      console.log("getWinningProposal error:", err);
      return null;
    }
  };

  const stake = async (amount: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer || !wallet) return null;
    if (chainId !== networkID) return null;

    try {
      const DAOWithSigner = useDAO.connect(wallet as JsonRpcSigner);
      return DAOWithSigner.stake(amount);
    } catch (err) {
      console.log("stake error:", err);
      return null;
    }
  };

  const approve = async (spender: string, amount: BigNumber, layer: string = "L2") => {
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;
    const CyOpType = layer === "L2" ? CyOpL2 : CyOp;

    if (!walletAddress || !CyOpType.signer || !wallet) return null;
    if (chainId !== networkID) return null;

    try {
      const CyOpWithSigner = CyOpType.connect(wallet as JsonRpcSigner);
      return await CyOpWithSigner.approve(spender, amount);
    } catch (err) {
      console.log("approve error:", err);
      return null;
    }
  };

  const allowance = async (owner: string, spender: string, layer: string = "L2") => {
    const CyOpType = layer === "L2" ? CyOpL2 : CyOp;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !CyOpType.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const amount = await CyOpType.allowance(owner, spender);
      return amount;
    } catch (err) {
      console.log("allowance error:", err);
      return null;
    }
  };

  const unstake = async (amount: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer || !wallet) return null;
    if (chainId !== networkID) return null;

    try {
      const DAOWithSigner = useDAO.connect(wallet as JsonRpcSigner);
      return DAOWithSigner.unstake(amount);
    } catch (err) {
      console.log("unstake error:", err);
      return err;
    }
  };

  const claimRewards = async (round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer || !wallet) return null;
    if (chainId !== networkID) return null;

    try {
      const DAOWithSigner = useDAO.connect(wallet as JsonRpcSigner);
      const wholeNumber = await DAOWithSigner.claimRewards(round);
      return wholeNumber;
    } catch (err) {
      console.log("claimRewards error:", err);
      return null;
    }
  };

  const userClaimAmount = async (account: string, round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const claimAmount = await useDAO.userClaimAmount(account, round);
      return claimAmount;
    } catch (err) {
      console.log("userClaimAmount error:", err);
      return null;
    }
  };

  const isUserEligibleToClaim = async (account: string, round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const isEligible = await useDAO.isUserEligibleToClaim(account, round);
      return isEligible;
    } catch (err) {
      console.log("isUserEligibleToClaim error:", err);
      return null;
    }
  };

  const getUserVotingShare = async (account: string, round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const userVotingShare = await useDAO.getUserVotingShare(account, round);
      return userVotingShare;
    } catch (err) {
      console.log("getUserVotingShare error:", err);
      return null;
    }
  };

  const getProposalWon = async (round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const project = await useDAO.getProposalWon(round);
      return project;
    } catch (err) {
      console.log("getProposalWon error:", err);
      return null;
    }
  };

  const isUserVoted = async (account: string, round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const isVoted = await useDAO.isUserVoted(account, round);
      return isVoted;
    } catch (err) {
      console.log("isUserVoted error:", err);
      return null;
    }
  };

  const userVoteCount = async (account: string, round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const voteCount = await useDAO.userVoteCount(account, round);
      return voteCount;
    } catch (err) {
      console.log("userVoteCount error:", err);
      return null;
    }
  };

  const totalUserVoted = async (round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const voteUserCount = await useDAO.totalUserVoted(round);
      return voteUserCount;
    } catch (err) {
      console.log("totalUserVoted error:", err);
      return null;
    }
  };

  const getProposalVoteCount = async (project: string, round: BigNumber, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const proposalVoteCount = await useDAO.getProposalVoteCount(project, round);
      return proposalVoteCount;
    } catch (err) {
      console.log("getProposalVoteCount error:", err);
      return null;
    }
  };

  const stakeAmount = async (account: string, layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const amount = await useDAO.stakeAmount(account);
      return amount;
    } catch (err) {
      console.log("stakeAmount error:", err);
      return null;
    }
  };

  const balanceOf = async (layer: string = "L2") => {
    const CyOpType = layer === "L2" ? CyOpL2 : CyOp;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !CyOpType.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const balance = await CyOpType.balanceOf(walletAddress);
      return balance as BigNumber;
    } catch (err) {
      console.log("balanceOf error:", err);
      return null;
    }
  };

  const balanceOfWallet = async (address: string) => {
    try {
      const balance = await CyOp.balanceOf(address);
      return balance as BigNumber;
    } catch (err) {
      console.log("balanceOf error:", err);
      return null;
    }
  };

  const totalSupply = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const supply = await useDAO.totalSupply();
      return supply as BigNumber;
    } catch (err) {
      console.log("totalSupply error:", err);
      return null;
    }
  };

  const erc20TotalSupply = async (layer: string = "L2") => {
    const CyOpType = layer === "L2" ? CyOpL2 : CyOp;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !CyOpType.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const supply = await CyOpType.totalSupply();
      return supply as BigNumber;
    } catch (err) {
      console.log("erc20TotalSupply error:", err);
      return null;
    }
  };

  const userCount = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const count = await useDAO.userCount();
      return count as BigNumber;
    } catch (err) {
      console.log("userCount error:", err);
      return null;
    }
  };

  const proposalCount = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const count = await useDAO.proposalCount();
      return count as BigNumber;
    } catch (err) {
      console.log("proposalCount error:", err);
      return null;
    }
  };

  const round = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const _round = await useDAO.round();
      return _round as BigNumber;
    } catch (err) {
      console.log("round error:", err);
      return null;
    }
  };

  const voteStartTime = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const time = await useDAO.voteStartTime();
      return time as BigNumber;
    } catch (err) {
      // console.log('voteStartTime error:', err);
      return null;
    }
  };

  const readVoteStartTime = async () => {
    try {
      const time = await arbDAOReadContract.voteStartTime();
      return time as BigNumber;
    } catch (err) {
      console.log("voteStartTime error:", err);
      return null;
    }
  };

  const resultTime = async (layer: string = "L2") => {
    const useDAO = layer === "L2" ? DAOL2 : DAO;
    const networkID = layer === "L2" ? addresses.arbitrumNetworkID : addresses.networkID;

    if (!walletAddress || !useDAO.signer) return null;
    if (chainId !== networkID) return null;

    try {
      const time = await useDAO.resultTime();
      return time as BigNumber;
    } catch (err) {
      console.log("resultTime error:", err);
      return null;
    }
  };

  const readResultTime = async (layer: string = "L2") => {
    try {
      const time = await arbDAOReadContract.resultTime();
      return time as BigNumber;
    } catch (err) {
      console.log("resultTime error:", err);
      return null;
    }
  };

  // vault methods
  const vaultDeposit = async (amount: BigNumber) => {
    if (!walletAddress || !Vault.signer || !wallet) return null;
    if (chainId !== addresses.networkID) return null;

    try {
      const VaultWithSigner = Vault.connect(wallet as JsonRpcSigner);
      return await VaultWithSigner.deposit(amount);
    } catch (err) {
      console.log("approve error:", err);
      return null;
    }
  };

  const vaultWithdraw = async (
    amount: BigNumber,
    deadline: BigNumber,
    v: number,
    r: string,
    s: string,
    layer: string = "L2"
  ) => {
    if (!walletAddress || !Vault.signer || !wallet) return null;
    if (chainId !== addresses.networkID) return null;

    try {
      const VaultWithSigner = Vault.connect(wallet as JsonRpcSigner);
      return VaultWithSigner.withdraw(amount, deadline, v, r, s);
    } catch (err) {
      console.log("approve error:", err);
      return null;
    }
  };

  const vaultUserInfo = async (user: string) => {
    try {
      return await VaultReadContract.userInfo(user);
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };

  const vaultNonces = async (user: string) => {
    try {
      return await VaultReadContract.nonces(user);
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };

  const vaultTrustedSigner = async (user: string) => {
    try {
      return await VaultReadContract.trustedSigner(user);
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };

  // const approveL2 = async (spender: string, amount: BigNumber) => {
  //   if (!walletAddress || !CyOpL2.signer || !wallet) return null;
  //   if (chainId !== addresses.arbitrumNetworkID) return null;

  //   try {
  //     const CyOpWithSigner = CyOpL2.connect(wallet as JsonRpcSigner);
  //     return await CyOpWithSigner.approve(spender, amount);
  //   } catch (err) {
  //     console.log("approve error:", err);
  //     return null;
  //   }
  // };

  // const allowanceL2 = async (owner: string, spender: string) => {
  //   if (!walletAddress || !CyOpL2.signer) return null;
  //   if (chainId !== addresses.arbitrumNetworkID) return null;

  //   try {
  //     const amount = await CyOpL2.allowance(owner, spender);
  //     return amount;
  //   } catch (err) {
  //     console.log("allowance error:", err);
  //     return null;
  //   }
  // };

  const balanceOfL2 = async () => {
    try {
      const balance = await CyOpL2ReadContract.balanceOf(walletAddress);
      return balance as BigNumber;
    } catch (err) {
      console.log("balanceOf error:", err);
      return null;
    }
  };

  const bridgeNoncesL2 = async (user: string) => {
    try {
      return await BridgeReadContract.nonces(user);
    } catch (err) {
      console.log("Error:", err);
      return null;
    }
  };

  const bridgeMoveBackL2 = async (amount: BigNumber) => {
    if (!walletAddress || !BridgeL2.signer || !wallet) return null;
    if (chainId !== addresses.arbitrumNetworkID) return null;
    try {
      const BridgeL2WithSigner = BridgeL2.connect(wallet as JsonRpcSigner);
      return await BridgeL2WithSigner.moveBack(amount);
    } catch (err) {
      console.log("approve error:", err);
      return null;
    }
  };

  const bridgeClaimL2 = async (claimAmount: BigNumber, deadline: BigNumber, v: number, r: string, s: string) => {
    if (!walletAddress || !BridgeL2.signer || !wallet) return null;
    if (chainId !== addresses.arbitrumNetworkID) return null;
    try {
      const BridgeL2WithSigner = BridgeL2.connect(wallet as JsonRpcSigner);
      return BridgeL2WithSigner.claim(claimAmount, deadline, v, r, s);
    } catch (err) {
      console.log("Bridge claim error:", err);
      return null;
    }
  };

  const bridgeUserInfoL2 = async (user: string) => {
    try {
      return await BridgeReadContract.userInfo(user);
    } catch (err) {
      console.log("approve error:", err);
      return null;
    }
  };

  const bridgeTrustedSigner = async (user: string) => {
    try {
      return await BridgeReadContract.trustedSigner(user);
    } catch (err) {
      console.log("approve error:", err);
      return null;
    }
  };

  const balanceOfErc20 = async (
    contractAddress: string,
    walletAddress: string,
    layer: string = "L2",
    format: boolean = true,
    decimals: number | null = null
  ) => {
    const rpcURL = layer === "L2" ? addresses.arbitrumRpcURL : addresses.rpcURL;
    const erc20ReadContract = new Contract(contractAddress, abis.IERC20, new providers.JsonRpcProvider(rpcURL));
    const balance = await erc20ReadContract.balanceOf(walletAddress);

    if (format) {
      if (!decimals) {
        const decimal = await erc20ReadContract.decimals();
        return utils.formatUnits(balance.toString(), decimal);
      } else {
        return utils.formatUnits(balance.toString(), decimals);
      }
    } else {
      return balance;
    }
  };

  const balanceOfUNFT = async () => {
    const networkID = addresses.networkID;

    if (chainId !== networkID) return null;

    try {
      const balance = await uNFT.balanceOf(walletAddress);
      return balance as BigNumber;
    } catch (err) {
      console.log("balanceOfUNFT error:", err);
      return null;
    }
  };

  const getCycleDetails = async (cycleIndex: number | string) => {
    const details = await CycleContract.cycles(cycleIndex);
    return details;
  };

  const endCurrentCycle = async () => {
    if (!cycleContractWithSigner.signer) return;
    await cycleContractWithSigner.endCycle();
  };

  const getStakersTotalReward = async (stakerType: number, cycleIndex: number | string) => {
    if (stakerType === 0) {
      return (await Distributor.cycleFunds(cycleIndex)).cyopStakersAmount;
    } else if (stakerType === 1) {
      return (await Distributor.cycleFunds(cycleIndex)).uNFTStakersAmount;
    } else {
      return 0;
    }
  };

  const getDistributorKeptAmount = async (cycleIndex: number | string) => {
    return (await Distributor.cycleFunds(cycleIndex)).nextRoundAmount;
  }

  const distributePrizes = async (encodedData: string) => {
    // TODO: Change the gasLimit.
    const tx = await Distributor.distributePrizes(encodedData, { gasLimit: 1000000 });
    return await tx.wait();
  };

  const claimReward = async (data: string, encodedData: string, signature: string) => {
    const tx = await Distributor.claimReward(data, encodedData, signature, { gasLimit: 500000 });
    return await tx.wait();
  };

  const getUserNFTs = async (walletAddress: string) => {
    if (!uNFT) return;
    const balance = await uNFT.balanceOf(walletAddress);
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await uNFT.tokenOfOwnerByIndex(walletAddress, i);
      tokenIds.push(tokenId);
    }
    return tokenIds;
  };

  return (
    <Context.Provider
      value={{
        createProposal,
        particpiate,
        getAllProposals,
        getVoteCountForAllProposals,
        proposalInfo,
        proposalList,
        getWinningProposal,
        stake,
        approve,
        allowance,
        unstake,
        claimRewards,
        userClaimAmount,
        getUserVotingShare,
        isUserEligibleToClaim,
        getProposalWon,
        isUserVoted,
        userVoteCount,
        totalUserVoted,
        getProposalVoteCount,
        stakeAmount,
        balanceOf,
        balanceOfWallet,
        totalSupply,
        erc20TotalSupply,
        userCount,
        proposalCount,
        round,
        voteStartTime,
        resultTime,
        vaultNonces,
        vaultDeposit,
        vaultWithdraw,
        vaultUserInfo,
        vaultTrustedSigner,
        balanceOfL2,
        bridgeNoncesL2,
        bridgeMoveBackL2,
        bridgeClaimL2,
        bridgeUserInfoL2,
        bridgeTrustedSigner,
        balanceOfErc20,
        readVoteStartTime,
        readResultTime,
        balanceOfUNFT,
        currentCycle,
        currentCycleDetails,
        previousCycleDetails,
        currentCyclePeriod,
        cyops,
        setCyOps,
        getCycleDetails,
        getStakersTotalReward,
        distributePrizes,
        claimReward,
        UniswapRouter,
        endCurrentCycle,
        getUserNFTs,
        getDistributorKeptAmount
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;

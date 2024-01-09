import axios from "axios";
import urls from "./urls";

export const postVote = async (sigData: {
  walletAddress: string;
  message: { [key: string]: any };
  signature: string;
}) => {
  return await axios.post(
    urls.vote,
    {
      walletAddress: sigData.walletAddress,
      message: sigData.message,
      signature: sigData.signature
    },
    { headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! } }
  );
};

export const getFilteredCyOpsTo = async (currentCycle: string) => {
  return await axios.get(urls.cyopsFilteredTo, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { cycleIndex: currentCycle }
  });
};

export const getCyOps = async () => {
  return await axios.get(urls.cyops, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! }
  });
};

export const getCyop = async (cyopId: string, cycleIndex: string | null = null) => {
  let filter: any = { cyopId: cyopId };
  if (cycleIndex) {
    filter.cycleIndex = cycleIndex;
  }
  return await axios.get(urls.cyoperation, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { ...filter }
  });
};

export const login = async (sigData: { walletAddress: string; message: { [key: string]: any }; signature: string }) => {
  return await axios.post(
    urls.login,
    {
      walletAddress: sigData.walletAddress,
      message: sigData.message,
      signature: sigData.signature
    },
    { headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! } }
  );
};

export const getUser = async (walletAddress: string) => {
  return await axios.get(urls.users, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { walletAddress: walletAddress }
  });
};

export const getVotes = async (data: {
  walletAddress?: string | undefined;
  cycleIndex?: string | undefined;
  cyoperation?: string | undefined;
  limit?: number | undefined;
}) => {
  return await axios.get(urls.votes, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { ...data }
  });
};

export const getFilteredVotes = async (data: {
  walletAddress?: string | undefined;
  cycleIndex?: string | undefined;
  cyoperation?: string | undefined;
}) => {
  return await axios.get(urls.votesFiltered, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { ...data }
  });
};

export const getWinningProposals = async (cycleIndex: string | number) => {
  return await axios.get(urls.winningCyOps, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { cycleIndex: cycleIndex }
  });
};

export const getAllWinningCyOps = async () => {
  return await axios.get(urls.allWinners, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! }
  });
};

export const getUserRewards = async (walletAddress: string) => {
  return await axios.get(urls.rewards, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { walletAddress: walletAddress }
  });
};

export const getTotalAmount = async (cycleIndex: number) => {
  return await axios.get(urls.totalAmount, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { cycleIndex: cycleIndex }
  });
};

export const getParticipation = async (walletAddress: string, cycleIndex: string | number) => {
  return await axios.get(urls.participations, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { walletAddress: walletAddress, cycleIndex: cycleIndex }
  });
};

export const getTicket = async (sigData: {
  walletAddress: string;
  message: { [key: string]: any };
  signature: string;
}, stakingType: number) => {
  return await axios.post(
    urls.getTicket,
    {
      walletAddress: sigData.walletAddress,
      message: sigData.message,
      signature: sigData.signature,
      stakingType: stakingType
    },
    { headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! } }
  );
};

export const createCyoperation = async (
  sigData: { walletAddress: string; message: { [key: string]: any }; signature: string },
  cyop: any
) => {
  return await axios.post(
    urls.addCyoperation,
    {
      walletAddress: sigData.walletAddress,
      message: sigData.message,
      signature: sigData.signature,
      proposal: cyop
    },
    { headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! } }
  );
};

export const getCycleResults = async (cycleIndex: number) => {
  return await axios.get(urls.cycleResults, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { cycleIndex: cycleIndex }
  });
};

export const computeWinners = async (
  sigData: { walletAddress: string; message: { [key: string]: any }; signature: string },
  cycleIndex: number
) => {
  return await axios.post(
    urls.computeWinners,
    {
      walletAddress: sigData.walletAddress,
      message: sigData.message,
      signature: sigData.signature,
      cycleIndex: cycleIndex
    },
    { headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! } }
  );
};

export const getActiveNfts = async () => {
  return await axios.get(urls.activeUnfts, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! }
  });
};

export const getUnftsMetadata = async (tokenIds: Array<number>) => {
  return await axios.get(urls.unftsMetadata, {
    headers: { "x-api-key": process.env.REACT_APP_BACKEND_API_KEY! },
    params: { tokenIds: tokenIds }
  });
};

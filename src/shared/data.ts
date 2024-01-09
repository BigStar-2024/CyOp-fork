import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import addresses from "./addresses";
import abis from "./abis";
import { Contract, providers } from "ethers";
import axios from "axios";
import { decimals } from "./constants";
import { formatUnits } from "ethers/lib/utils";

(async () => {
  await Moralis.start({
    apiKey: process.env.REACT_APP_MORALIS_API_KEY
  });
})();

const FETCH_PERIOD = 10 * 60 * 100;
const data: any = {
  cyopUsd: {
    value: 0,
    lastFetchedAt: 0
  },
  holdingTokens: {
    value: [],
    lastFetchedAt: 0
  },
  cyopEthReserves: {
    value: {
      cyopReserves: 0,
      ethReserves: 0
    },
    lastFetchedAt: 0
  },
  totalRewards: {
    value: 0,
    lastFetchedAt: 0
  },
  totalUnftRewards: {
    value: 0,
    lastFetchedAt: 0
  },
  totalBurned: {
    value: 0,
    lastFetchedAt: 0
  },
  totalCyOpProcessed: {
    value: 0,
    lastFetchedAt: 0
  }
};

export const getCyOpPriceInUsd = async (chain: any = EvmChain.ETHEREUM) => {
  if (Date.now() - data.cyopUsd.lastFetchedAt < FETCH_PERIOD) {
    return data.cyopUsd.value;
  }

  const address = chain._value === "0x1" ? "0xddaC9C604BA6Bc4ACEc0FBB485B83f390ECF2f31" : addresses.CyOp;
  const response: any = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain
  });
  const rate = response?.jsonResponse?.usdPrice;

  if (rate) {
    data.cyopUsd.lastFetchedAt = Date.now();
    data.cyopUsd.value = rate;
    return rate;
  } else {
    return data.cyopUsd.value;
  }
};

export const getTokenPriceInUsd = async (address: string, chain: any = EvmChain.ETHEREUM) => {
  let lastFetchedAt = 0;
  let rate = 1;

  if (address in data && "lastFetchedAt" in data[address]) {
    lastFetchedAt = data[address].lastFetchedAt;
  } else {
    data[address] = {
      value: 0,
      lastFetchedAt: 0
    };
  }

  if (Date.now() - lastFetchedAt < FETCH_PERIOD) {
    return data[address]["value"];
  }

  if (chain._value === "0x1") {
    const response: any = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain
    });
    rate = response?.jsonResponse?.usdPrice;
  } else {
    rate = 1;
  }

  if (rate) {
    data[address]["lastFetchedAt"] = Date.now();
    data[address]["value"] = rate;
    return rate;
  } else {
    return data[address]["value"];
  }
};

export const getWalletTokens = async (wallet: string, chain: EvmChain = EvmChain.ETHEREUM) => {
  if (Date.now() - data.holdingTokens.lastFetchedAt < FETCH_PERIOD) {
    return data.holdingTokens.value;
  }

  const response: any = await Moralis.EvmApi.token.getWalletTokenBalances({ chain: chain.decimal, address: wallet });
  const tokenData = response?.jsonResponse;

  if (tokenData) {
    data.holdingTokens.lastFetchedAt = Date.now();
    data.holdingTokens.value = tokenData;
    return tokenData;
  } else {
    return data.holdingTokens.value;
  }
};

export const getCyOpEthReserves = async () => {
  if (Date.now() - data.cyopEthReserves.lastFetchedAt < FETCH_PERIOD) {
    return data.cyopEthReserves.value;
  }

  const pairAddress = "0x1b1c28A89cAAc877C63d0adaC173a0B55921AB65";
  const PairContract = new Contract(
    pairAddress,
    abis.UniswapPair,
    new providers.JsonRpcProvider("https://rpc.ankr.com/eth")
  );
  const reserves = await PairContract.getReserves();
  if (reserves) {
    const ethReserves = reserves[0];
    const cyopReserves = reserves[1];
    data.cyopEthReserves.value = {
      cyopReserves: cyopReserves,
      ethReserves: ethReserves
    };
    data.cyopEthReserves.lastFetchedAt = Date.now();
    return data.cyopEthReserves.value;
  } else {
    return data.cyopEthReserves.value;
  }
};

export const getTotalRewards = async () => {
  if (Date.now() - data.totalRewards.lastFetchedAt < FETCH_PERIOD) {
    return data.totalRewards.value;
  }

  try {
    const contract = new Contract(
      addresses.Distributor,
      abis.Distributor,
      new providers.JsonRpcProvider(addresses.rpcURL)
    );
    const totalRewards = (await contract.totalFunds()).rewards;

    if (totalRewards) {
      data.totalRewards.value = totalRewards;
      data.totalRewards.lastFetchedAt = Date.now();
      return data.totalRewards.value;
    } else {
      return data.totalRewards.value;
    }
  } catch (e) {
    return data.totalRewards.value;
  }
};

export const getTotalUnftRewards = async () => {
  if (Date.now() - data.totalUnftRewards.lastFetchedAt < FETCH_PERIOD) {
    return data.totalUnftRewards.value;
  }

  try {
    const contract = new Contract(
      addresses.Distributor,
      abis.Distributor,
      new providers.JsonRpcProvider(addresses.rpcURL)
    );
    const totalUnftRewards = (await contract.totalFunds()).uNFTRewards;

    if (totalUnftRewards) {
      data.totalUnftRewards.value = totalUnftRewards;
      data.totalUnftRewards.lastFetchedAt = Date.now();
      return data.totalUnftRewards.value;
    } else {
      return data.totalUnftRewards.value;
    }
  } catch (e) {
    return data.totalUnftRewards.value;
  }
};

export const getTotalBurned = async () => {
  if (Date.now() - data.totalBurned.lastFetchedAt < FETCH_PERIOD) {
    return data.totalBurned.value;
  }

  try {
    const contract = new Contract(
      addresses.Distributor,
      abis.Distributor,
      new providers.JsonRpcProvider(addresses.rpcURL)
    );
    const totalBurned = (await contract.totalFunds()).cyopBurnedConverted;

    if (totalBurned) {
      data.totalBurned.value = totalBurned;
      data.totalBurned.lastFetchedAt = Date.now();
      return data.totalBurned.value;
    } else {
      return data.totalBurned.value;
    }
  } catch (e) {
    return data.totalBurned.value;
  }
};

export const getTotalCyOpProcessed = async () => {
  if (Date.now() - data.totalCyOpProcessed.lastFetchedAt < FETCH_PERIOD) {
    return data.totalCyOpProcessed.value;
  }

  const query = {
    query: `{
      ethereum(network: ethereum) {
        out: transfers(
          currency: {is: "0xddaC9C604BA6Bc4ACEc0FBB485B83f390ECF2f31"}
        ) {
          buys: amount(calculate: sum)
          sells: amount(calculate: sum)
          }
        }
      }`
  };
  const cfg = {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "BQYsXpC6k9kzXW915jB5SxJ24WEl3KYW"
    },
    query: query
  };
  const res = await axios.post("https://graphql.bitquery.io/", JSON.stringify(query), cfg);
  if (res && res.status === 200) {
    data.totalCyOpProcessed.value =
      parseInt(
        formatUnits(
          parseInt(res.data.data.ethereum.out[0].buys, 10) + parseInt(res.data.data.ethereum.out[0].sells, 10),
          decimals.CyOp
        ),
        10
      ) * (await getCyOpPriceInUsd());
    data.totalCyOpProcessed.lastFetchedAt = Date.now();
  } else {
    return data.totalCyOpProcessed.value;
  }
};

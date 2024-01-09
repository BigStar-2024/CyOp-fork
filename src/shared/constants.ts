import { BigNumber } from "ethers";

export const decimals = {
    CyOp: parseInt(process.env.REACT_APP_CYOP_DECIMALS!, 10),
    USDC: parseInt(process.env.REACT_APP_USDC_DECIMALS!, 10),
    ETH: 18
};

export const cyop = {
    totalSupply: BigNumber.from("100000000000000000000000")
};

export const apis = {
    infuraId: process.env.REACT_APP_INFURA_ID!
};

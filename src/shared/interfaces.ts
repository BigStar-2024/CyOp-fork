import { BigNumber } from 'ethers';
import { ReactNode } from 'react';

export interface ICyOpNode {
    _id: string | number;
    title: string;
    description: string;
    percent: number;
    children?: ReactNode[];
    detailedDescription: string;
    youtubeId: string;
    type: string;
    link: string;
    address: string;
    creationDate: number;
    isMarketed: boolean;
    isMasked: boolean;
}

export interface ICyOp {
    _id: string;
    description: string;
    type: string;
    percent: number;
    title: string;
    isMasked: boolean;
}

export interface IUserVote {
    _id: string;
    datetime: Date;
    user: string;
    walletAddress: string;
    cyoperation: string;
    cyoperationName: string;
    cycle: string;
    power: string | null;
    balanceUsed: string | null;
    skill: any | null;
};

export interface ICycleDetails {
    startBlock: BigNumber;
    endBlock: BigNumber;
    endTime: BigNumber;
    isFinished: boolean;
};

export interface IReward {
    user: string;
    rewardType: number;
    cycleIndex: number;
    startCyOpAmount: string;
    endCyOpAmount: string;
    startUNFTAmount: string;
    endUNFTAmount: string;
    isClaimed: boolean;
};

export interface ICycleResults {
    cycleIndex: number | BigNumber;
    totalCyOpAmount: string | BigNumber;
    totalUNFTAmount: string | BigNumber;
    firstPlaceAddress: string;
    secondPlaceAddress: string;
    thirdPlaceAddress: string;
    luckyUser: string;
    isFirstPlaceToken: boolean;
    isSecondPlaceToken: boolean;
    isThirdPlaceToken: boolean;
    firstPlacePath: Array<string>;
    secondPlacePath: Array<string>;
    thirdPlacePath: Array<string>;
    dexRouters: Array<string>;
};

export interface INFT {
    attributes: {
        trait_type: string;
        value: string;
    }[];
    description: string;
    fullsize: string;
    image: string;
    name: string;
    powerId: number;
    tokenId: string;
};

export interface IUser {
    _id: string;
    address: string;
    rating: number;
    rank: string;
    lastActiveCycle: number;
};

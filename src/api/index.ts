export * from "./apis";
export * from "./generated";

//TODO: remove types
export enum VaultPlatform {
  Jupiter = "Jupiter",
  Kamino = "Kamino",
}

export interface VaultInfoResponse {
  apy: number;
  assetPrice: number;
  tvl: number;
  yardReward: number;
  id: string;
  name: string;
  platform: string;
  token: string;
  description: string;
}

export interface StrategyInfoResponse {
  strategyName: string;
  strategyId: string;
  strategyApy: number;
  strategyDepositedAmount: number;
  strategyTvl: number;
  vaults: {
    token: string;
    id: string;
    name: string;
    platform: string;
    tvl: number;
    apy: number;
    depositedAmount: number;
  }[];
}

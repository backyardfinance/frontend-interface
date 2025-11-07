import type { TokenInfoResponse } from "./generated";

export * from "./apis";
export * from "./generated";

//TODO: remove types
export enum VaultPlatform {
  Jupiter = "Jupiter",
  Kamino = "Kamino",
}

export interface UserTokenView {
  mint: string;
  isNative: boolean;
  decimals: number;
  amountUi: number;
  name?: string;
  symbol?: string;
  logoURI?: string;
  priceUsd?: number;
  valueUsd?: number;
}

export interface UserPortfolioView {
  tokens: TokenInfoResponse[];
  totalValueUsd: number;
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
  publicKey?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string[];
  statusCode: number;
}

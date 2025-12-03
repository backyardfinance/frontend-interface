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
  name: string;
  decimals: number;
  symbol: string;
  icon: string;
  usdPrice: number;
  amount: bigint;
  amountUsd: number;
  uiAmount: number;
}

export interface UserPortfolioView {
  tokens: TokenInfoResponse[];
  totalValueUsd: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

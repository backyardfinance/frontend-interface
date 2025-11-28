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
  message: string;
  statusCode: number;
}

//TODO: remove types
export interface VaultDepositDto {
  /**
   *
   * @type {string}
   * @memberof VaultDepositDto
   */
  vaultId: string;
  /**
   *
   * @type {string}
   * @memberof VaultDepositDto
   */
  amount: string;
}

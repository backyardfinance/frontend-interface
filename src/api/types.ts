//TODO: delete after the api is ready

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
  tokens: UserTokenView[];
  totalValueUsd: number;
}

export interface TokenInfoResponse {
  address: string;
  isNative: boolean;
  name: string;
  symbol: string;
  priceUsd?: number;
  logoURI?: string;
  valueUsd?: number;
  tokenAmount: TokenAmount;
}

export interface TokenAmount {
  amount: number;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

export interface VaultInfo {
  apy: number;
  assetPrice: number;
  tvl: number;
  yardReward: number;
  description: string;
}

export interface VaultInfoResponse extends VaultInfo {
  id: string;
  name: string;
  platform: VaultPlatform;
}

export interface VaultHistoryInfoResponse extends VaultInfo {
  recordedAt: Date;
}

export interface VaultInfoStrategyResponse extends VaultInfoResponse {
  strategies: UserStrategyInfoResponse[];
}

export interface UserStrategyInfoResponse {
  strategyId: string;
}

export interface StrategyVaultInfo {
  id: string;
  name: string;
  platform: string;
  tvl: number;
  apy: number;
  depositedAmount: number;
}

export interface StrategyInfoResponse {
  strategyName: string;
  strategyId: string;
  strategyApy: number;
  strategyDepositedAmount: number;
  strategyTvl: number;
  vaults: StrategyVaultInfo[];
}

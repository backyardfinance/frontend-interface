export type Platform = "Drift" | "Hylo" | "Jupyter" | "Synatra";

export interface Vault {
  id: string;
  title: string;
  vaultImage: string;
  platform: Platform;
  platformImage: string;
  tvl: number;
  apy: number;
  description: string;
  contractAddress: string;
}

export interface Strategy {
  id: string;
  vaults: Vault[];
  depositAmount: number;
}

export interface Asset {
  id: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

export interface User {
  balances: { [key: string]: Asset };
  strategies: Strategy[];
}

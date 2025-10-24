import type { Vault } from "@/api";

export interface Strategy {
  id: string;
  vaults: Vault[];
  depositAmount: bigint;
  allocation: number[];
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

export interface BackendStrategy {
  strategy: string;
  myPosition: number;
  apy: number;
  creator: {
    name: string;
    icon: string;
  };
  allocation: BackendAllocation[];
}

export interface BackendAllocation {
  token: string;
  weight: number;
}

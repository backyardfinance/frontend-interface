import type { TokenInfoResponse, VaultInfoResponse } from "@/api";

export interface Strategy {
  id: string;
  vaults: VaultInfoResponse[];
  depositAmount: number;
  allocation: number[];
}

export interface User {
  balances: { [key: string]: TokenInfoResponse };
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

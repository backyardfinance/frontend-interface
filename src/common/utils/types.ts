import type { VaultInfoResponse } from "@/api";

export interface Strategy {
  id: string;
  vaults: VaultInfoResponse[];
  depositAmount: number;
  allocation: number[];
}

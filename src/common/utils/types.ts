import type { VaultInfoResponse } from "@/api";

export interface Strategy {
  id: string;
  vaults: VaultInfoResponse[];
  depositAmount: number;
  totalAllocation: Record<string, number>;
}

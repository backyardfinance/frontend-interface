import type { VaultInfoResponse } from "@/api";

export interface Strategy {
  id: string;
  vaults: VaultInfoResponse[];
  amount: number;
  totalAllocation: Record<string, number>;
}

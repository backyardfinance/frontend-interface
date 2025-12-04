import type { VaultInfoResponse } from "@/api";
import type { Strategy } from "@/common/utils/types";

export const calculateVaultAmounts = (
  vaults: VaultInfoResponse[],
  totalAllocation: Record<string, number>,
  amount: number
): VaultInfoResponse[] => {
  return vaults.map((vault) => ({
    ...vault,
    amount: (amount / 100) * (totalAllocation[vault.id] || 0),
  }));
};

export const createEvenAllocation = (vaults: VaultInfoResponse[], vaultCount: number): Record<string, number> => {
  const allocation = vaults.map((vault) => ({ id: vault.id, allocation: 100 / vaultCount }));
  return vaultCount > 0 ? Object.fromEntries(allocation.map((value) => [value.id, value.allocation])) : {};
};

export const updateAmount = (strategy: Strategy, newamount: number): Strategy => {
  return {
    ...strategy,
    amount: newamount,
    vaults: calculateVaultAmounts(strategy.vaults, strategy.totalAllocation, newamount),
  };
};

export const updateAllocation = (strategy: Strategy, vaultId: string, newAllocationValue: number): Strategy => {
  const newTotalAllocation = strategy.totalAllocation;
  newTotalAllocation[vaultId] = newAllocationValue;

  return {
    ...strategy,
    totalAllocation: newTotalAllocation,
    vaults: calculateVaultAmounts(strategy.vaults, newTotalAllocation, strategy.amount),
  };
};

export const addVaultToStrategy = (strategy: Strategy | null, vault: VaultInfoResponse): Strategy => {
  const existingVaults = strategy?.vaults || [];
  const updatedVaults = [...existingVaults, vault];
  const newTotalAllocation = createEvenAllocation(updatedVaults, updatedVaults.length);

  return {
    id: strategy?.id || "",
    amount: strategy?.amount || 0,
    vaults: calculateVaultAmounts(updatedVaults, newTotalAllocation, strategy?.amount || 0),
    totalAllocation: newTotalAllocation,
  };
};

export const removeVaultFromStrategy = (strategy: Strategy, vaultId: string): Strategy => {
  const updatedVaults = strategy.vaults.filter((v) => v.id !== vaultId);
  const newTotalAllocation = createEvenAllocation(updatedVaults, updatedVaults.length);

  return {
    ...strategy,
    vaults: calculateVaultAmounts(updatedVaults, newTotalAllocation, strategy.amount),
    totalAllocation: newTotalAllocation,
  };
};

export const toggleVaultInStrategy = (strategy: Strategy | null, vault: VaultInfoResponse): Strategy => {
  const existingVaults = strategy?.vaults || [];
  const isVaultInStrategy = existingVaults.some((v) => v.id === vault.id);

  if (isVaultInStrategy) {
    return removeVaultFromStrategy(strategy as Strategy, vault.id);
  }

  return addVaultToStrategy(strategy, vault);
};

export const getTotalAllocation = (allocation: number[] | undefined): number => {
  return allocation?.reduce((acc, curr) => acc + curr, 0) || 0;
};

export const isStrategyValid = (strategy: Strategy | null): boolean => {
  if (!strategy) return false;

  const { amount, vaults } = strategy;
  const totalAllocation = Object.values(strategy.totalAllocation);
  const totalAllocationSum = totalAllocation.reduce((acc, curr) => acc + curr, 0);
  return amount > 0 && vaults.length > 0 && totalAllocation && totalAllocation.length > 0 && totalAllocationSum === 100;
};

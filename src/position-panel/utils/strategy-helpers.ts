import type { VaultInfoResponse } from "@/api";
import type { Strategy } from "@/common/utils/types";

export const calculateVaultAmounts = (
  vaults: VaultInfoResponse[],
  totalAllocation: Record<string, number>,
  depositAmount: number
): VaultInfoResponse[] => {
  return vaults.map((vault) => ({
    ...vault,
    amount: (depositAmount / 100) * (totalAllocation[vault.id] || 0),
  }));
};

export const createEvenAllocation = (vaults: VaultInfoResponse[], vaultCount: number): Record<string, number> => {
  const allocation = vaults.map((vault) => ({ id: vault.id, allocation: 100 / vaultCount }));
  return vaultCount > 0 ? Object.fromEntries(allocation.map((value) => [value.id, value.allocation])) : {};
};

export const updateDepositAmount = (strategy: Strategy, newDepositAmount: number): Strategy => {
  return {
    ...strategy,
    depositAmount: newDepositAmount,
    vaults: calculateVaultAmounts(strategy.vaults, strategy.totalAllocation, newDepositAmount),
  };
};

export const updateAllocation = (strategy: Strategy, vaultId: string, newAllocationValue: number): Strategy => {
  const newTotalAllocation = strategy.totalAllocation;
  newTotalAllocation[vaultId] = newAllocationValue;

  return {
    ...strategy,
    totalAllocation: newTotalAllocation,
    vaults: calculateVaultAmounts(strategy.vaults, newTotalAllocation, strategy.depositAmount),
  };
};

export const addVaultToStrategy = (strategy: Strategy | null, vault: VaultInfoResponse): Strategy => {
  const existingVaults = strategy?.vaults || [];
  const updatedVaults = [...existingVaults, vault];
  const newTotalAllocation = createEvenAllocation(updatedVaults, updatedVaults.length);

  return {
    id: strategy?.id || "",
    depositAmount: strategy?.depositAmount || 0,
    vaults: calculateVaultAmounts(updatedVaults, newTotalAllocation, strategy?.depositAmount || 0),
    totalAllocation: newTotalAllocation,
  };
};

export const removeVaultFromStrategy = (strategy: Strategy, vaultId: string): Strategy => {
  const updatedVaults = strategy.vaults.filter((v) => v.id !== vaultId);
  const newTotalAllocation = createEvenAllocation(updatedVaults, updatedVaults.length);

  return {
    ...strategy,
    vaults: calculateVaultAmounts(updatedVaults, newTotalAllocation, strategy.depositAmount),
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

  const { depositAmount, vaults } = strategy;
  const totalAllocation = Object.values(strategy.totalAllocation);
  const totalAllocationSum = totalAllocation.reduce((acc, curr) => acc + curr, 0);
  return (
    depositAmount > 0 &&
    vaults.length > 0 &&
    totalAllocation &&
    totalAllocation.length > 0 &&
    totalAllocationSum === 100
  );
};

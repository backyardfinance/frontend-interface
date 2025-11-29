import type { VaultInfoResponse } from "@/api";
import type { Strategy } from "@/common/utils/types";

export const calculateVaultAmounts = (
  vaults: VaultInfoResponse[],
  allocation: number[],
  depositAmount: number
): VaultInfoResponse[] => {
  return vaults.map((vault, index) => ({
    ...vault,
    amount: (depositAmount / 100) * (allocation[index] || 0),
  }));
};

export const createEvenAllocation = (vaultCount: number): number[] => {
  return vaultCount > 0 ? Array(vaultCount).fill(100 / vaultCount) : [];
};

export const updateDepositAmount = (strategy: Strategy, newDepositAmount: number): Strategy => {
  return {
    ...strategy,
    depositAmount: newDepositAmount,
    vaults: calculateVaultAmounts(strategy.vaults, strategy.allocation || [], newDepositAmount),
  };
};

export const updateAllocation = (strategy: Strategy, index: number, newAllocationValue: number): Strategy => {
  const newAllocation = [...(strategy.allocation || [])];
  newAllocation[index] = newAllocationValue;

  return {
    ...strategy,
    allocation: newAllocation,
    vaults: calculateVaultAmounts(strategy.vaults, newAllocation, strategy.depositAmount),
  };
};

export const addVaultToStrategy = (strategy: Strategy | null, vault: VaultInfoResponse): Strategy => {
  const existingVaults = strategy?.vaults || [];
  const updatedVaults = [...existingVaults, vault];
  const newAllocation = createEvenAllocation(updatedVaults.length);

  return {
    id: strategy?.id || "",
    depositAmount: strategy?.depositAmount || 0,
    vaults: calculateVaultAmounts(updatedVaults, newAllocation, strategy?.depositAmount || 0),
    allocation: newAllocation,
  };
};

export const removeVaultFromStrategy = (strategy: Strategy, vaultId: string): Strategy => {
  const updatedVaults = strategy.vaults.filter((v) => v.id !== vaultId);
  const newAllocation = createEvenAllocation(updatedVaults.length);

  return {
    ...strategy,
    vaults: calculateVaultAmounts(updatedVaults, newAllocation, strategy.depositAmount),
    allocation: newAllocation,
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

  const { depositAmount, allocation, vaults } = strategy;
  const totalAllocation = getTotalAllocation(allocation);

  return depositAmount > 0 && vaults.length > 0 && allocation && allocation.length > 0 && totalAllocation === 100;
};

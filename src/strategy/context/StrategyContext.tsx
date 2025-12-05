import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { UserTokenView, VaultInfoResponse } from "@/api";
import { localStorageService } from "@/common/utils/localStorageService";
import type { Strategy } from "@/common/utils/types";
import {
  addVaultToStrategy,
  removeVaultFromStrategy,
  toggleVaultInStrategy,
  updateAllocation,
  updateAmount,
} from "@/position-panel/utils/strategy-helpers";
import type { StrategyPosition, StrategyPositionVault } from "@/strategy/hooks/useStrategyPosition";

export interface WithdrawVault extends StrategyPositionVault {
  withdrawAmount: number;
  isActive: boolean;
  selectedAsset: UserTokenView;
}

export interface WithdrawStrategy extends Omit<Strategy, "vaults" | "depositAmount" | "totalAllocation"> {
  withdrawAmount: number;
  isWithdrawByVault: boolean;
  vaults: WithdrawVault[];
  selectedAsset: UserTokenView;
}

interface StrategyContextValue {
  depositStrategy: Strategy | null;
  setDepositStrategy: React.Dispatch<React.SetStateAction<Strategy | null>>;

  withdrawStrategy: WithdrawStrategy;
  setWithdrawStrategy: React.Dispatch<React.SetStateAction<WithdrawStrategy>>;

  slippage: number;
  handleSlippageChange: (slippage: number) => void;

  handleDepositAmountChange: (amount: number) => void;
  handleDepositAllocationChange: (vaultId: string, amount: number) => void;
  handleDepositRemoveVault: (vaultId: string) => void;
  handleDepositToggleVault: (vault: VaultInfoResponse) => void;
  handleDepositAddVault: (vault: VaultInfoResponse) => void;

  handleWithdrawAmountChange: (amount: number) => void;
  handleWithdrawByVaultChange: (isActive: boolean) => void;
  handleWithdrawSelectedAssetChange: (asset: UserTokenView) => void;
  handleWithdrawToggleVaultActive: (vaultId: string, isActive: boolean) => void;
  handleWithdrawVaultAmountChange: (vaultId: string, amount: number) => void;
  handleWithdrawVaultAssetChange: (vaultId: string, asset: UserTokenView) => void;

  resetDepositStrategy: () => void;
  resetWithdrawStrategy: () => void;
}

const StrategyContext = createContext<StrategyContextValue | null>(null);

interface StrategyProviderProps {
  children: ReactNode;
  strategyPosition: StrategyPosition;
}

const initialWithdrawStrategy = (strategyPosition: StrategyPosition): WithdrawStrategy => {
  return {
    id: strategyPosition.strategyId,
    withdrawAmount: strategyPosition.strategyDepositedAmountUi,
    isWithdrawByVault: false,
    selectedAsset: strategyPosition.vaults[0].token, //TODO: fix this
    vaults: strategyPosition.vaults.map((vault) => ({
      ...vault,
      withdrawAmount: vault.amountUi,
      isActive: false,
      selectedAsset: vault.token,
    })),
  };
};

export const StrategyProvider = ({ children, strategyPosition }: StrategyProviderProps) => {
  const [depositStrategy, setDepositStrategy] = useState<Strategy | null>(null);

  const [withdrawStrategy, setWithdrawStrategy] = useState<WithdrawStrategy>(() =>
    initialWithdrawStrategy(strategyPosition)
  );
  const [slippage, setSlippage] = useState(localStorageService.getSlippage());

  const handleDepositAmountChange = useCallback((amount: number) => {
    setDepositStrategy((prev) => {
      if (!prev) return null;
      return updateAmount(prev, amount);
    });
  }, []);

  const handleDepositAllocationChange = useCallback((vaultId: string, amount: number) => {
    setDepositStrategy((prev) => {
      if (!prev) return null;
      return updateAllocation(prev, vaultId, amount);
    });
  }, []);

  const handleDepositRemoveVault = useCallback((vaultId: string) => {
    setDepositStrategy((prev) => {
      if (!prev) return null;
      return removeVaultFromStrategy(prev, vaultId);
    });
  }, []);

  const handleDepositToggleVault = useCallback((vault: VaultInfoResponse) => {
    setDepositStrategy((prev) => toggleVaultInStrategy(prev, vault));
  }, []);

  const handleDepositAddVault = useCallback((vault: VaultInfoResponse) => {
    setDepositStrategy((prev) => addVaultToStrategy(prev, vault));
  }, []);

  const handleWithdrawSelectedAssetChange = useCallback((asset: UserTokenView) => {
    setWithdrawStrategy(
      (prev): WithdrawStrategy => ({
        ...prev,
        selectedAsset: asset,
      })
    );
  }, []);

  const handleWithdrawAmountChange = useCallback((amount: number) => {
    setWithdrawStrategy(
      (prev): WithdrawStrategy => ({
        ...prev,
        withdrawAmount: amount,
      })
    );
  }, []);

  const handleWithdrawByVaultChange = useCallback((isActive: boolean) => {
    setWithdrawStrategy(
      (prev): WithdrawStrategy => ({
        ...prev,
        isWithdrawByVault: isActive,
      })
    );
  }, []);

  const handleWithdrawVaultAmountChange = useCallback((vaultId: string, amount: number) => {
    setWithdrawStrategy(
      (prev): WithdrawStrategy => ({
        ...prev,
        vaults: prev.vaults.map((vault) => ({
          ...vault,
          withdrawAmount: vault.id === vaultId ? amount : vault.withdrawAmount,
        })),
      })
    );
  }, []);

  const handleWithdrawToggleVaultActive = useCallback((vaultId: string, isActive: boolean) => {
    setWithdrawStrategy((prev): WithdrawStrategy => {
      const updatedVaults = prev.vaults.map((vault) => ({
        ...vault,
        isActive: vault.id === vaultId ? isActive : vault.isActive,
      }));

      return {
        ...prev,
        vaults: updatedVaults,
      };
    });
  }, []);

  const handleWithdrawVaultAssetChange = useCallback((vaultId: string, asset: UserTokenView) => {
    setWithdrawStrategy(
      (prev): WithdrawStrategy => ({
        ...prev,
        vaults: prev.vaults.map((vault) => ({
          ...vault,
          selectedAsset: vault.id === vaultId ? asset : vault.selectedAsset,
        })),
      })
    );
  }, []);

  const resetDepositStrategy = useCallback(() => {
    setDepositStrategy(null);
  }, []);

  const resetWithdrawStrategy = useCallback(() => {
    setWithdrawStrategy(initialWithdrawStrategy(strategyPosition));
  }, [strategyPosition]);

  const handleSlippageChange = useCallback((slippage: number) => {
    setSlippage(slippage);
    localStorageService.setSlippage(slippage);
  }, []);

  const value = useMemo<StrategyContextValue>(
    () => ({
      depositStrategy,
      setDepositStrategy,
      withdrawStrategy,
      setWithdrawStrategy,
      slippage,

      handleSlippageChange,
      handleDepositAmountChange,
      handleDepositAllocationChange,
      handleDepositRemoveVault,
      handleDepositToggleVault,
      handleDepositAddVault,

      handleWithdrawSelectedAssetChange,
      handleWithdrawAmountChange,
      handleWithdrawByVaultChange,
      handleWithdrawVaultAmountChange,
      handleWithdrawToggleVaultActive,
      handleWithdrawVaultAssetChange,

      resetDepositStrategy,
      resetWithdrawStrategy,
    }),
    [
      depositStrategy,
      withdrawStrategy,
      slippage,
      handleSlippageChange,

      handleDepositAmountChange,
      handleDepositAllocationChange,
      handleDepositRemoveVault,
      handleDepositToggleVault,
      handleDepositAddVault,

      handleWithdrawSelectedAssetChange,
      handleWithdrawAmountChange,
      handleWithdrawByVaultChange,
      handleWithdrawVaultAmountChange,
      handleWithdrawToggleVaultActive,
      handleWithdrawVaultAssetChange,

      resetDepositStrategy,
      resetWithdrawStrategy,
    ]
  );

  return <StrategyContext.Provider value={value}>{children}</StrategyContext.Provider>;
};

export const useStrategyContext = (): StrategyContextValue => {
  const context = useContext(StrategyContext);
  if (!context) {
    throw new Error("useStrategyContext must be used within a StrategyProvider");
  }
  return context;
};

import { useMemo } from "react";
import { useParams } from "react-router";
import type { StrategyInfoResponse, StrategyVaultInfo, UserTokenView, VaultInfoResponse } from "@/api";
import { formatUnits } from "@/common/utils/format";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { useStrategyById } from "@/strategy/queries";
import { useVaults } from "@/vaults/queries";

export type StrategyPositionVault = VaultInfoResponse &
  StrategyVaultInfo & { token: UserTokenView; amountUi: number; amountUsd: number };

export interface StrategyPosition extends StrategyInfoResponse {
  strategyDepositedAmount: number;
  strategyDepositedAmountUi: number;
  strategyDepositedAmountUsd: number;
  vaults: StrategyPositionVault[];
}

export const useStrategyPosition = (): { strategy: StrategyPosition | null; isLoading: boolean } => {
  const { address } = useSolanaWallet();
  const enabled = !!address;

  const { strategyId } = useParams<{ strategyId: string }>();

  const { data: strategyApi, isLoading: isStrategyLoading } = useStrategyById(
    { strategyId: strategyId ?? "" },
    { enabled }
  );
  const { data: vaults, isLoading: isVaultsLoading } = useVaults({ enabled });
  const { userTokens, isLoading: isUserTokensLoading } = useUserTokens({ enabled: enabled });

  const isLoading = isStrategyLoading || isVaultsLoading || isUserTokensLoading;

  const strategy = useMemo(() => {
    if (!strategyApi || !vaults || isLoading) return null;

    const vaultsMap = new Map(vaults.map((v) => [v.id, v]));

    const strategyVaults = strategyApi.vaults
      .map((strategyVault) => {
        const vault = vaultsMap.get(strategyVault.id);
        const token = vault ? userTokens.map.get(vault.inputTokenMint) : undefined;

        if (!token || !vault) return null;
        const amountUi = Number(formatUnits(strategyVault.amount.toFixed(), token.decimals));
        return {
          ...strategyVault,
          ...vault,
          token,
          amountUi,
          amountUsd: token.usdPrice * amountUi,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return {
      ...strategyApi,
      vaults: strategyVaults,
      strategyDepositedAmount: strategyVaults.reduce((acc, v) => acc + v.amount, 0),
      strategyDepositedAmountUi: strategyVaults.reduce((acc, v) => acc + v.amountUi, 0),
      strategyDepositedAmountUsd: strategyVaults.reduce((acc, v) => acc + v.amountUsd, 0),
    };
  }, [vaults, userTokens.map, strategyApi, isLoading]);

  return { strategy, isLoading };
};

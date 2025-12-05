import { useMemo } from "react";
import { useParams } from "react-router";
import type { StrategyInfoResponse, StrategyVaultInfo, UserTokenView, VaultInfoResponse } from "@/api";
import { formatUnits } from "@/common/utils/format";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { useStrategyById } from "@/strategy/queries";
import { useVaults } from "@/vaults/queries";

export type StrategyPositionVault = VaultInfoResponse & StrategyVaultInfo & { token: UserTokenView; amountUi: number };

export interface StrategyPosition extends StrategyInfoResponse {
  strategyDepositedAmount: number;
  strategyDepositedAmountUi: number;
  vaults: StrategyPositionVault[];
}

export const useStrategyPosition = (): StrategyPosition | null => {
  const { strategyId } = useParams<{ strategyId: string }>();
  const { data: strategy } = useStrategyById({ strategyId: strategyId ?? "" });
  const { data: vaults } = useVaults();
  const { userTokens } = useUserTokens();

  const positions = useMemo(() => {
    if (!strategy || !vaults) return null;

    const vaultsMap = new Map(vaults.map((v) => [v.id, v]));

    const strategyVaults = strategy.vaults
      .map((strategyVault) => {
        const vault = vaultsMap.get(strategyVault.id);
        const token = vault ? userTokens.map.get(vault.inputTokenMint) : undefined;

        if (!token || !vault) return null;
        return {
          ...strategyVault,
          ...vault,
          token,
          amountUi: Number(formatUnits(strategyVault.amount.toFixed(), token.decimals)),
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return {
      ...strategy,
      vaults: strategyVaults,
      strategyDepositedAmount: strategyVaults.reduce((acc, v) => acc + v.amount, 0),
      strategyDepositedAmountUi: strategyVaults.reduce((acc, v) => acc + v.amountUi, 0),
    };
  }, [vaults, userTokens.map, strategy]);

  return positions;
};

import { useMemo } from "react";
import { useParams } from "react-router";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { useStrategyById } from "@/strategy/queries";
import { useVaults } from "@/vaults/queries";

export const useStrategyPosition = () => {
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
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return {
      ...strategy,
      vaults: strategyVaults,
      strategyDepositedAmount: strategy.vaults.reduce((acc, v) => acc + v.amount, 0),
    };
  }, [vaults, userTokens.map, strategy]);

  return positions;
};

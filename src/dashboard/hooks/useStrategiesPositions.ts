import { useMemo } from "react";
import { formatUnits } from "@/common/utils/format";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { useUserStrategies } from "@/strategy/queries";
import { useVaults } from "@/vaults/queries";

export const useStrategiesPositions = () => {
  const { address } = useSolanaWallet();
  const { data: vaults, isLoading: isVaultsLoading } = useVaults({ enabled: !!address });
  const { data: userStrategies, isLoading: isUserStrategiesLoading } = useUserStrategies({ enabled: !!address });
  const { userTokens, isLoading: isUserTokensLoading } = useUserTokens({ enabled: !!address });

  const isLoading = isUserStrategiesLoading || isUserTokensLoading || isVaultsLoading;

  const positions = useMemo(() => {
    if (!userStrategies || !vaults || isLoading) return [];

    const vaultsMap = new Map(vaults.map((v) => [v.id, v]));

    return userStrategies
      .map((strategy) => {
        return {
          ...strategy,
          vaults: strategy.vaults
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
            .filter((v): v is NonNullable<typeof v> => v !== null),
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => ({
        ...p,
        myPositionUsd: p.vaults.reduce((acc, vault) => {
          const token = userTokens.map.get(vault.inputTokenMint);
          if (!token) return acc;
          const amountUSD = Number(formatUnits(vault.amount.toFixed(), token.decimals)) * token.usdPrice;
          return acc + amountUSD;
        }, 0),
      }));
  }, [userStrategies, vaults, userTokens, isLoading]);

  return { positions, isLoading };
};

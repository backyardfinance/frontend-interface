import { useMemo } from "react";
import type { UserTokenView } from "@/api";
import type { JupiterSwap } from "@/jupiter/api";
import { useJupiterSwapHoldings, useJupiterSwapSearch } from "@/jupiter/queries/useJupiterSwap";
import { useVaults } from "@/vaults/queries";

const buildSplTokens = (
  mints: string[],
  tokensMap: { [key: string]: Array<JupiterSwap.TokenAccount> } | undefined,
  tokenInfoMap: Map<string, JupiterSwap.MintInformation>
): UserTokenView[] => {
  return mints
    .map((mint) => {
      const tokenInfo = tokenInfoMap.get(mint);

      if (!tokenInfo?.decimals || !tokenInfo?.usdPrice || !tokenInfo?.name || !tokenInfo?.symbol || !tokenInfo?.icon) {
        return null;
      }

      const accounts = tokensMap?.[mint];
      const amount = accounts ? accounts.reduce((sum, acc) => sum + BigInt(acc.amount), 0n) : 0n;
      const uiAmount = Number(amount) / 10 ** tokenInfo.decimals;
      const amountUsd = uiAmount * tokenInfo.usdPrice;

      return {
        mint,
        isNative: false,
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
        symbol: tokenInfo.symbol,
        icon: tokenInfo.icon,
        usdPrice: tokenInfo.usdPrice,
        amount,
        amountUsd,
        uiAmount,
      };
    })
    .filter((token): token is UserTokenView => token !== null);
};

export const useUserTokens = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const { data: vaults } = useVaults({ enabled });
  const mintList = useMemo(() => vaults?.map((vault) => vault.inputTokenMint) ?? [], [vaults]);
  const { data: holdings, isLoading: isHoldingsLoading } = useJupiterSwapHoldings();

  const { data: tokens, isLoading: isTokensLoading } = useJupiterSwapSearch(mintList, { enabled });

  const userTokens = useMemo(() => {
    if (!tokens) {
      return { arr: [], map: new Map<string, UserTokenView>() };
    }
    const tokenInfoMap = new Map(tokens.filter((t) => t.id).map((t) => [t.id as string, t]));

    const splTokens = buildSplTokens(mintList, holdings?.tokens, tokenInfoMap);

    const tokenMap = new Map(splTokens.map((t) => [t.mint, t]));

    return { arr: splTokens, map: tokenMap };
  }, [holdings, tokens, mintList]);

  return {
    sol: { amount: holdings?.amount ?? "0", uiAmount: holdings?.uiAmountString ?? "0" },
    userTokens,
    isLoading: isHoldingsLoading || isTokensLoading,
  };
};

// import type { UseQueryOptions } from "@tanstack/react-query";
// import { useQuery } from "@tanstack/react-query";
// import { solanaApi, type UserPortfolioView } from "@/api";
// import { queryKeys } from "@/api/query-keys";
// import { useSolanaWallet } from "./useSolanaWallet";

// type UseUserTokensOptions = Omit<UseQueryOptions<UserPortfolioView, Error>, "queryKey" | "queryFn">;

// export const useUserTokens = (options?: UseUserTokensOptions) => {
//   const { address: walletAddress } = useSolanaWallet();

//   return useQuery({
//     queryKey: queryKeys.userTokens(walletAddress ?? ""),
//     queryFn: async () => {
//       if (!walletAddress) throw Error("useUserTokens: userId is missing");
//       const { data } = await solanaApi.solanaControllerGetUserTokens({ walletAddress });
//       return data as unknown as UserPortfolioView;
//     },
//     ...options,
//     enabled: !!walletAddress && options?.enabled,
//   });
// };

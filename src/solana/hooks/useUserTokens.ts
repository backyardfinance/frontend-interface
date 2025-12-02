import { useMemo } from "react";
import type { UserTokenView } from "@/api";
import type { JupiterSwap } from "@/jupiter/api";
import { useJupiterSwapHoldings, useJupiterSwapSearch } from "@/jupiter/queries/useJupiterSwap";
import { useVaults } from "@/vaults/queries";

const buildSplTokens = (
  tokensMap: { [key: string]: Array<JupiterSwap.TokenAccount> },
  tokenInfoMap: Map<string, JupiterSwap.MintInformation>
): UserTokenView[] => {
  return Object.entries(tokensMap)
    .map(([mint, accounts]) => {
      const tokenInfo = tokenInfoMap.get(mint);

      if (!tokenInfo?.decimals || !tokenInfo?.usdPrice || !tokenInfo?.name || !tokenInfo?.symbol || !tokenInfo?.icon) {
        return null;
      }

      //TODO: check if this is correct
      const amount = accounts.reduce((sum, acc) => sum + BigInt(acc.amount), 0n);
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

export const useUserTokens = () => {
  const { data: vaults } = useVaults();
  const mints = useMemo(() => new Set(vaults?.map((vault) => vault.inputTokenMint) ?? []), [vaults]);

  const { data: holdings, isLoading: isHoldingsLoading } = useJupiterSwapHoldings();

  const mintList = useMemo(() => {
    if (!holdings) return [];
    const splMints = Object.keys(holdings.tokens);
    return splMints.filter((mint) => mints.has(mint));
  }, [holdings, mints]);

  const { data: tokens, isLoading: isTokensLoading } = useJupiterSwapSearch(mintList);

  const userTokens = useMemo(() => {
    if (!holdings || !tokens) {
      return { arr: [], map: new Map<string, UserTokenView>() };
    }
    const tokenInfoMap = new Map(tokens.filter((t) => t.id).map((t) => [t.id as string, t]));

    const splTokens = buildSplTokens(holdings.tokens, tokenInfoMap);

    const tokenMap = new Map(splTokens.map((t) => [t.mint, t]));

    return { arr: splTokens, map: tokenMap };
  }, [holdings, tokens]);

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

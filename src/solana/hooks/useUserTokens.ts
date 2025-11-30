import { useMemo } from "react";
import type { UserTokenView } from "@/api";
import { SOL_MINT } from "@/config";
import type { JupiterSwap } from "@/jupiter/api";
import { useJupiterSwapHoldings } from "@/jupiter/queries/useJupiterSwap";
import { useJupiterTokensSearch } from "@/jupiter/queries/useJupiterTokens";

const buildSolToken = (
  holdings: JupiterSwap.HoldingsResponse,
  solTokenInfo: JupiterSwap.MintInformation | undefined
): UserTokenView | null => {
  if (
    !holdings.amount ||
    !solTokenInfo?.decimals ||
    !solTokenInfo?.usdPrice ||
    !solTokenInfo?.name ||
    !solTokenInfo?.symbol ||
    !solTokenInfo?.icon
  ) {
    return null;
  }

  const amount = BigInt(holdings.amount);
  const uiAmount = holdings.uiAmount;
  const amountUsd = uiAmount * solTokenInfo.usdPrice;

  return {
    mint: SOL_MINT,
    isNative: true,
    name: solTokenInfo.name,
    decimals: solTokenInfo.decimals,
    symbol: solTokenInfo.symbol,
    icon: solTokenInfo.icon,
    usdPrice: solTokenInfo.usdPrice,
    amount,
    amountUsd,
    uiAmount,
  };
};

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

export const useUserTokens = (setSelectedAsset?: (asset: UserTokenView | null) => void) => {
  const { data: holdings, isLoading: isHoldingsLoading } = useJupiterSwapHoldings();

  const mintList = useMemo(() => {
    if (isHoldingsLoading) return [];
    if (!holdings) return [SOL_MINT];

    const splMints = Object.keys(holdings.tokens);
    return [SOL_MINT, ...splMints];
  }, [holdings, isHoldingsLoading]);

  const { data: tokens, isLoading: isTokensLoading } = useJupiterTokensSearch(mintList);

  const userTokens = useMemo(() => {
    if (!holdings || !tokens) {
      return { arr: [], map: new Map<string, UserTokenView>() };
    }
    const tokenInfoMap = new Map(tokens.filter((t) => t.id).map((t) => [t.id as string, t]));

    const solToken = buildSolToken(holdings, tokenInfoMap.get(SOL_MINT));

    const splTokens = buildSplTokens(holdings.tokens, tokenInfoMap);

    const allTokens = solToken ? [solToken, ...splTokens] : splTokens;
    const tokenMap = new Map(allTokens.map((t) => [t.mint, t]));

    setSelectedAsset?.(allTokens[0] ?? null);

    return { arr: allTokens, map: tokenMap };
  }, [holdings, tokens]);

  return {
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

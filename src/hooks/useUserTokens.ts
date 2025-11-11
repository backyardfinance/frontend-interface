import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { solanaApi, type UserPortfolioView } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

type UseUserTokensOptions = Omit<UseQueryOptions<UserPortfolioView, Error>, "queryKey" | "queryFn">;

export const useUserTokens = (options?: UseUserTokensOptions) => {
  const { address: walletAddress } = useSolanaWallet();

  return useQuery({
    queryKey: queryKeys.userTokens(walletAddress ?? ""),
    queryFn: async () => {
      if (!walletAddress) throw Error("useUserTokens: userId is missing");
      const { data } = await solanaApi.solanaControllerGetUserTokens({ walletAddress });
      return data as unknown as UserPortfolioView;
    },
    ...options,
    enabled: !!walletAddress && options?.enabled,
  });
};

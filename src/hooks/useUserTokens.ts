import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { solanaApi, type UserPortfolioView } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

type UseUserTokensOptions = Omit<UseQueryOptions<UserPortfolioView, Error>, "queryKey" | "queryFn">;

export const useUserTokens = (options?: UseUserTokensOptions) => {
  const { address } = useSolanaWallet();
  return useQuery({
    queryKey: queryKeys.userTokens(address ?? ""),
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw Error("useUserTokens: userId is missing");
      const { data } = await solanaApi.solanaControllerGetUserTokens({ walletAddress: userId });
      return data as unknown as UserPortfolioView;
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

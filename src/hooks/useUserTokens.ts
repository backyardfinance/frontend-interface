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
      if (!address) throw Error("useUserTokens: address is missing");
      const { data } = await solanaApi.solanaControllerGetUserTokens({ userId: address });
      return data as unknown as UserPortfolioView; //TODO: remove type
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

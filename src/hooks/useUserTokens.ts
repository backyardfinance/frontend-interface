import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { solanaApi } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

//TODO: add type
type UseUserTokensOptions = Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;

export const useUserTokens = (options?: UseUserTokensOptions) => {
  const { address } = useSolanaWallet();
  return useQuery({
    queryKey: queryKeys.userTokens(address ?? ""),
    queryFn: async () => {
      if (!address) throw Error("useUserTokens: address is missing");
      const { data } = await solanaApi.solanaControllerGetUserTokens({ userId: address });
      return data;
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

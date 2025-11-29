import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { queryKeys } from "@/api/query-keys";
import { type JupiterTokens, jupiterTokensApi } from "@/jupiter/api";

type useJupiterTokensSearchOptions = Omit<
  UseQueryOptions<JupiterTokens.MintInformation[], AxiosError<{ message: string }>>,
  "queryKey" | "queryFn"
>;

export const useJupiterTokensSearch = (mints: string[], options?: useJupiterTokensSearchOptions) => {
  return useQuery({
    queryKey: queryKeys.jupiterTokens.search(mints),
    queryFn: async () => {
      const { data } = await jupiterTokensApi.searchGet({ query: mints.join(",") });
      return data;
    },
    enabled: Boolean(mints.length),
    refetchOnWindowFocus: false,
    ...options,
  });
};

import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type Jupiter, jupiterApi } from "@/api/jupiter";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";

type UseTokenSearchOptions = Omit<
  UseQueryOptions<Jupiter.MintInformation[], AxiosError<{ message: string }>>,
  "queryKey" | "queryFn"
>;

export const useTokenSearch = (query: string, options?: UseTokenSearchOptions) => {
  return useQuery({
    queryKey: queryKeys.jupiter.search(query),
    queryFn: async () => {
      const { data } = await jupiterApi.searchGet({ query });
      return data;
    },
    enabled: Boolean(query.trim()),
    refetchOnWindowFocus: false,
    ...options,
  });
};

type UseTokenHoldingsOptions = Omit<UseQueryOptions<Jupiter.HoldingsResponse, Error>, "queryKey" | "queryFn">;

export const useTokenHoldings = (options?: UseTokenHoldingsOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: address ? queryKeys.jupiter.holdings(address) : ["jupiter-holdings-disabled"],
    queryFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      const { data } = await jupiterApi.holdingsAddressGet({ address: address });
      return data;
    },
    enabled: Boolean(address),
    // refetchInterval: 30000,
    // staleTime: 10000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useTokenShield = (): UseMutationResult<Jupiter.ShieldGet200Response, Error, string[], unknown> => {
  return useMutation({
    mutationFn: async (mints: string[]) => {
      if (mints.length === 0) {
        throw new Error("No token mints provided");
      }
      const { data } = await jupiterApi.shieldGet({ mints: mints.join(",") });
      return data;
    },
  });
};

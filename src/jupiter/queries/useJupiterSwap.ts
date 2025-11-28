import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Big from "big.js";
import { queryKeys } from "@/api/query-keys";
import { type JupiterSwap, jupiterSwapApi } from "@/jupiter/api";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

type UseJupiterQuoteOptions = Omit<
  UseQueryOptions<
    JupiterSwap.OrderGet200Response,
    AxiosError<JupiterSwap.OrderGet400Response | JupiterSwap.OrderGet500Response>
  >,
  "queryKey" | "queryFn"
>;

export const useJupiterQuote = (params: JupiterSwap.DefaultApiOrderGetRequest, options?: UseJupiterQuoteOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey:
      params.inputMint && params.outputMint && params.amount
        ? queryKeys.jupiterSwap.quote({
            inputMint: params.inputMint,
            outputMint: params.outputMint,
            amount: params.amount,
          })
        : ["jupiter-quote-disabled"],
    queryFn: async () => {
      const { data } = await jupiterSwapApi.orderGet({
        ...params,
        taker: address,
      });
      return data;
    },
    enabled:
      !!address && !!params.inputMint && !!params.outputMint && !!params.amount && Big(params.amount ?? "0").gt(0),
    // refetchInterval: 10000,
    // staleTime: 5000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// export const useSwap = (): UseMutationResult<
//   JupiterSwap.ExecutePost200Response,
//   AxiosError<JupiterSwap.ExecutePost400Response>,
//   JupiterSwap.ExecutePostRequest,
//   unknown
// > => {
//   return useMutation({
//     mutationFn: async (executePostRequest: JupiterSwap.ExecutePostRequest): Promise<JupiterSwap.ExecutePost200Response> => {
//       const { data } = await jupiterSwapApi.executePost({
//         executePostRequest,
//       });
//       return data;
//     },
//   });
// };

type useJupiterSwapSearchOptions = Omit<
  UseQueryOptions<JupiterSwap.MintInformation[], AxiosError<{ message: string }>>,
  "queryKey" | "queryFn"
>;

export const useJupiterSwapSearch = (query: string, options?: useJupiterSwapSearchOptions) => {
  return useQuery({
    queryKey: queryKeys.jupiterSwap.search(query),
    queryFn: async () => {
      const { data } = await jupiterSwapApi.searchGet({ query });
      return data;
    },
    enabled: Boolean(query.trim()),
    refetchOnWindowFocus: false,
    ...options,
  });
};

type useJupiterSwapHoldingsOptions = Omit<UseQueryOptions<JupiterSwap.HoldingsResponse, Error>, "queryKey" | "queryFn">;

/**
 * Get the token holdings for the connected wallet
 * @param options - Options for the query
 * @returns The token holdings
 */
export const useJupiterSwapHoldings = (options?: useJupiterSwapHoldingsOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: address ? queryKeys.jupiterSwap.holdings(address) : ["jupiter-holdings-disabled"],
    queryFn: async () => {
      if (!address) throw new Error("Wallet not connected");
      const { data } = await jupiterSwapApi.holdingsAddressGet({ address: address });

      return data;
    },
    enabled: Boolean(address),
    // refetchInterval: 30000,
    // staleTime: 10000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useJupiterSwapShield = (): UseMutationResult<
  JupiterSwap.ShieldGet200Response,
  Error,
  string[],
  unknown
> => {
  return useMutation({
    mutationFn: async (mints: string[]) => {
      if (mints.length === 0) {
        throw new Error("No token mints provided");
      }
      const { data } = await jupiterSwapApi.shieldGet({ mints: mints.join(",") });
      return data;
    },
  });
};

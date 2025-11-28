import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type Jupiter, jupiterApi } from "@/api/jupiter";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "../useSolanaWallet";

type UseSwapQuoteOptions = Omit<
  UseQueryOptions<Jupiter.OrderGet200Response, AxiosError<Jupiter.OrderGet400Response | Jupiter.OrderGet500Response>>,
  "queryKey" | "queryFn"
>;

export const useSwapQuote = (params: Jupiter.DefaultApiOrderGetRequest, options?: UseSwapQuoteOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: queryKeys.jupiter.quote({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
    }),
    queryFn: async () => {
      const { data } = await jupiterApi.orderGet({
        ...params,
        taker: address,
      });
      return data;
    },
    enabled: Boolean(address),
    // refetchInterval: 10000,
    // staleTime: 5000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useSwap = (): UseMutationResult<
  Jupiter.ExecutePost200Response,
  AxiosError<Jupiter.ExecutePost400Response>,
  Jupiter.ExecutePostRequest,
  unknown
> => {
  return useMutation({
    mutationFn: async (executePostRequest: Jupiter.ExecutePostRequest): Promise<Jupiter.ExecutePost200Response> => {
      const { data } = await jupiterApi.executePost({
        executePostRequest,
      });
      return data;
    },
  });
};

import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { type SolanaApiSolanaControllerQuoteDepositRequest, solanaApi } from "@/api";
import { queryKeys } from "@/api/query-keys";

//TODO: add type
type UseDepositQuoteOptions = Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;

export const useDepositQuote = (
  quoteDepositDto: SolanaApiSolanaControllerQuoteDepositRequest["quoteDepositDto"],
  options?: UseDepositQuoteOptions
) => {
  return useQuery({
    queryKey: queryKeys.quoteDeposit(quoteDepositDto),
    queryFn: async () => {
      if (!quoteDepositDto.signer) throw Error("useDepositQuote: signer is missing");
      const { data } = await solanaApi.solanaControllerQuoteDeposit({ quoteDepositDto });
      return data;
    },
    ...options,
    enabled: !!quoteDepositDto.signer && options?.enabled,
  });
};

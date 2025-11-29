import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { type StrategyInfoResponse, strategyApi } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

type StrategyByIdRequest = {
  strategyId: string;
};

type UseStrategyByIdOptions = Omit<UseQueryOptions<StrategyInfoResponse, Error>, "queryKey" | "queryFn">;

export const useStrategyById = ({ strategyId }: StrategyByIdRequest, options?: UseStrategyByIdOptions) => {
  return useQuery({
    queryKey: queryKeys.strategies.strategyByUser(strategyId ?? ""),
    queryFn: async () => {
      if (!strategyId) throw Error("useStrategyById: strategyId is missing");
      const { data } = await strategyApi.strategyControllerGetStrategy({ strategyId });
      return data as unknown as StrategyInfoResponse;
    },
    ...options,
    enabled: !!strategyId && options?.enabled,
  });
};

type UseStrategiesOptions = Omit<UseQueryOptions<StrategyInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useUserStrategies = (options?: UseStrategiesOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: queryKeys.strategies.strategyByUser(address ?? ""),
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw Error("useStrategies: userId is missing");
      const { data } = await strategyApi.strategyControllerGetStrategies({ walletAddress: userId });
      return data as unknown as StrategyInfoResponse[];
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

//not used
// export const useDepositStrategyQuote = (type: GetQuoteDtoTypeEnum, deposits: VaultDepositDto[]) => {
//   const { address: walletAddress } = useSolanaWallet();
//   return useQuery({
//     queryKey: queryKeys.quote.quoteDeposit({ walletAddress, type, deposits }),
//     queryFn: async () => {
//       const internalWalletAddress = walletAddress || "WalletAddress";
//       const { data } = await quoteApi.quoteControllerGetQuote({
//         getQuoteDto: {
//           walletAddress: internalWalletAddress,
//           type: type,
//           deposits: deposits,
//         },
//       });
//       return data;
//     },
//     enabled: !!walletAddress && !!type && !!deposits.length,
//     retry: false,
//   });
// };

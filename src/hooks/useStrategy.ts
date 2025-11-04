import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type CreateStrategyDto, type StrategyInfoResponse, strategyApi } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

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
      const { data } = await strategyApi.strategyControllerGetStrategies({ userId });
      return data as unknown as StrategyInfoResponse[];
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

export const useCreateStrategy = () => {
  //TODO: invalidate query
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStrategyDto) => strategyApi.strategyControllerCreate({ createStrategyDto: data }),
  });
};

export const useDeleteStrategy = () => {
  //TODO: invalidate query
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (strategyId: string) => strategyApi.strategyControllerDeleteStrategy({ strategyId }),
  });
};
